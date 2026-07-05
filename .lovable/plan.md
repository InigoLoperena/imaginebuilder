
# Equity Policy Engine

Extend the venture builder so each project can run on one of two independent equity models, chosen by the Super Admin, without breaking anything that already works.

## Two models, one project at a time

- **Dynamic Hours Pool** — the current behavior. Everyone's % floats based on the pool of approved hours. No changes to its math.
- **Fixed Hour Conversion** — hours convert into a locked % using a configurable ratio (e.g. `10 hours = 1%`). Once earned, that % is immutable and recorded in the ledger.

Each project stores which policy is active. Switching models is an admin action and is logged.

## What the Super Admin configures per policy

- Type: `dynamic_pool` or `fixed_conversion`
- Hours required for 1% (fixed only)
- Maximum equity available under the policy (cap, default 100%)
- Which hours count: `approved_only` (default) or `all`
- Effective date (equity only accrues from this date forward)
- Rounding rule: `2 decimals`, `4 decimals`, or `no rounding`
- Optional vesting: cliff (months) + linear vesting duration (months)

Policies are versioned — editing an active policy creates a new version and closes the previous one, so the ledger stays auditable.

## Pages added

1. **Equity Settings** (`/app/admin/equity`) — list of policies per project, create/edit form, activate/deactivate.
2. **Project Equity Dashboard** (`/app/projects/:id/equity`) — total allocated %, remaining %, per-contributor bar, active policy summary.
3. **Equity Ledger** (`/app/projects/:id/equity/ledger`) — append-only table of every equity transaction (who, when, hours, %, policy version, reason).
4. **Contributor Equity Summary** (`/app/me/equity`) — every project the user contributes to, accumulated %, vested vs unvested, recent transactions.
5. **Equity Simulator** (modal inside Equity Settings) — admin plugs in a candidate ratio and horizon, sees projected allocation across current contributors without writing anything.

## Calculation engine

Runs whenever an hour entry transitions to `approved` (or on any relevant hour change if the policy counts all hours):

```text
on hour_entry approved:
  policy = active_policy(project, at = entry.work_date)
  if policy.type == fixed_conversion:
     pct = round(entry.hours / policy.hours_per_percent, policy.rounding)
     if project.total_allocated + pct > policy.max_equity: clamp + flag
     write EquityTransaction(+pct, entry, policy.version)
  if policy.type == dynamic_pool:
     recompute existing pool (unchanged code path)
```

Vesting is applied at read time: `vested_pct = earned_pct * vesting_factor(now, entry.date, policy)`.

## Ledger

Immutable, insert-only. Rows never mutate. Corrections are new rows with negative % and a `reason` field. Every row references the exact policy version that produced it.

## Roles

- **SuperAdmin**: full control of policies, can switch model, can post correction ledger entries.
- **Admin**: approve/reject hours, view everything, cannot change equity policy.
- **Contributor**: submit hours, see own equity, see project totals if the project exposes them.

## Data model (technical)

New tables in `public`:

- `equity_policies` — `id`, `project_id`, `version`, `type`, `hours_per_percent`, `max_equity`, `count_mode`, `effective_from`, `rounding`, `vesting_cliff_months`, `vesting_duration_months`, `is_active`, `created_by`.
- `equity_transactions` — `id`, `project_id`, `user_id`, `policy_id`, `hour_entry_id` (nullable, for corrections), `hours`, `percentage_delta`, `reason`, `created_at`. Append-only (no UPDATE/DELETE grants to authenticated).
- `vb_projects.equity_model` — `text`, `'dynamic_pool' | 'fixed_conversion'`, default `'dynamic_pool'` so existing projects keep working.

Reuses existing tables:

- `vb_time_entries` gets a `status` column (`pending | approved | rejected`, default `approved` to preserve current behavior) plus `approved_by`, `approved_at`.
- `vb_participations` / `vb_participation_history` continue to serve the dynamic pool path unchanged.

Server-side pieces:

- Postgres function `apply_equity_transaction(entry_id)` — SECURITY DEFINER, called by a trigger `AFTER UPDATE OF status ON vb_time_entries WHEN NEW.status = 'approved'`.
- Postgres function `simulate_fixed_conversion(project_id, hours_per_percent, max_equity)` — read-only, returns projected allocation JSON for the simulator.
- RLS: policies readable by project members, writable by SuperAdmin only. Ledger readable by project members, only `service_role` / SECURITY DEFINER can insert.

## Folder structure

```text
src/features/equity/
  api.ts                    // hooks: policies, transactions, simulator
  calc.ts                   // pure functions (rounding, vesting, conversion)
  types.ts
  components/
    PolicyForm.tsx
    PolicyList.tsx
    EquitySummaryCard.tsx
    ContributorEquityTable.tsx
    LedgerTable.tsx
    SimulatorDialog.tsx
  pages/
    EquitySettingsPage.tsx
    ProjectEquityPage.tsx
    EquityLedgerPage.tsx
    MyEquityPage.tsx
```

UI stays in `components/` and `pages/`. All math and Supabase calls live in `calc.ts` and `api.ts` — no business logic in components. Reuses existing `Card`, `Table`, `Dialog`, `Switch`, `Select`, `OwnershipPie` where sensible.

## Design

Matches the existing dark navy + cyan accent admin surface: `Card` containers, tabular data with `tabular-nums`, muted labels, `Switch` for booleans, a single primary chart per page. No new color tokens.

## Rollout order

1. Migration: add columns/tables/functions/triggers + backfill `vb_time_entries.status = 'approved'`.
2. `features/equity` module (types, api, calc) + unit-testable pure functions.
3. Equity Settings page + Policy form + Simulator.
4. Project Equity Dashboard + Ledger.
5. Contributor "My Equity" page + nav entries.
6. Wire hour-approval flow (admin can now hold hours as `pending`).

Existing dynamic-pool projects keep their current UI and math. New fixed-conversion projects opt in from Equity Settings.

## Open questions before I build

- Should contributors see **other contributors' %** on the project dashboard, or only their own + totals?
- Do you want the hour-approval workflow enabled for all projects now, or keep hours auto-approved and only require approval on fixed-conversion projects?
- For vesting: cliff + linear enough, or do you also need milestone-based vesting?
