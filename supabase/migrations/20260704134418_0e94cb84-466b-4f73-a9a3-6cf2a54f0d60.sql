
DROP POLICY IF EXISTS "project-logos public read" ON storage.objects;
CREATE POLICY "project-logos public read" ON storage.objects
  FOR SELECT TO anon, authenticated
  USING (bucket_id = 'project-logos');
