import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/core/supabase'
import { colorMap, initialTechStackForm } from '../data/techStackPageData'

export function useTechStackPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialTechStackForm)
  const [editingId, setEditingId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchTechStacks = useCallback(async ({ showLoading = true } = {}) => {
    if (showLoading) {
      setIsLoading(true)
    }

    setErrorMessage('')

    const { data, error } = await supabase
      .from('tech_stacks')
      .select('*')
      .order('created_at', { ascending: true })

    if (error) {
      setErrorMessage('Gagal mengambil data tech stack.')
      setIsLoading(false)
      return
    }

    setItems(data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    const loadTechStacks = async () => {
      const { data, error } = await supabase
        .from('tech_stacks')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) {
        setErrorMessage('Gagal mengambil data tech stack.')
        setIsLoading(false)
        return
      }

      setItems(data || [])
      setIsLoading(false)
    }

    loadTechStacks()
  }, [])

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target

    setForm((current) => {
      const nextValue = type === 'checkbox' ? checked : value
      const nextForm = {
        ...current,
        [name]: nextValue,
      }

      if (name === 'icon_key' && !editingId) {
        nextForm.name = value.charAt(0).toUpperCase() + value.slice(1)
        nextForm.color = colorMap[value] || nextForm.color
      }

      return nextForm
    })
  }

  const resetForm = () => {
    setForm(initialTechStackForm)
    setEditingId('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setErrorMessage('')

    const payload = {
      name: form.name,
      icon_key: form.icon_key,
      color: form.color,
      is_active: form.is_active,
    }

    const query = editingId
      ? supabase.from('tech_stacks').update(payload).eq('id', editingId)
      : supabase.from('tech_stacks').insert(payload)

    const { error } = await query
    setIsSaving(false)

    if (error) {
      setErrorMessage('Gagal menyimpan tech stack. Pastikan icon key belum dipakai.')
      return false
    }

    setMessage(editingId ? 'Tech stack berhasil diperbarui.' : 'Tech stack berhasil ditambahkan.')
    resetForm()
    fetchTechStacks()
    return true
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      name: item.name || '',
      icon_key: item.icon_key || 'flutter',
      color: item.color || colorMap[item.icon_key] || '#ffffff',
      is_active: Boolean(item.is_active),
    })
    setMessage('')
    setErrorMessage('')
  }

  const handleDelete = async (id) => {
    setMessage('')
    setErrorMessage('')

    const { error } = await supabase.from('tech_stacks').delete().eq('id', id)

    if (error) {
      setErrorMessage('Gagal menghapus tech stack.')
      return false
    }

    setMessage('Tech stack berhasil dihapus.')
    fetchTechStacks()
    return true
  }

  const handleToggleActive = async (item) => {
    const { error } = await supabase
      .from('tech_stacks')
      .update({ is_active: !item.is_active })
      .eq('id', item.id)

    if (error) {
      setErrorMessage('Gagal mengubah status tech stack.')
      return false
    }

    fetchTechStacks()
    setMessage(item.is_active ? 'Tech stack disembunyikan.' : 'Tech stack ditampilkan.')
    return true
  }

  return {
    items,
    form,
    editingId,
    isLoading,
    isSaving,
    message,
    errorMessage,
    handleChange,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleToggleActive,
    resetForm,
  }
}
