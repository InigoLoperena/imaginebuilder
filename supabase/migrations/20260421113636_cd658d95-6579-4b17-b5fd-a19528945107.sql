-- Blog posts table
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  cover_image_url TEXT,
  meta_title TEXT,
  meta_description TEXT,
  meta_keywords TEXT,
  published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(published, created_at DESC);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published posts"
ON public.blog_posts FOR SELECT
USING (published = true);

CREATE POLICY "Admins can view all posts"
ON public.blog_posts FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can insert posts"
ON public.blog_posts FOR INSERT
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update posts"
ON public.blog_posts FOR UPDATE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete posts"
ON public.blog_posts FOR DELETE
USING (has_role(auth.uid(), 'admin'::app_role));

CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Storage bucket for blog cover images
INSERT INTO storage.buckets (id, name, public)
VALUES ('blog-images', 'blog-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public can view blog images"
ON storage.objects FOR SELECT
USING (bucket_id = 'blog-images');

CREATE POLICY "Admins can upload blog images"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update blog images"
ON storage.objects FOR UPDATE
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete blog images"
ON storage.objects FOR DELETE
USING (bucket_id = 'blog-images' AND has_role(auth.uid(), 'admin'::app_role));