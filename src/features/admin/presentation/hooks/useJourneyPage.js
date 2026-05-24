import { useState, useEffect } from 'react'
import { supabase } from '@/core/supabase'

const initialForm = {
  company: '',
  position: '',
  date_start: '',
  date_end: '',
  description: '',
  is_active: true,
  sort_order: 0,
}

export function useJourneyPage() {
  const [journeys, setJourneys] = useState([])
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // State untuk Modal Form (Create / Edit)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState(null)

  // State untuk Modal Konfirmasi Hapus
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState(null)

  const fetchJourneys = async () => {
    const { data, error } = await supabase
      .from('journeys')
      .select('*')
      .order('date_start', { ascending: false })

    if (error) setErrorMessage('Gagal mengambil data journey.')
    else setJourneys(data || [])
  }

  useEffect(() => {
    let isMounted = true

    const loadInitialData = async () => {
      const { data, error } = await supabase
        .from('journeys')
        .select('*')
        .order('date_start', { ascending: false })

      if (isMounted) {
        if (error) setErrorMessage('Gagal mengambil data journey.')
        else setJourneys(data || [])
        setIsLoading(false)
      }
    }

    loadInitialData()

    return () => {
      isMounted = false
    }
  }, [])

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))
  }

  // Buka modal untuk Tambah Data
  const openCreateModal = () => {
    setForm(initialForm)
    setEditingId(null)
    setIsModalOpen(true)
  }

  // Buka modal untuk Edit Data
  const openEditModal = (item) => {
    setForm({
      company: item.company,
      position: item.position,
      date_start: item.date_start ? item.date_start.split('T')[0] : '', // Format ke YYYY-MM-DD
      date_end: item.date_end ? item.date_end.split('T')[0] : '',
      description: item.description || '',
      is_active: item.is_active,
      sort_order: item.sort_order || 0,
    })
    setEditingId(item.id)
    setIsModalOpen(true)
  }

  const handleModalOpenChange = (open) => {
    setIsModalOpen(open)
    if (!open) setForm(initialForm)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setMessage('')
    setErrorMessage('')

    const payload = {
      ...form,
      date_start: form.date_start || null,
      date_end: form.date_end || null,
    }

    let error;

    // Cek apakah sedang mode Edit (Update) atau Create (Insert)
    if (editingId) {
      const { error: updateError } = await supabase
        .from('journeys')
        .update(payload)
        .eq('id', editingId)
      error = updateError
    } else {
      const { error: insertError } = await supabase
        .from('journeys')
        .insert([payload])
      error = insertError
    }

    setIsSaving(false)

    if (error) {
      setErrorMessage(error.message || 'Gagal menyimpan data.')
      return false
    }

    setMessage(editingId ? 'Journey berhasil diperbarui.' : 'Journey berhasil ditambahkan.')
    setIsModalOpen(false) // Tutup modal
    setForm(initialForm) // Reset form
    fetchJourneys() // Refresh data
    return true
  }

  // Buka modal konfirmasi hapus
  const handleDeleteClick = (item) => {
    setItemToDelete(item)
    setIsDeleteDialogOpen(true)
  }

  // Eksekusi hapus setelah dikonfirmasi
  const confirmDelete = async () => {
    if (!itemToDelete) return

    const { error } = await supabase.from('journeys').delete().eq('id', itemToDelete.id)

    if (error) {
      setErrorMessage('Gagal menghapus journey.')
    } else {
      setMessage('Journey berhasil dihapus.')
      fetchJourneys()
    }
    
    setIsDeleteDialogOpen(false)
    setItemToDelete(null)
  }

  return {
    journeys,
    form,
    isLoading,
    isSaving,
    message,
    errorMessage,
    isModalOpen,
    editingId,
    isDeleteDialogOpen,
    itemToDelete,
    handleChange,
    handleSubmit,
    openCreateModal,
    openEditModal,
    handleModalOpenChange,
    handleDeleteClick,
    confirmDelete,
    setIsDeleteDialogOpen,
  }
}