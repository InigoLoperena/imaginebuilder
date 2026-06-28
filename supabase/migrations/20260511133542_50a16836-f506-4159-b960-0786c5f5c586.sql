
DROP VIEW IF EXISTS public.ambassador_leaderboard;

CREATE OR REPLACE FUNCTION public.get_ambassador_leaderboard()
RETURNS TABLE (nickname text, stores_count bigint, total_earned numeric)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT ap.nickname,
         count(ss.id) AS stores_count,
         COALESCE(sum(ss.commission_amount), 0::numeric) AS total_earned
  FROM public.ambassador_profiles ap
  LEFT JOIN public.store_submissions ss
    ON ap.user_id = ss.ambassador_id AND ss.status = 'confirmed'
  GROUP BY ap.user_id, ap.nickname
  HAVING count(CASE WHEN ss.status = 'confirmed' THEN 1 END) > 0
  ORDER BY COALESCE(sum(ss.commission_amount), 0) DESC, count(ss.id) DESC;
$$;

GRANT EXECUTE ON FUNCTION public.get_ambassador_leaderboard() TO anon, authenticated;
