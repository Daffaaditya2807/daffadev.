import { useEffect } from 'react'

const siteName = 'daffadev'
const siteUrl = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '')
const defaultImage = `${siteUrl}/daffadev.png`
const defaultDescription = 'Portfolio, project, blog, dan eksperimen teknologi dari Daffa Dev.'

const setMeta = ({ key, value, attribute = 'name' }) => {
  if (!value) return

  let element = document.head.querySelector(`meta[${attribute}="${key}"]`)

  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, key)
    document.head.appendChild(element)
  }

  element.setAttribute('content', value)
}

const setCanonical = (url) => {
  let element = document.head.querySelector('link[rel="canonical"]')

  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', 'canonical')
    document.head.appendChild(element)
  }

  element.setAttribute('href', url)
}

function SEO({
  title,
  description = defaultDescription,
  path = window.location.pathname,
  image = defaultImage,
  type = 'website',
  noIndex = false,
}) {
  useEffect(() => {
    const pageTitle = title ? `${title} | ${siteName}` : siteName
    const pagePath = path.startsWith('/') ? path : `/${path}`
    const pageUrl = `${siteUrl}${pagePath}`

    document.title = pageTitle
    setCanonical(pageUrl)

    setMeta({ key: 'description', value: description })
    setMeta({ key: 'robots', value: noIndex ? 'noindex,nofollow' : 'index,follow' })
    setMeta({ key: 'og:site_name', value: siteName, attribute: 'property' })
    setMeta({ key: 'og:title', value: pageTitle, attribute: 'property' })
    setMeta({ key: 'og:description', value: description, attribute: 'property' })
    setMeta({ key: 'og:type', value: type, attribute: 'property' })
    setMeta({ key: 'og:url', value: pageUrl, attribute: 'property' })
    setMeta({ key: 'og:image', value: image, attribute: 'property' })
    setMeta({ key: 'twitter:card', value: 'summary_large_image' })
    setMeta({ key: 'twitter:title', value: pageTitle })
    setMeta({ key: 'twitter:description', value: description })
    setMeta({ key: 'twitter:image', value: image })
  }, [description, image, noIndex, path, title, type])

  return null
}

export default SEO
