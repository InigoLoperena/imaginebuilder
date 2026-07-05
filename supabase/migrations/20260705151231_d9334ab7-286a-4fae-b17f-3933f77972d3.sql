
-- ============ ENUMS ============
DO $$ BEGIN
  CREATE TYPE public.equity_model AS ENUM ('dynamic_pool', 'fixed_conversion');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.equity_count_mode AS ENUM ('approved_only', 'all');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.equity_rounding AS ENUM ('two', 'four', 'none');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

DO $$ BEGIN
  CREATE TYPE public.hour_entry_status AS ENUM ('pending', 'approved', 'rejected');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- ============ vb_projects: equity model ============
ALTER TABLE public.vb_projects
  ADD COLUMN IF NOT EXISTS equity_model public.equity_model NOT NULL DEFAULT 'dynamic_pool';

-- ============ vb_time_entries: approval workflow ============
ALTER TABLE public.vb_time_entries
  ADD COLUMN IF NOT EXISTS status public.hour_entry_status NOT NULL DEFAULT 'approved',
  ADD COLUMN IF NOT EXISTS approved_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS approved_at timestamptz;

UPDATE public.vb_time_entries SET status = 'approved' WHERE status IS NULL;

CREATE INDEX IF NOT EXISTS idx_vb_time_entries_status ON public.vb_time_entries(status);

-- allow admins to update any entry (needed for approve/reject)
DROP POLICY IF EXISTS "entries admin update" ON public.vb_time_entries;
CREATE POLICY "entries admin update" ON public.vb_time_entries
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

-- ============ equity_policies ============
CREATE TABLE IF NOT EXISTS public.equity_policies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  version int NOT NULL DEFAULT 1,
  type public.equity_model NOT NULL,
  hours_per_percent numeric(10,4),
  max_equity numeric(6,3) NOT NULL DEFAULT 100,
  count_mode public.equity_count_mode NOT NULL DEFAULT 'approved_only',
  effective_from date NOT NULL DEFAULT CURRENT_DATE,
  rounding public.equity_rounding NOT NULL DEFAULT 'four',
  vesting_cliff_months int NOT NULL DEFAULT 0,
  vesting_duration_months int NOT NULL DEFAULT 0,
  is_active boolean NOT NULL DEFAULT true,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (project_id, version)
);

CREATE INDEX IF NOT EXISTS idx_equity_policies_project_active
  ON public.equity_policies(project_id, is_active);

GRANT SELECT ON public.equity_policies TO authenticated;
GRANT ALL ON public.equity_policies TO service_role;

ALTER TABLE public.equity_policies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "equity_policies read authed" ON public.equity_policies
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "equity_policies admin write" ON public.equity_policies
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role))
  WITH CHECK (public.has_role(auth.uid(), 'admin'::public.app_role));

CREATE TRIGGER trg_equity_policies_updated
  BEFORE UPDATE ON public.equity_policies
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============ equity_transactions (immutable ledger) ============
CREATE TABLE IF NOT EXISTS public.equity_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.vb_projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_id uuid NOT NULL REFERENCES public.equity_policies(id) ON DELETE RESTRICT,
  policy_version int NOT NULL,
  hour_entry_id uuid REFERENCES public.vb_time_entries(id) ON DELETE SET NULL,
  hours numeric(10,2) NOT NULL DEFAULT 0,
  percentage_delta numeric(10,6) NOT NULL,
  reason text,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (hour_entry_id, policy_id)
);

CREATE INDEX IF NOT EXISTS idx_equity_tx_project ON public.equity_transactions(project_id);
CREATE INDEX IF NOT EXISTS idx_equity_tx_user ON public.equity_transactions(user_id);

-- Ledger: authenticated can only READ. Writes go through SECURITY DEFINER funcs.
GRANT SELECT ON public.equity_transactions TO authenticated;
GRANT ALL ON public.equity_transactions TO service_role;

ALTER TABLE public.equity_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "equity_tx read authed" ON public.equity_transactions
  FOR SELECT TO authenticated USING (true);

-- ============ FUNCTIONS ============

-- helper: return active policy for a project at a given date
CREATE OR REPLACE FUNCTION public.equity_active_policy(_project_id uuid, _at date DEFAULT CURRENT_DATE)
RETURNS public.equity_policies
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT * FROM public.equity_policies
   WHERE project_id = _project_id
     AND is_active = true
     AND effective_from <= _at
   ORDER BY version DESC
   LIMIT 1
$$;

-- helper: rounding
CREATE OR REPLACE FUNCTION public.equity_round(_value numeric, _mode public.equity_rounding)
RETURNS numeric
LANGUAGE sql IMMUTABLE
AS $$
  SELECT CASE _mode
    WHEN 'two'  THEN ROUND(_value, 2)
    WHEN 'four' THEN ROUND(_value, 4)
    ELSE _value
  END
$$;

-- apply equity for an approved hour entry (fixed conversion only)
CREATE OR REPLACE FUNCTION public.equity_apply_entry(_entry_id uuid)
RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  entry public.vb_time_entries;
  policy public.equity_policies;
  allocated numeric;
  delta numeric;
  cap_left numeric;
  tx_id uuid;
BEGIN
  SELECT * INTO entry FROM public.vb_time_entries WHERE id = _entry_id;
  IF entry IS NULL OR entry.status <> 'approved' THEN RETURN NULL; END IF;

  policy := public.equity_active_policy(entry.project_id, entry.work_date);
  IF policy IS NULL OR policy.type <> 'fixed_conversion' THEN RETURN NULL; END IF;
  IF policy.hours_per_percent IS NULL OR policy.hours_per_percent <= 0 THEN RETURN NULL; END IF;

  -- prevent double-posting
  IF EXISTS (SELECT 1 FROM public.equity_transactions
              WHERE hour_entry_id = _entry_id AND policy_id = policy.id) THEN
    RETURN NULL;
  END IF;

  delta := public.equity_round(entry.hours / policy.hours_per_percent, policy.rounding);

  SELECT COALESCE(SUM(percentage_delta), 0) INTO allocated
    FROM public.equity_transactions WHERE project_id = entry.project_id;
  cap_left := policy.max_equity - allocated;
  IF cap_left <= 0 THEN RETURN NULL; END IF;
  IF delta > cap_left THEN delta := cap_left; END IF;

  INSERT INTO public.equity_transactions(
    project_id, user_id, policy_id, policy_version, hour_entry_id,
    hours, percentage_delta, reason, created_by
  ) VALUES (
    entry.project_id, entry.user_id, policy.id, policy.version, entry.id,
    entry.hours, delta, 'auto: hour approved', entry.approved_by
  ) RETURNING id INTO tx_id;

  RETURN tx_id;
END;
$$;

-- trigger: fire on status → approved
CREATE OR REPLACE FUNCTION public.equity_on_entry_approved()
RETURNS trigger
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'approved' AND (TG_OP = 'INSERT' OR OLD.status IS DISTINCT FROM 'approved') THEN
    PERFORM public.equity_apply_entry(NEW.id);
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_equity_entry_approved_ins ON public.vb_time_entries;
CREATE TRIGGER trg_equity_entry_approved_ins
  AFTER INSERT ON public.vb_time_entries
  FOR EACH ROW EXECUTE FUNCTION public.equity_on_entry_approved();

DROP TRIGGER IF EXISTS trg_equity_entry_approved_upd ON public.vb_time_entries;
CREATE TRIGGER trg_equity_entry_approved_upd
  AFTER UPDATE OF status ON public.vb_time_entries
  FOR EACH ROW EXECUTE FUNCTION public.equity_on_entry_approved();

-- admin action: activate a policy (deactivates other active policies for the project)
CREATE OR REPLACE FUNCTION public.equity_activate_policy(_policy_id uuid)
RETURNS void
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  _project uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  SELECT project_id INTO _project FROM public.equity_policies WHERE id = _policy_id;
  IF _project IS NULL THEN RAISE EXCEPTION 'policy not found'; END IF;
  UPDATE public.equity_policies SET is_active = false
    WHERE project_id = _project AND id <> _policy_id;
  UPDATE public.equity_policies SET is_active = true WHERE id = _policy_id;
END;
$$;

-- admin action: post a correction transaction
CREATE OR REPLACE FUNCTION public.equity_post_correction(
  _project_id uuid, _user_id uuid, _delta numeric, _reason text
) RETURNS uuid
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  policy public.equity_policies;
  tx_id uuid;
BEGIN
  IF NOT public.has_role(auth.uid(), 'admin'::public.app_role) THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
  policy := public.equity_active_policy(_project_id, CURRENT_DATE);
  IF policy IS NULL THEN RAISE EXCEPTION 'no active policy'; END IF;
  INSERT INTO public.equity_transactions(
    project_id, user_id, policy_id, policy_version, hours, percentage_delta, reason, created_by
  ) VALUES (
    _project_id, _user_id, policy.id, policy.version, 0, _delta, COALESCE(_reason,'manual correction'), auth.uid()
  ) RETURNING id INTO tx_id;
  RETURN tx_id;
END;
$$;

-- read-only simulator: what would happen with these params right now?
CREATE OR REPLACE FUNCTION public.equity_simulate_fixed(
  _project_id uuid, _hours_per_percent numeric, _max_equity numeric DEFAULT 100, _rounding public.equity_rounding DEFAULT 'four'
) RETURNS jsonb
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  rows jsonb;
  total numeric;
BEGIN
  IF _hours_per_percent IS NULL OR _hours_per_percent <= 0 THEN
    RAISE EXCEPTION 'hours_per_percent must be > 0';
  END IF;
  SELECT COALESCE(jsonb_agg(row_to_json(x) ORDER BY (x.pct) DESC), '[]'::jsonb),
         COALESCE(SUM(x.pct), 0)
    INTO rows, total
  FROM (
    SELECT user_id,
           SUM(hours)::numeric AS hours,
           public.equity_round(LEAST(SUM(hours) / _hours_per_percent, _max_equity), _rounding) AS pct
    FROM public.vb_time_entries
    WHERE project_id = _project_id AND status = 'approved'
    GROUP BY user_id
  ) x;
  RETURN jsonb_build_object('rows', rows, 'total_allocated', total, 'max_equity', _max_equity);
END;
$$;
