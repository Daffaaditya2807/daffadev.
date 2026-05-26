import { useEffect, useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import * as Dialog from '@radix-ui/react-dialog'
import { Plus, Pencil, Trash2, X, Upload, ChevronLeft, ChevronRight } from 'lucide-react'
import ReactQuill from 'react-quill-new'
import 'react-quill-new/dist/quill.snow.css'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useBlogPage } from '../hooks/useBlogPage'

const CATEGORY_OPTIONS = ['general', 'teknologi', 'tutorial', 'opini', 'project']

const FONT_SIZE_OPTIONS = ['10px', '12px', '14px', '16px', '18px', '20px', '24px', '32px', '48px']

const quillModules = {
  toolbar: [
    [{ font: [] }],
    [{ size: FONT_SIZE_OPTIONS }],
    [{ header: [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],
    [{ color: [] }, { background: [] }],
    [{ align: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'code-block'],
    ['link', 'image'],
    ['clean'],
  ],
}

const BlogPage = () => {
  const { showToast } = useOutletContext()
  const {
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
  } = useBlogPage(showToast)

  const [currentPage, setCurrentPage] = useState(1)
  const PAGE_SIZE = 10
  const totalPages = Math.max(1, Math.ceil(blogs.length / PAGE_SIZE))
  const paginatedBlogs = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return blogs.slice(start, start + PAGE_SIZE)
  }, [currentPage, blogs])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((p) => Math.min(p, totalPages))
  }, [totalPages])

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Blog</h1>
          <p className="mt-1 text-white/55">Kelola artikel blog Anda.</p>
        </div>
        <Button type="button" onClick={openCreateModal} className="h-10 bg-white px-4 text-black hover:bg-white/90">
          <Plus className="size-4 mr-2" />
          Tambah Blog
        </Button>
      </div>

      <Card className="border-white/10 bg-white/[0.07] py-0 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">Daftar Blog</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {isLoading ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Memuat data blog...
            </div>
          ) : blogs.length === 0 ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Belum ada artikel blog.
            </div>
          ) : (
            <>
            <Table>
              <TableHeader className="bg-black/20 text-xs uppercase text-white/45">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="px-5 py-3 text-white/45">Judul</TableHead>
                  <TableHead className="px-5 py-3 text-white/45">Category</TableHead>
                  <TableHead className="px-5 py-3 text-white/45">Tanggal</TableHead>
                  <TableHead className="px-5 py-3 text-white/45">Status</TableHead>
                  <TableHead className="px-5 py-3 text-right text-white/45">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBlogs.map((item) => (
                  <TableRow key={item.id} className="border-white/10 hover:bg-white/4">
                    <TableCell className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {item.thumbnail && (
                          <img src={item.thumbnail} alt="" className="size-10 rounded object-cover border border-white/10" />
                        )}
                        <span className="font-medium text-white">{item.title}</span>
                      </div>
                    </TableCell>
                    <TableCell className="px-5 py-4 capitalize text-white/70">{item.category}</TableCell>
                    <TableCell className="px-5 py-4 text-white/70">{formatDate(item.date)}</TableCell>
                    <TableCell className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                        item.is_active ? 'bg-emerald-500/15 text-emerald-300' : 'bg-white/10 text-white/45'
                      }`}>
                        {item.is_active ? 'Active' : 'Hidden'}
                      </span>
                    </TableCell>
                    <TableCell className="px-5 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <Button type="button" variant="outline" size="sm" onClick={() => openEditModal(item)} className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white">
                          <Pencil className="size-4" />
                        </Button>
                        <Button type="button" variant="destructive" size="sm" onClick={() => handleDeleteClick(item)}>
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Menampilkan {(currentPage - 1) * PAGE_SIZE + 1}-{Math.min(currentPage * PAGE_SIZE, blogs.length)} dari {blogs.length} data
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                  >
                    <ChevronLeft className="size-4" />
                    Prev
                  </Button>
                  <span className="min-w-20 text-center text-white/60">
                    {currentPage} / {totalPages}
                  </span>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                  >
                    Next
                    <ChevronRight className="size-4" />
                  </Button>
                </div>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* DIALOG FORM CREATE/EDIT */}
      <Dialog.Root open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-3xl max-h-[90vh] overflow-y-auto -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 text-white shadow-2xl shadow-black/60 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Dialog.Title className="text-base font-semibold text-white">
                {editingId ? 'Edit Blog' : 'Tambah Blog'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button type="button" variant="ghost" size="icon" className="text-white/60 hover:bg-white/10 hover:text-white">
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>

            <form onSubmit={handleSubmit} className="px-5 py-5 space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Judul</label>
                <Input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  required
                  placeholder="Judul artikel blog"
                  className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Thumbnail</label>
                <div className="flex items-center gap-3">
                  <label className="flex h-10 cursor-pointer items-center gap-2 rounded-md border border-white/10 bg-white/6 px-4 text-sm text-white/70 hover:bg-white/10 transition">
                    <Upload className="size-4" />
                    Pilih Gambar
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                  </label>
                  {form.thumbnail && (
                    <img src={form.thumbnail} alt="preview" className="h-10 w-16 rounded object-cover border border-white/10" />
                  )}
                </div>
                {uploadingThumbnail && <p className="text-xs text-white/50">Mengupload...</p>}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Tanggal</label>
                  <Input
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    required
                    className="h-10 border-white/10 bg-white/6 text-white dark:scheme-dark"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="h-10 w-full rounded-md border border-white/10 bg-white/6 px-3 text-sm text-white outline-none focus-visible:border-white/35 focus-visible:ring-1 focus-visible:ring-white/10"
                  >
                    {CATEGORY_OPTIONS.map((cat) => (
                      <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-white/80">Deskripsi</label>
                <div className="blog-quill-editor">
                  <ReactQuill
                    theme="snow"
                    value={form.description}
                    onChange={handleDescriptionChange}
                    modules={quillModules}
                    placeholder="Tulis konten blog di sini..."
                  />
                </div>
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
                  {isSaving ? 'Menyimpan...' : editingId ? 'Update Blog' : 'Simpan Blog'}
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
          <Dialog.Content aria-describedby={undefined} className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 p-6 text-white shadow-2xl shadow-black/60 outline-none">
            <div className="flex flex-col gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-white">Konfirmasi Hapus</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-white/60">
                  Apakah Anda yakin ingin menghapus artikel <strong className="text-white">{itemToDelete?.title}</strong>? Tindakan ini tidak dapat dibatalkan.
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

export default BlogPage
