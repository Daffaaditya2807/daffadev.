import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/core/supabase'
import { getCached, setCache, invalidateCache } from '@/core/cache'

const STORAGE_BUCKET = 'portfolio-assets'

const initialForm = {
  title: '',
  type_id: '',
  category_id: '',
  description: '',
  long_description: '',
  image_path: '',
  screenshots: [],
  tech_stack: '',
  features: '',
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

export const getPortfolioAssetUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path

  const storagePath = path.replace(/^\/+/, '')

  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath).data.publicUrl
}

export function useAdminPortfolioPage(showToast) {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [form, setForm] = useState(initialForm)
  const [editingId, setEditingId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState('')

  const fetchProjects = useCallback(async () => {
    const { data, error } = await supabase
      .from('lab_projects')
      .select('*, type:lab_categories!lab_projects_type_id_fkey(id,label), category:lab_categories!lab_projects_category_id_fkey(id,label)')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      showToast({ icon: 'error', title: 'Gagal mengambil data portfolio.' })
      setIsLoading(false)
      return
    }

    setItems(data || [])
    setCache('portfolio', data || [])
    setIsLoading(false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadData = async () => {
      const cachedProjects = getCached('portfolio')
      const cachedCategories = getCached('portfolio-categories')

      if (cachedProjects && cachedCategories) {
        if (isMounted) {
          setItems(cachedProjects)
          setCategories(cachedCategories)
          setIsLoading(false)
        }
        return
      }

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
        showToast({ icon: 'error', title: 'Gagal mengambil data portfolio.' })
      } else {
        setItems(projectResult.data || [])
        setCache('portfolio', projectResult.data || [])
      }

      if (categoryResult.error) {
        showToast({ icon: 'error', title: 'Gagal mengambil data kategori lab.' })
      } else {
        const nextCategories = categoryResult.data || []
        setCategories(nextCategories)
        setCache('portfolio-categories', nextCategories)

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
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : name === 'sort_order' ? Number(value) : value,
    }))
  }

  const handleArrayChange = (name, value, separator = ',') => {
    setForm((current) => ({
      ...current,
      [name]: value.split(separator).map((item) => item.trim()).filter(Boolean),
    }))
  }

  const resetForm = () => {
    setForm({
      ...initialForm,
      type_id: categories.find((item) => item.kind === 'type')?.id || '',
      category_id: categories.find((item) => item.kind === 'category')?.id || '',
    })
    setEditingId('')
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
      showToast({ icon: 'error', title: 'File utama harus berupa gambar.' })
      return false
    }

    setUploadingField('image_path')

    try {
      const folder = slugify(form.title || 'project')
      const filePath = await uploadFile(file, folder)
      setForm((current) => ({
        ...current,
        image_path: filePath,
      }))
      showToast({ icon: 'success', title: 'Gambar utama berhasil diupload.' })
      return true
    } catch {
      showToast({ icon: 'error', title: 'Gagal upload gambar utama. Pastikan policy storage benar.' })
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
      showToast({ icon: 'error', title: 'Semua screenshots harus berupa gambar.' })
      return false
    }

    setUploadingField('screenshots')

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
      showToast({ icon: 'success', title: `${uploadedPaths.length} screenshot berhasil diupload.` })
      return true
    } catch {
      showToast({ icon: 'error', title: 'Gagal upload screenshots. Pastikan policy storage benar.' })
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

    const payload = {
      title: form.title.trim(),
      type_id: form.type_id,
      category_id: form.category_id,
      description: form.description.trim(),
      long_description: form.long_description.trim() || null,
      image_path: form.image_path.trim().replace(/^\/+/, ''),
      screenshots: form.screenshots.map((item) => item.replace(/^\/+/, '')),
      tech_stack: form.tech_stack.split(',').map((s) => s.trim()).filter(Boolean),
      features: form.features.split(',').map((s) => s.trim()).filter(Boolean),
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
      showToast({ icon: 'error', title: error.message || 'Gagal menyimpan portfolio.' })
      return false
    }

    showToast({ icon: 'success', title: editingId ? 'Portfolio berhasil diperbarui.' : 'Portfolio berhasil ditambahkan.' })
    resetForm()
    invalidateCache('portfolio')
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
      tech_stack: (item.tech_stack || []).join(', '),
      features: (item.features || []).join(', '),
      github_url: item.github_url || '',
      website_url: item.website_url || '',
      status: item.status || 'published',
      sort_order: item.sort_order || 0,
      is_active: Boolean(item.is_active),
    })
  }

  const handleDelete = async (id) => {
    const { error } = await supabase.from('lab_projects').delete().eq('id', id)

    if (error) {
      showToast({ icon: 'error', title: 'Gagal menghapus portfolio.' })
      return false
    }

    showToast({ icon: 'success', title: 'Portfolio berhasil dihapus.' })
    invalidateCache('portfolio')
    fetchProjects()
    return true
  }

  const handleToggleActive = async (item) => {
    const { error } = await supabase
      .from('lab_projects')
      .update({ is_active: !item.is_active })
      .eq('id', item.id)

    if (error) {
      showToast({ icon: 'error', title: 'Gagal mengubah status portfolio.' })
      return false
    }

    invalidateCache('portfolio')
    fetchProjects()
    showToast({ icon: 'success', title: item.is_active ? 'Portfolio disembunyikan.' : 'Portfolio ditampilkan.' })
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
