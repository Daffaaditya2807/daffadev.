import { useState, useEffect } from 'react'
import { supabase } from '@/core/supabase'
import { getCached, setCache, invalidateCache, invalidateCacheByPrefix } from '@/core/cache'

const STORAGE_BUCKET = 'blog-assets'
const MAX_THUMBNAIL_SIZE = 3 * 1024 * 1024
const MAX_THUMBNAIL_SIZE_LABEL = '3 MB'

const slugify = (text) =>
  text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'untitled'

const initialForm = {
  title: '',
  thumbnail: '',
  date: new Date().toISOString().split('T')[0],
  category: 'general',
  description: '',
  is_active: true,
}

const invalidateBlogCaches = () => {
  invalidateCache('blogs')
  invalidateCache('blogs-public')
  invalidateCacheByPrefix('blog-detail:')
  invalidateCacheByPrefix('blog-latest:')
}

export function useBlogPage(showToast) {
  const [blogs, setBlogs] = useState([])
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingThumbnail, setUploadingThumbnail] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const fetchBlogs = async () => {
    const { data, error } = await supabase
      .from('blogs')
      .select('*')
      .order('date', { ascending: false })

    if (error) showToast({ icon: 'error', title: 'Gagal mengambil data blog.' })
    else {
      setBlogs(data || [])
      setCache('blogs', data || [])
    }
  }

  useEffect(() => {
    let isMounted = true

    const load = async () => {
      const cached = getCached('blogs')
      if (cached) {
        if (isMounted) { setBlogs(cached); setIsLoading(false) }
        return
      }

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('date', { ascending: false })

      if (isMounted) {
        if (error) showToast({ icon: 'error', title: 'Gagal mengambil data blog.' })
        else {
          setBlogs(data || [])
          setCache('blogs', data || [])
        }
        setIsLoading(false)
      }
    }

    load()
    return () => { isMounted = false }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleDescriptionChange = (value) => {
    setForm((prev) => ({ ...prev, description: value }))
  }

  const handleThumbnailUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (!file.type.startsWith('image/')) {
      showToast({ icon: 'error', title: 'Thumbnail harus berupa gambar.' })
      return
    }

    if (file.size > MAX_THUMBNAIL_SIZE) {
      showToast({ icon: 'error', title: `Ukuran thumbnail maksimal ${MAX_THUMBNAIL_SIZE_LABEL}.` })
      return
    }

    setUploadingThumbnail(true)
    const ext = file.name.split('.').pop()?.toLowerCase() || 'png'
    const filePath = `thumbnails/${Date.now()}.${ext}`

    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, { upsert: true })

    if (error) {
      showToast({ icon: 'error', title: 'Gagal mengupload thumbnail.' })
      setUploadingThumbnail(false)
      return
    }

    const { data: urlData } = supabase.storage
      .from(STORAGE_BUCKET)
      .getPublicUrl(filePath)

    setForm((prev) => ({ ...prev, thumbnail: urlData.publicUrl }))
    setUploadingThumbnail(false)
  }

  const openCreateModal = () => {
    setForm(initialForm)
    setEditingId(null)
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setForm({
      title: item.title,
      thumbnail: item.thumbnail || '',
      date: item.date || '',
      category: item.category || 'general',
      description: item.description || '',
      is_active: item.is_active,
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleModalOpenChange = (open) => {
    setIsModalOpen(open)
    if (!open) setForm(initialForm)
  }

  const handleSubmit = async (event, descriptionOverride) => {
    event.preventDefault()
    setIsSaving(true)

    const payload = {
      ...form,
      description: descriptionOverride ?? form.description,
      slug: slugify(form.title),
    }
    let error

    if (editingId) {
      const { error: e } = await supabase.from('blogs').update(payload).eq('id', editingId)
      error = e
    } else {
      const { error: e } = await supabase.from('blogs').insert([payload])
      error = e
    }

    setIsSaving(false)

    if (error) {
      showToast({ icon: 'error', title: error.message || 'Gagal menyimpan blog.' })
      return false
    }

    showToast({ icon: 'success', title: editingId ? 'Blog berhasil diperbarui.' : 'Blog berhasil ditambahkan.' })
    setIsModalOpen(false)
    setForm(initialForm)
    invalidateBlogCaches()
    fetchBlogs()
    return true
  }

  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  const confirmDelete = async () => {
    if (!itemToDelete) return

    const { error } = await supabase.from('blogs').delete().eq('id', itemToDelete.id)

    if (error) {
      showToast({ icon: 'error', title: 'Gagal menghapus blog.' })
    } else {
      showToast({ icon: 'success', title: 'Blog berhasil dihapus.' })
      invalidateBlogCaches()
      fetchBlogs()
    }

    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  return {
    blogs,
    form,
    isLoading,
    isSaving,
    isModalOpen,
    editingId,
    isDeleteDialogOpen,
    itemToDelete,
    uploadingThumbnail,
    handleChange,
    handleDescriptionChange,
    handleThumbnailUpload,
    handleSubmit,
    openCreateModal,
    openEditModal,
    handleModalOpenChange,
    handleDeleteClick,
    confirmDelete,
    setIsDeleteDialogOpen,
  }
}
