import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/core/supabase'

const STORAGE_BUCKET = 'portfolio-assets'

const initialForm = {
  title: '',
  type_id: '',
  category_id: '',
  description: '',
  long_description: '',
  image_path: '',
  screenshots: [],
  tech_stack: [],
  features: [],
  github_url: '',
  website_url: '',
  status: 'published',
  sort_order: 0,
  is_active: true,
}

const getFileExtension = (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension) {
    return extension
  }

  return file.type.split('/').pop() || 'png'
}

const slugify = (value) => (
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || 'project'
)

const parseLines = (value) => (
  value
    .split('\n')
    .map((item) => item.trim())
    .filter(Boolean)
)

export const getPortfolioAssetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const storagePath = path.replace(/^\/+/, '')

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl
}

export function useAdminPortfolioPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchProjects = useCallback(async () => {
    setErrorMessage('')

    const { data, error } = await supabase
      .from('lab_projects')
      .select('*, type:lab_categories!lab_projects_type_id_fkey(id,label), category:lab_categories!lab_projects_category_id_fkey(id,label)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      setErrorMessage('Gagal mengambil data portfolio.')
      setIsLoading(false)
      return
    }

    setItems(data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      const [projectResult, categoryResult] = await Promise.all([
        supabase
          .from('lab_projects')
          .select('*, type:lab_categories!lab_projects_type_id_fkey(id,label), category:lab_categories!lab_projects_category_id_fkey(id,label)')
          .order('sort_order', { ascending: true })
          .order('created_at', { ascending: true }),
        supabase
          .from('lab_categories')
          .select('*')
          .order('sort_order', { ascending: true }),
      ])

      if (!isMounted) {
        return
      }

      if (projectResult.error) {
        setErrorMessage('Gagal mengambil data portfolio.')
      } else {
        setItems(projectResult.data || [])
      }

      if (categoryResult.error) {
        setErrorMessage('Gagal mengambil data kategori lab.')
      } else {
        const nextCategories = categoryResult.data || []
        setCategories(nextCategories)

        setForm((current) => ({
          ...current,
          type_id: current.type_id || nextCategories.find((item) => item.kind === 'type')?.id || '',
          category_id: current.category_id || nextCategories.find((item) => item.kind === 'category')?.id || '',
        }))
      }

      setIsLoading(false)
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : name === 'sort_order' ? Number(value) : value,
    }))
  }

  const handleArrayChange = (name, value) => {
    setForm((current) => ({
      ...current,
      [name]: parseLines(value),
    }))
  }

  const resetForm = () => {
    setForm({
      ...initialForm,
      type_id: categories.find((item) => item.kind === 'type')?.id || '',
      category_id: categories.find((item) => item.kind === 'category')?.id || '',
    })
    setEditingId('')
    setMessage('')
    setErrorMessage('')
  }

  const uploadFile = async (file, folder) => {
    const extension = getFileExtension(file)
    const filePath = `lab-projects/${folder}/${Date.now()}-${crypto.randomUUID()}.${extension}`
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
      })

    if (error) {
      throw error
    }

    return filePath
  }

  const handleMainImageUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return false
    if (!file.type.startsWith('image/')) {
      setErrorMessage('File utama harus berupa gambar.')
      return false
    }

    setUploadingField('image_path')
    setMessage('')
    setErrorMessage('')

    try {
      const folder = slugify(form.title || 'project')
      const filePath = await uploadFile(file, folder)
      setForm((current) => ({
        ...current,
        image_path: filePath,
      }))
      setMessage('Gambar utama berhasil diupload.')
      return true
    } catch {
      setErrorMessage('Gagal upload gambar utama. Pastikan policy storage benar.')
      return false
    } finally {
      setUploadingField('')
    }
  }

  const handleScreenshotsUpload = async (event) => {
    const files = Array.from(event.target.files || [])
    event.target.value = ''

    if (files.length === 0) return false

    const invalidFile = files.find((file) => !file.type.startsWith('image/'))
    if (invalidFile) {
      setErrorMessage('Semua screenshots harus berupa gambar.')
      return false
    }

    setUploadingField('screenshots')
    setMessage('')
    setErrorMessage('')

    try {
      const folder = slugify(form.title || 'project')
      const uploadedPaths = []

      for (const file of files) {
        uploadedPaths.push(await uploadFile(file, folder))
      }

      setForm((current) => ({
        ...current,
        screenshots: [...current.screenshots, ...uploadedPaths],
      }))
      setMessage(`${uploadedPaths.length} screenshot berhasil diupload.`)
      return true
    } catch {
      setErrorMessage('Gagal upload screenshots. Pastikan policy storage benar.')
      return false
    } finally {
      setUploadingField('')
    }
  }

  const removeScreenshot = (path) => {
    setForm((current) => ({
      ...current,
      screenshots: current.screenshots.filter((item) => item !== path),
    }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setErrorMessage('')

    const payload = {
      title: form.title.trim(),
      type_id: form.type_id,
      category_id: form.category_id,
      description: form.description.trim(),
      long_description: form.long_description.trim() || null,
      image_path: form.image_path.trim().replace(/^\/+/, ''),
      screenshots: form.screenshots.map((item) => item.replace(/^\/+/, '')),
      tech_stack: form.tech_stack,
      features: form.features,
      github_url: form.github_url.trim() || null,
      website_url: form.website_url.trim() || null,
      status: form.status,
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
    }

    const query = editingId
      ? supabase.from('lab_projects').update(payload).eq('id', editingId)
      : supabase.from('lab_projects').insert(payload)

    const { error } = await query
    setIsSaving(false)

    if (error) {
      setErrorMessage(error.message || 'Gagal menyimpan portfolio.')
      return false
    }

    setMessage(editingId ? 'Portfolio berhasil diperbarui.' : 'Portfolio berhasil ditambahkan.')
    resetForm()
    fetchProjects()
    return true
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      title: item.title || '',
      type_id: item.type_id || '',
      category_id: item.category_id || '',
      description: item.description || '',
      long_description: item.long_description || '',
      image_path: item.image_path || '',
      screenshots: item.screenshots || [],
      tech_stack: item.tech_stack || [],
      features: item.features || [],
      github_url: item.github_url || '',
      website_url: item.website_url || '',
      status: item.status || 'published',
      sort_order: item.sort_order || 0,
      is_active: Boolean(item.is_active),
    })
    setMessage('')
    setErrorMessage('')
  }

  const handleDelete = async (id) => {
    setMessage('')
    setErrorMessage('')

    const { error } = await supabase.from('lab_projects').delete().eq('id', id)

    if (error) {
      setErrorMessage('Gagal menghapus portfolio.')
      return false
    }

    setMessage('Portfolio berhasil dihapus.')
    fetchProjects()
    return true
  }

  const handleToggleActive = async (item) => {
    const { error } = await supabase
      .from('lab_projects')
      .update({ is_active: !item.is_active })
      .eq('id', item.id)

    if (error) {
      setErrorMessage('Gagal mengubah status portfolio.')
      return false
    }

    fetchProjects()
    setMessage(item.is_active ? 'Portfolio disembunyikan.' : 'Portfolio ditampilkan.')
    return true
  }

  return {
    items,
    categories,
    form,
    editingId,
    isLoading,
    isSaving,
    uploadingField,
    message,
    errorMessage,
    handleChange,
    handleArrayChange,
    handleMainImageUpload,
    handleScreenshotsUpload,
    removeScreenshot,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleActive,
    resetForm,
  }
}
