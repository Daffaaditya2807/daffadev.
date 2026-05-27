import { useEffect, useState, useMemo } from 'react'
import { Search, ChevronLeft, ChevronRight } from 'lucide-react'
import { supabase } from '@/core/supabase'
import { getCached, setCache } from '@/core/cache'
import SEO from '@/components/common/SEO'
import MainLayout from '@/components/layout/MainLayout'
import CardBlog from '../components/CardBlog'

const navItems = [
  { id: "home", label: "Home", href: "/" },
  { id: "about", label: "About", href: "/" },
  { id: "lab", label: "Lab", href: "/" },
  { id: "contact", label: "Contact", href: "/" },
  { id: "blog", label: "Blog" },
]

const PAGE_SIZE = 10

function BlogUserPage() {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    const fetchBlogs = async () => {
      const cached = getCached('blogs-public')
      if (cached) { setBlogs(cached); setIsLoading(false); return }

      const { data } = await supabase
        .from('blogs')
        .select('id, title, slug, thumbnail, date, category, description')
        .eq('is_active', true)
        .order('date', { ascending: false })

      setBlogs(data || [])
      setCache('blogs-public', data || [])
      setIsLoading(false)
    }

    fetchBlogs()
  }, [])

  const filteredBlogs = useMemo(() => {
    if (!search.trim()) return blogs
    const q = search.toLowerCase()
    return blogs.filter(
      (b) => b.title.toLowerCase().includes(q) || b.category.toLowerCase().includes(q)
    )
  }, [blogs, search])

  const totalPages = Math.max(1, Math.ceil(filteredBlogs.length / PAGE_SIZE))
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredBlogs.slice(start, start + PAGE_SIZE)
  }, [currentPage, filteredBlogs])

  const handleSearch = (e) => {
    setSearch(e.target.value)
    setCurrentPage(1)
  }

  return (
    <MainLayout
      navItems={navItems}
      activeSection="blog"
      scrollToSection={() => {}}
      isLoaded={true}
      isNavbarOnHero={false}
      showBottomNav={true}
    >
      <SEO
        title="Blog"
        description="Artikel seputar teknologi, project, tutorial, dan pengembangan diri dari Daffa Dev."
        path="/blog"
      />

      <section className="mx-auto max-w-5xl px-4 py-4 sm:py-24 sm:px-6">
        <div className="mb-8 flex flex-col gap-2 sm:gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Blog.</h1>
          <p className="text-lg">
          Tempat untuk berbagi pemikiran, pengalaman, dan pembelajaran seputar dunia teknologi, pengembangan diri.
        </p>
          <p className="text-sm text-gray-500">
            Menampilkan {filteredBlogs.length} artikel
          </p>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-white/40" />
            <input
              type="text"
              value={search}
              onChange={handleSearch}
              placeholder="Cari artikel..."
              className="h-10 w-full rounded-full border border-white/15 bg-white/5 pl-10 pr-4 text-sm text-white placeholder:text-white/40 outline-none backdrop-blur-sm transition focus:border-white/30 focus:bg-white/10"
            />
          </div>
        </div>

        {isLoading ? (
          <p className="text-white/50">Memuat artikel...</p>
        ) : filteredBlogs.length === 0 ? (
          <p className="text-white/50">
            {search ? 'Tidak ada artikel yang cocok.' : 'Belum ada artikel.'}
          </p>
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {paginatedBlogs.map((blog) => (
                <CardBlog key={blog.id} blog={blog} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </button>
                <span className="text-sm text-white/60">
                  {currentPage} / {totalPages}
                </span>
                <button
                  type="button"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-white/70 transition hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none"
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </>
        )}
      </section>
    </MainLayout>
  )
}

export default BlogUserPage
