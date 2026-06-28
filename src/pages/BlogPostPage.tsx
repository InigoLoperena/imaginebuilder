import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { supabase } from "@/integrations/supabase/client";

interface Post {
  id: string;
  slug: string;
  title: string;
  description: string;
  content: string | null;
  cover_image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
}

const BlogPostPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const { data } = await supabase
        .from("blog_posts")
        .select("*")
        .eq("slug", slug)
        .eq("published", true)
        .maybeSingle();
      setPost((data as Post) || null);
      setLoading(false);
    })();
  }, [slug]);

  if (loading) {
    return (
      <div className="policy-page min-h-screen flex items-center justify-center">
        Loading…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="policy-page min-h-screen flex flex-col items-center justify-center gap-4">
        <p>Article not found.</p>
        <Link to="/blog" className="underline">Back to blog</Link>
      </div>
    );
  }

  const canonical = `https://greenhunt.net/blog/${post.slug}`;
  const title = post.meta_title || `${post.title} | Greenhunt Blog`;
  const description = post.meta_description || post.description;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description,
    image: post.cover_image_url ? [post.cover_image_url] : undefined,
    mainEntityOfPage: canonical,
    publisher: {
      "@type": "Organization",
      name: "Greenhunt",
    },
  };

  return (
    <div className="policy-page min-h-screen">
      <Helmet>
        <title>{title}</title>
        <meta name="description" content={description} />
        {post.meta_keywords && <meta name="keywords" content={post.meta_keywords} />}
        <link rel="canonical" href={canonical} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonical} />
        {post.cover_image_url && (
          <meta property="og:image" content={post.cover_image_url} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        {post.cover_image_url && (
          <meta name="twitter:image" content={post.cover_image_url} />
        )}
        <script type="application/ld+json">
          {JSON.stringify(articleJsonLd)}
        </script>
      </Helmet>

      <header className="border-b border-black/20">
        <div className="max-w-3xl mx-auto px-6 py-6">
          <Link to="/blog" className="text-sm underline">
            ← Blog
          </Link>
        </div>
      </header>

      <article className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-4xl md:text-5xl mb-4">{post.title}</h1>
        <p className="text-lg mb-8">{post.description}</p>
        {post.cover_image_url && (
          <img
            src={post.cover_image_url}
            alt={post.title}
            className="w-full rounded-xl mb-10 aspect-video object-cover"
          />
        )}
        {post.content && (
          <div
            className="prose max-w-none whitespace-pre-wrap leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        )}
      </article>
    </div>
  );
};

export default BlogPostPage;
