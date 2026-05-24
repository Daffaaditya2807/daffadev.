import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FileText, ImageIcon, Save, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { supabase } from '@/core/supabase'
import { useProfilePage } from '../hooks/useProfilePage'
import { profileFields, imageFields } from '../data/profilePageData'

const STORAGE_BUCKET = 'portfolio-assets'

const getImageUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
}

const getPublicFileUrl = (path) => {
  if (!path) return ''
  if (path.startsWith('http')) return path
  return supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path).data.publicUrl
}



const ProfilePage = () => {
const { showToast } = useOutletContext()
const {
  form,
  isLoading,
  isSaving,
  message,
  errorMessage,
  uploadingField,
  pendingImages,
  imagePreviews,
  isUploadingPending,
  handleChange,
  handleSubmit,
  handleLocalImageSelect,
  handlePortfolioUpload
} = useProfilePage()

  useEffect(() => {
    if (message) {
      showToast({ icon: 'success', title: message })
    }
  }, [message, showToast])

  useEffect(() => {
    if (errorMessage) {
      showToast({ icon: 'error', title: errorMessage })
    }
  }, [errorMessage, showToast])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-white">Profile</h1>
        <p className="mt-1 text-white/55">
          Kelola data utama yang akan tampil di halaman depan portfolio.
        </p>
      </div>

      <Card className="border-white/10 bg-white/[0.07] py-0 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">Informasi Profile</CardTitle>
        </CardHeader>
        <CardContent className="px-5 py-5">
          {isLoading ? (
            <div className="rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Memuat data profile...
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-5 md:grid-cols-2">
                {profileFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <label htmlFor={field.id} className="text-sm font-medium text-white/80">
                      {field.label}
                    </label>
                    <Input
                      id={field.id}
                      name={field.id}
                      type={field.type || 'text'}
                      value={form[field.id] || ''}
                      onChange={handleChange}
                      required={field.required}
                      placeholder={field.placeholder}
                      className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                    />
                  </div>
                ))}
              </div>

              {/* Portfolio PDF Section */}
              <div className="space-y-2">
                <label htmlFor="link_porto" className="text-sm font-medium text-white/80">
                  Portfolio PDF
                </label>
                <div className="rounded-xl border border-white/10 bg-black/20 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <Input
                      id="link_porto"
                      name="link_porto"
                      value={form.link_porto || ''}
                      onChange={handleChange}
                      placeholder="documents/portfolio.pdf"
                      className="h-10 flex-1 w-full border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                    />
                    <div className="w-full sm:w-auto">
                      <input
                        id="portfolio_pdf_upload"
                        type="file"
                        accept="application/pdf"
                        className="sr-only"
                        onChange={handlePortfolioUpload}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        disabled={Boolean(uploadingField)}
                        className="h-10 w-full sm:w-auto border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                        asChild
                      >
                        <label htmlFor="portfolio_pdf_upload" className="cursor-pointer flex items-center justify-center gap-2">
                          <Upload className="size-4" />
                          {uploadingField === 'link_porto' ? 'Mengupload...' : 'Upload PDF'}
                        </label>
                      </Button>
                    </div>
                  </div>
                  {form.link_porto && (
                    <a
                      href={getPublicFileUrl(form.link_porto)}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 text-xs font-medium text-white/55 transition hover:text-white"
                    >
                      <FileText className="size-4" />
                      Lihat portfolio PDF
                    </a>
                  )}
                </div>
              </div>

              {/* Description Section */}
              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-white/80">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={form.description || ''}
                  onChange={handleChange}
                  rows={5}
                  placeholder="Tulis deskripsi profile kamu..."
                  className="min-h-32 w-full resize-y rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white outline-none transition placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-3 focus-visible:ring-white/10"
                />
              </div>

              {/* Images Section (Dipindah ke atas tombol simpan) */}
              <div className="space-y-4">
                <div>
                  <h2 className="text-base font-semibold text-white">Gambar Profile</h2>
                  <p className="mt-1 text-sm text-white/45">
                    Pilih gambar. Gambar akan diunggah ke server secara bersamaan saat Anda menyimpan profile.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  {imageFields.map((field) => {
                    // Gunakan preview lokal jika ada, jika tidak gunakan URL server
                    const currentImageUrl = imagePreviews[field.id] || getImageUrl(form[field.id])
                    const isPending = !!pendingImages[field.id]

                    return (
                      <div key={field.id} className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                        <div className="flex aspect-4/3 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 relative">
                          {currentImageUrl ? (
                            <img
                              src={currentImageUrl}
                              alt={field.label}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <ImageIcon className="size-8 text-white/25" />
                          )}
                          {isPending && (
                            <span className="absolute top-2 right-2 bg-blue-500 text-xs px-2 py-1 rounded text-white shadow">
                              Belum disimpan
                            </span>
                          )}
                        </div>

                        <div className="space-y-2">
                          <label htmlFor={field.id} className="text-sm font-medium text-white/80">
                            {field.label}
                          </label>
                          <Input
                            id={field.id}
                            name={field.id}
                            value={form[field.id] || ''}
                            readOnly
                            placeholder={field.placeholder}
                            className="h-10 border-white/10 bg-white/6 text-white/50 cursor-not-allowed"
                          />
                        </div>

                        <div>
                          <input
                            id={`${field.id}_upload`}
                            type="file"
                            accept="image/png,image/jpeg,image/webp,image/svg+xml"
                            className="sr-only"
                            onChange={(event) => handleLocalImageSelect(event, field)}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            className={`h-10 w-full border-white/10 text-white hover:text-white ${isPending ? 'bg-blue-600/30 hover:bg-blue-600/50' : 'bg-white/6 hover:bg-white/10'}`}
                            asChild
                          >
                            <label htmlFor={`${field.id}_upload`} className="cursor-pointer">
                              <Upload className="size-4 mr-2" />
                              {isPending ? 'Ganti Pilihan' : 'Pilih Gambar'}
                            </label>
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Tembat Tombol Simpan (Dipindah ke Paling Bawah) */}
              <div className="flex justify-end pt-6 border-t border-white/10 mt-8">
                <Button
                  type="submit"
                  disabled={isSaving || isUploadingPending}
                  className="h-10 bg-white px-6 text-black hover:bg-white/90 font-medium"
                >
                  <Save className="size-4 mr-2" />
                  {isUploadingPending ? 'Mengunggah Gambar...' : isSaving ? 'Menyimpan Profile...' : 'Simpan Profile'}
                </Button>
              </div>
              
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default ProfilePage

