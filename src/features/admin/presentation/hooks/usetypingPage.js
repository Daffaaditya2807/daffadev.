import { useCallback, useEffect, useState } from 'react'
import { supabase } from '@/core/supabase'

const initialTypingForm = {
  text: '',
  sort_order: 0,
  is_active: true,
}

export function useTypingPage() {
  const [items, setItems] = useState([])
  const [form, setForm] = useState(initialTypingForm)
  const [editingId, setEditingId] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const fetchTypingTexts = useCallback(async () => {
    setErrorMessage('')

    const { data, error } = await supabase
      .from('typing_texts')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (error) {
      setErrorMessage('Gagal mengambil data typing text.')
      setIsLoading(false)
      return
    }

    setItems(data || [])
    setIsLoading(false)
  }, [])

  useEffect(() => {
    let isMounted = true

    const loadTypingTexts = async () => {
      const { data, error } = await supabase
        .from('typing_texts')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true })

      if (!isMounted) {
        return
      }

      if (error) {
        setErrorMessage('Gagal mengambil data typing text.')
      } else {
        setItems(data || [])
      }

      setIsLoading(false)
    }

    loadTypingTexts()

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

  const resetForm = () => {
    setForm(initialTypingForm)
    setEditingId('')
    setMessage('')
    setErrorMessage('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setErrorMessage('')

    const payload = {
      text: form.text.trim(),
      sort_order: Number(form.sort_order) || 0,
      is_active: form.is_active,
      updated_at: new Date().toISOString(),
    }

    const query = editingId
      ? supabase.from('typing_texts').update(payload).eq('id', editingId)
      : supabase.from('typing_texts').insert(payload)

    const { error } = await query
    setIsSaving(false)

    if (error) {
      setErrorMessage('Gagal menyimpan typing text. Pastikan text belum dipakai.')
      return false
    }

    setMessage(editingId ? 'Typing text berhasil diperbarui.' : 'Typing text berhasil ditambahkan.')
    resetForm()
    fetchTypingTexts()
    return true
  }

  const handleEdit = (item) => {
    setEditingId(item.id)
    setForm({
      text: item.text || '',
      sort_order: item.sort_order || 0,
      is_active: Boolean(item.is_active),
    })
    setMessage('')
    setErrorMessage('')
  }

  const handleDelete = async (id) => {
    setMessage('')
    setErrorMessage('')

    const { error } = await supabase.from('typing_texts').delete().eq('id', id)

    if (error) {
      setErrorMessage('Gagal menghapus typing text.')
      return false
    }

    setMessage('Typing text berhasil dihapus.')
    fetchTypingTexts()
    return true
  }

  const handleToggleActive = async (item) => {
    const { error } = await supabase
      .from('typing_texts')
      .update({
        is_active: !item.is_active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', item.id)

    if (error) {
      setErrorMessage('Gagal mengubah status typing text.')
      return false
    }

    fetchTypingTexts()
    setMessage(item.is_active ? 'Typing text disembunyikan.' : 'Typing text ditampilkan.')
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
