import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Calendar } from 'lucide-react'
import { supabase } from '@/core/supabase'

function BlogDetailPage() {
  const { slug } = useParams()
  const [blog, setBlog] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .eq('slug', slug)
        .single()

      setBlog(data)
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#030303] text-white/50">
        Memuat artikel...
      </div>
    )
  }

  if (!blog) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#030303] text-white">
        <p className="text-white/50">Artikel tidak ditemukan.</p>
        <Link to="/blog" className="mt-4 text-sm text-white/70 underline hover:text-white">
          Kembali ke Blog
        </Link>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen w-full bg-[#030303] text-white">
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <Link
          to="/blog"
          className="mb-8 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft className="size-4" />
          Kembali
        </Link>

        {blog.thumbnail && (
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="mb-8 w-full rounded-xl border border-white/10 object-cover"
          />
        )}

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

        <div
          className="prose prose-invert max-w-none prose-headings:text-white prose-p:text-white/80 prose-a:text-blue-400 prose-strong:text-white prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: blog.description }}
        />
      </article>
    </div>
  )
}

export default BlogDetailPage
