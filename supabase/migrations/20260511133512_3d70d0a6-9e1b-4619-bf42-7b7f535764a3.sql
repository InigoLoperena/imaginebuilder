
-- Remove public exposure of ambassador emails and user IDs
DROP POLICY IF EXISTS "Anyone can view ambassador nicknames for leaderboard" ON public.ambassador_profiles;
DROP POLICY IF EXISTS "Anyone can view confirmed submissions for leaderboard" ON public.store_submissions;

-- Recreate the leaderboard view explicitly with security_invoker=false so it
-- safely exposes only aggregated, non-sensitive columns (nickname + totals)
DROP VIEW IF EXISTS public.ambassador_leaderboard;
CREATE VIEW public.ambassador_leaderboard
WITH (security_invoker = false) AS
SELECT ap.nickname,
       count(ss.id) AS stores_count,
       COALESCE(sum(ss.commission_amount), 0::numeric) AS total_earned
FROM public.ambassador_profiles ap
LEFT JOIN public.store_submissions ss
  ON ap.user_id = ss.ambassador_id AND ss.status = 'confirmed'
GROUP BY ap.user_id, ap.nickname
HAVING count(CASE WHEN ss.status = 'confirmed' THEN 1 END) > 0
ORDER BY COALESCE(sum(ss.commission_amount), 0) DESC, count(ss.id) DESC;

GRANT SELECT ON public.ambassador_leaderboard TO anon, authenticated;
