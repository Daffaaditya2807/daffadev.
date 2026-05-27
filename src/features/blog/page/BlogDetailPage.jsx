import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar, Check, Copy, MessageCircle } from 'lucide-react'
import { supabase } from '@/core/supabase'
import { getCached, setCache } from '@/core/cache'
import SEO from '@/components/common/SEO'
import CardBlog from '../components/CardBlog'

const getPlainText = (html = '') => {
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  return parsed.body.textContent?.replace(/\s+/g, ' ').trim() || ''
}

function BlogDetailPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [latestBlogs, setLatestBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCopied, setIsCopied] = useState(false)

  useEffect(() => {
    const fetchBlog = async () => {
      const detailCacheKey = `blog-detail:${slug}`
      const latestCacheKey = `blog-latest:${slug}`
      const cachedBlog = getCached(detailCacheKey)
      const cachedLatestBlogs = getCached(latestCacheKey)

      if (cachedBlog && cachedLatestBlogs) {
        setBlog(cachedBlog)
        setLatestBlogs(cachedLatestBlogs)
        setIsLoading(false)
        return
      }

      setIsLoading(true)

      const [blogResult, latestResult] = await Promise.all([
        supabase
          .from('blogs')
          .select('*')
          .eq('slug', slug)
          .single(),
        supabase
          .from('blogs')
          .select('id, title, slug, thumbnail, date, category, description')
          .eq('is_active', true)
          .neq('slug', slug)
          .order('date', { ascending: false })
          .limit(3),
      ])

      setBlog(blogResult.data)
      setLatestBlogs(latestResult.data || [])
      setCache(detailCacheKey, blogResult.data)
      setCache(latestCacheKey, latestResult.data || [])
      setIsLoading(false)
    }

    fetchBlog()
  }, [slug])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setIsCopied(true)
      window.setTimeout(() => setIsCopied(false), 1800)
    } catch {
      setIsCopied(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-white/50">
        <SEO title="Memuat Artikel" path={`/blog/${slug}`} noIndex />
        Memuat artikel...
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-white">
        <SEO title="Artikel Tidak Ditemukan" path={`/blog/${slug}`} noIndex />
        <p className="text-white/50">Artikel tidak ditemukan.</p>
        <Link to="/blog" className="mt-4 text-sm text-white/70 underline hover:text-white">
          Kembali ke Blog
        </Link>
      </div>
    )
  }

  const articleUrl = window.location.href
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${blog.title}\n${articleUrl}`)}`

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white">
      <SEO
        title={blog.title}
        description={getPlainText(blog.description).slice(0, 155)}
        path={`/blog/${blog.slug}`}
        image={blog.thumbnail}
        type="article"
      />

      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Link>

        <div className="mb-4 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium capitalize text-white/70">
            {blog.category}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-white/50">
            <Calendar className="size-3.5" />
            <span>{formatDate(blog.date)}</span>
          </div>
        </div>

        <h1 className="mb-8 text-3xl font-bold tracking-tight sm:text-4xl">
          {blog.title}
        </h1>

        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="mb-8 w-full rounded-xl border border-white/10 object-cover"
          />
        )}

        <div
          className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-blue-400 prose-strong:text-white prose-img:rounded-xl"
          dangerouslySetInnerHTML={{
            __html: blog.description
              ? blog.description
                  .replace(/&nbsp;/g, ' ')
                  .replace(/<p[^>]*>\s*<\/p>/g, '<p><br></p>')
              : '',
          }}
        />

        <div className="mt-10 flex flex-wrap items-center gap-3 border-t border-white/10 pt-6">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
            aria-label="Bagikan artikel ke WhatsApp"
          >
            <MessageCircle className="size-4" />
            Share WA
          </a>

          <button
            type="button"
            onClick={handleCopyLink}
            className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 text-sm font-medium text-white/70 transition hover:border-white/25 hover:bg-white/10 hover:text-white"
          >
            {isCopied ? <Check className="size-4" /> : <Copy className="size-4" />}
            {isCopied ? 'Tersalin' : 'Salin Link'}
          </button>
        </div>
      </article>

      {latestBlogs.length > 0 && (
        <section className="mx-auto max-w-5xl px-4 pb-16 sm:px-6">
          <div className="mb-6 flex items-end justify-between gap-4 border-t border-white/10 pt-10">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-white">Berita Terbaru</h2>
              <p className="mt-1 text-sm text-white/50">Artikel lainnya yang bisa Anda baca.</p>
            </div>
            <Link to="/blog" className="text-sm font-medium text-white/60 transition hover:text-white">
              Lihat semua
            </Link>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latestBlogs.map((item) => (
              <CardBlog key={item.id} blog={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}

export default BlogDetailPage
