import { Calendar } from 'lucide-react'
import { Link } from 'react-router-dom'

const htmlToPlainText = (value = '') => {
  if (!value) return ''

  if (typeof window === 'undefined') {
    return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
  }

  const parsed = new DOMParser().parseFromString(value, 'text/html')
  return parsed.body.textContent.replace(/\s+/g, ' ').trim()
}

function CardBlog({ blog }) {
  const description = htmlToPlainText(blog.description)

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <Link
      to={`/blog/${blog.slug}`}
      className="group block overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm transition-all duration-300 hover:border-white/25 hover:bg-white/10"
    >
      {blog.thumbnail && (
        <div className="aspect-video overflow-hidden">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-4 space-y-2">
        <span className="inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium capitalize text-white/70">
          {blog.category}
        </span>
        <h3 className="line-clamp-1 text-lg font-semibold text-white group-hover:text-white/90">
          {blog.title}
        </h3>
        {description && (
          <p className="line-clamp-2 text-sm leading-6 text-white/60">
            {description}
          </p>
        )}
        <div className="flex items-center gap-1.5 text-xs text-white/50">
          <Calendar className="size-3.5" />
          <span>{formatDate(blog.date)}</span>
        </div>
      </div>
    </Link>
  )
}

export default CardBlog
