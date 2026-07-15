import { useEffect, useState } from 'react'
import { supabase } from '@/core/supabase'
// Pastikan Anda mengimpor imageFields juga agar hook tau format nama file-nya
import { initialForm, imageFields } from '../data/profilePageData'

const STORAGE_BUCKET = 'portfolio-assets'

const getFileExtension = (file) => {
  const extension = file.name.split('.').pop()?.toLowerCase()

  if (extension) {
    return extension
  }

  return file.type.split('/').pop() || 'png'
}

export function useProfilePage() {
  const [form, setForm] = useState(initialForm)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [uploadingField, setUploadingField] = useState('')
  const [message, setMessage] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  // State baru untuk menampung gambar sementara sebelum "Simpan Profile" diklik
  const [pendingImages, setPendingImages] = useState({})
  const [imagePreviews, setImagePreviews] = useState({})
  const [isUploadingPending, setIsUploadingPending] = useState(false)

  useEffect(() => {
    const fetchProfile = async () => {
      setIsLoading(true)
      setErrorMessage('')

      const { data, error } = await supabase
        .from('profile')
        .select('*')
        .eq('id', 1)
        .maybeSingle()

      if (error) {
        setErrorMessage('Gagal mengambil data profile.')
        setIsLoading(false)
        return
      }

      if (data) {
        setForm({
          name: data.name || '',
          text_hero_1: data.text_hero_1 || '',
          text_hero_2: data.text_hero_2 || '',
          link_porto: data.link_porto || '',
          header_text: data.header_text || '',
          description: data.description || '',
          hero_image_bw: data.hero_image_bw || '',
          hero_image_rgb: data.hero_image_rgb || '',
          about_image: data.about_image || '',
        })
      }

      setIsLoading(false)
    }

    fetchProfile()
  }, [])

  const handleChange = (event) => {
    const { name, value } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }

  // Pengganti handleImageUpload (Hanya simpan di state lokal untuk preview)
  const handleLocalImageSelect = (event, field) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return false
    }

    if (!file.type.startsWith('image/')) {
      setErrorMessage('File harus berupa gambar.')
      return false
    }

    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Ukuran gambar maksimal 5 MB.')
      return false
    }

    setMessage('')
    setErrorMessage('')

    // Simpan file asli dan buat URL preview
    setPendingImages((prev) => ({ ...prev, [field.id]: file }))
    setImagePreviews((prev) => ({ ...prev, [field.id]: URL.createObjectURL(file) }))

    return true
  }

  // Modifikasi handleSubmit: Upload gambar tertunda dulu, lalu simpan ke database
  const handleSubmit = async (event) => {
    if (event) event.preventDefault()
    
    setIsSaving(true)
    setMessage('')
    setErrorMessage('')

    let currentFormState = { ...form }

    // 1. Upload semua gambar yang pending ke storage
    if (Object.keys(pendingImages).length > 0) {
      setIsUploadingPending(true)

      for (const [fieldId, file] of Object.entries(pendingImages)) {
        const fieldConfig = imageFields.find((f) => f.id === fieldId)
        if (!fieldConfig) continue

        // Hapus gambar lama jika ada untuk menghemat storage
        const oldPath = currentFormState[fieldId]
        if (oldPath && !oldPath.startsWith('http')) {
          await supabase.storage.from(STORAGE_BUCKET).remove([oldPath])
        }

        // Gunakan timestamp agar URL unik dan tidak kena cache browser
        const timestamp = new Date().getTime()
        const filePath = `profile/${fieldConfig.fileName}_${timestamp}.${getFileExtension(file)}`
        
        const { error } = await supabase.storage
          .from(STORAGE_BUCKET)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
          })

        if (error) {
          setErrorMessage(`Gagal upload gambar ${fieldConfig.label}. Pastikan policy storage benar.`)
          setIsUploadingPending(false)
          setIsSaving(false)
          return false // Batalkan simpan profile jika ada gambar yang gagal upload
        }

        // Update path baru ke form payload yang akan dikirim ke DB
        currentFormState[fieldId] = filePath
      }

      setIsUploadingPending(false)
      setPendingImages({}) // Bersihkan antrean karena sudah terupload
    }

    // 2. Simpan semua data form (termasuk path gambar baru) ke database
    const { error: dbError } = await supabase
      .from('profile')
      .upsert(
        {
          id: 1,
          ...currentFormState,
        },
        {
          onConflict: 'id',
        }
      )

    setIsSaving(false)

    if (dbError) {
      setErrorMessage('Gagal menyimpan profile.')
      return false
    }

    setForm(currentFormState) // Update state form utama dengan data terbaru
    setMessage('Profile berhasil disimpan.')
    return true
  }

  // Portfolio PDF
  const handlePortfolioUpload = async (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) {
      return false
    }

    if (file.type !== 'application/pdf') {
      setErrorMessage('File portfolio harus berupa PDF.')
      return false
    }

    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Ukuran PDF maksimal 10 MB.')
      return false
    }

    setMessage('')
    setErrorMessage('')
    setUploadingField('link_porto')

    // Hapus file portfolio lama jika ada untuk menghemat storage
    if (form.link_porto && !form.link_porto.startsWith('http')) {
      await supabase.storage.from(STORAGE_BUCKET).remove([form.link_porto])
    }

    // Gunakan timestamp agar URL unik dan tidak kena cache browser
    const timestamp = new Date().getTime()
    const filePath = `documents/portfolio_${timestamp}.pdf`
    
    const { error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      })

    setUploadingField('')

    if (error) {
      setErrorMessage('Gagal upload PDF. Pastikan bucket mengizinkan application/pdf.')
      return false
    }

    setForm((current) => ({
      ...current,
      link_porto: filePath,
    }))
    setMessage('File portfolio berhasil diupload. Jangan lupa klik Simpan Profile.')
    return true
  }

  return {
    form,
    isLoading,
    isSaving,
    message,
    errorMessage,
    uploadingField,
    
    // Kembalikan state dan fungsi baru untuk dikonsumsi komponen UI
    pendingImages,
    imagePreviews,
    isUploadingPending,
    
    handleChange,
    handleSubmit,
    handleLocalImageSelect, 
    handlePortfolioUpload
  }
}