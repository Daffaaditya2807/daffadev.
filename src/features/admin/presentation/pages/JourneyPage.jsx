import { useEffect } from 'react'
import { useOutletContext } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Briefcase, Building2, Calendar, Pencil, Trash2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useJourneyPage } from '../hooks/useJourneyPage'

const JourneyPage = () => {
  const { showToast } = useOutletContext()
  const {
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
  } = useJourneyPage()

  // Notifikasi
  useEffect(() => {
    if (message) showToast({ icon: 'success', title: message })
  }, [message, showToast])

  useEffect(() => {
    if (errorMessage) showToast({ icon: 'error', title: errorMessage })
  }, [errorMessage, showToast])

  // Format tanggal untuk tampilan list
  const formatDate = (dateString) => {
    if (!dateString) return 'Sekarang'
    return new Date(dateString).toLocaleDateString('id-ID', {
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      {/* HEADER PAGE */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Journey</h1>
          <p className="mt-1 text-white/55">Kelola perjalanan karir dan pengalaman kerja Anda.</p>
        </div>

        <Button type="button" onClick={openCreateModal} className="h-10 bg-white px-4 text-black hover:bg-white/90">
          <Plus className="size-4 mr-2" />
          Tambah Journey
        </Button>
      </div>

      {/* MAIN CARD LIST */}
      <Card className="border-white/10 bg-white/[0.07] py-0 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">Daftar Journey</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {isLoading ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Memuat data journey...
            </div>
          ) : journeys.length === 0 ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Belum ada data journey.
            </div>
          ) : (
            <div className="divide-y divide-white/10">
              {journeys.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:bg-white/4 transition-colors">
                  
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-semibold text-white text-lg">{item.position}</h3>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        item.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-white/45'
                      }`}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 text-sm text-white/70">
                      <div className="flex items-center gap-1.5">
                        <Building2 className="size-4 opacity-70" />
                        <span>{item.company}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-white/50">
                        <Calendar className="size-4 opacity-70" />
                        <span>{formatDate(item.date_start)} — {formatDate(item.date_end)}</span>
                      </div>
                    </div>

                    {item.description && (
                      <p className="text-sm text-white/60 mt-1 line-clamp-2 max-w-3xl">
                        {item.description}
                      </p>
                    )}
                  </div>

                  <div className="flex shrink-0 items-center gap-2 pt-1">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => openEditModal(item)}
                      className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                    >
                      <Pencil className="size-4 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteClick(item)}
                    >
                      <Trash2 className="size-4 mr-1.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* DIALOG FORM CREATE/EDIT */}
      <Dialog.Root open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 text-white shadow-2xl shadow-black/60 outline-none">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Dialog.Title className="text-base font-semibold text-white">
                {editingId ? 'Edit Journey' : 'Tambah Journey'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" size="icon" className="text-white/60 hover:bg-white/10 hover:text-white">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Perusahaan / Institusi</label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-2.5 size-4 text-white/40" />
                    <Input
                      name="company"
                      value={form.company}
                      onChange={handleChange}
                      required
                      placeholder="Misal: PT Teknologi Maju"
                      className="h-10 pl-10 border-white/10 bg-white/6 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Posisi / Role</label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-2.5 size-4 text-white/40" />
                    <Input
                      name="position"
                      value={form.position}
                      onChange={handleChange}
                      required
                      placeholder="Misal: Frontend Developer"
                      className="h-10 pl-10 border-white/10 bg-white/6 text-white placeholder:text-white/30"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Tanggal Mulai</label>
                  <Input
                    type="date"
                    name="date_start"
                    value={form.date_start}
                    onChange={handleChange}
                    className="h-10 border-white/10 bg-white/6 text-white dark:scheme-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Tanggal Selesai</label>
                  <Input
                    type="date"
                    name="date_end"
                    value={form.date_end}
                    onChange={handleChange}
                    className="h-10 border-white/10 bg-white/6 text-white dark:scheme-dark"
                  />
                </div>
              </div>
              <p className="text-xs text-white/45 -mt-2">Biarkan Tanggal Selesai kosong jika posisi masih berlangsung saat ini.</p>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Deskripsi (Opsional)</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ceritakan tanggung jawab atau pencapaian..."
                  className="w-full resize-y rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-1 focus-visible:ring-white/10"
                />
              </div>

              <label className="flex w-max items-center gap-3 rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/75 cursor-pointer hover:bg-white/10 transition">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="size-4 accent-white"
                />
                Tampilkan di halaman depan
              </label>

              <div className="flex justify-end gap-2 border-t border-white/10 pt-4 mt-2">
                <Dialog.Close asChild>
                  <Button type="button" variant="outline" className="h-10 border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white">
                    Batal
                  </Button>
                </Dialog.Close>
                <Button type="submit" disabled={isSaving} className="h-10 bg-white px-6 text-black hover:bg-white/90">
                  {isSaving ? 'Menyimpan...' : editingId ? 'Update Journey' : 'Simpan Journey'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* DIALOG KONFIRMASI HAPUS */}
      <Dialog.Root open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 p-6 text-white shadow-2xl shadow-black/60 outline-none">
            <div className="flex flex-col gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-white">Konfirmasi Hapus</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-white/60">
                  Apakah Anda yakin ingin menghapus posisi <strong className="text-white">{itemToDelete?.position}</strong> di <strong className="text-white">{itemToDelete?.company}</strong>? Tindakan ini tidak dapat dibatalkan.
                </Dialog.Description>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={() => setIsDeleteDialogOpen(false)} className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white">
                  Batal
                </Button>
                <Button type="button" variant="destructive" onClick={confirmDelete}>
                  Ya, Hapus
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

    </div>
  )
}

export default JourneyPage