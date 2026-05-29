import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, ImageIcon, LoaderCircle, Pencil, Plus, RotateCcw, Trash2, Upload, X } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'
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
import { getPortfolioAssetUrl, useAdminPortfolioPage } from '../hooks/usePortfolioPage'

const PAGE_SIZE = 10

const PortfolioPage = () => {
  const { showToast, confirmDelete } = useOutletContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const {
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
  } = useAdminPortfolioPage(showToast)

  const typeOptions = categories.filter((item) => item.kind === 'type' && item.is_active)
  const categoryOptions = categories.filter((item) => item.kind === 'category' && item.is_active)
  const totalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const paginatedItems = useMemo(() => {
    const startIndex = (currentPage - 1) * PAGE_SIZE

    return items.slice(startIndex, startIndex + PAGE_SIZE)
  }, [currentPage, items])
  const firstItemNumber = items.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1
  const lastItemNumber = Math.min(currentPage * PAGE_SIZE, items.length)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentPage((page) => Math.min(page, totalPages))
  }, [totalPages])

  const openCreateModal = () => {
    resetForm()
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    handleEdit(item)
    setIsModalOpen(true)
  }

  const handleModalOpenChange = (open) => {
    setIsModalOpen(open)

    if (!open) {
      resetForm()
    }
  }

  const handleFormSubmit = async (event) => {
    const isSuccess = await handleSubmit(event)

    if (isSuccess) {
      setIsModalOpen(false)
    }
  }

  const goToPreviousPage = () => {
    setCurrentPage((page) => Math.max(1, page - 1))
  }

  const goToNextPage = () => {
    setCurrentPage((page) => Math.min(totalPages, page + 1))
  }

  const handleDeleteClick = async (item) => {
    const isConfirmed = await confirmDelete({
      title: `Hapus ${item.title}?`,
      text: 'Portfolio ini akan dihapus permanen dari database.',
    })

    if (isConfirmed) {
      handleDelete(item.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Portfolio</h1>
          <p className="mt-1 text-white/55">
            Kelola project yang akan tampil di lab section portfolio.
          </p>
        </div>

        <Button type="button" onClick={openCreateModal} className="h-10 bg-white px-4 text-black hover:bg-white/90">
          <Plus className="size-4" />
          Tambah Portfolio
        </Button>
      </div>

      <Card className="border-white/10 bg-white/[0.07] py-0 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">Daftar Portfolio</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {isLoading ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Memuat portfolio...
            </div>
          ) : items.length === 0 ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Belum ada portfolio.
            </div>
          ) : (
            <>
              <Table className="min-w-220">
                <TableHeader className="bg-black/20 text-xs uppercase text-white/45">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="px-5 py-3 text-white/45">Project</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Type</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Category</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Status</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Active</TableHead>
                    <TableHead className="px-5 py-3 text-right text-white/45">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} className="border-white/10 hover:bg-white/4">
                      <TableCell className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="flex size-14 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/6">
                            {item.image_path ? (
                              <img
                                src={getPortfolioAssetUrl(item.image_path)}
                                alt={item.title}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="size-5 text-white/30" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-white">{item.title}</p>
                            <p className="mt-1 line-clamp-1 max-w-90 text-xs text-white/45">{item.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="px-5 py-4 text-white/60">{item.type?.label || item.type_id}</TableCell>
                      <TableCell className="px-5 py-4 text-white/60">
                        {item.category?.label || item.category_id}
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <span className="rounded-full bg-white/10 px-2.5 py-1 text-xs font-medium capitalize text-white/70">
                          {item.status}
                        </span>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <button
                          type="button"
                          onClick={() => handleToggleActive(item)}
                          className={`rounded-full px-2.5 py-1 text-xs font-medium transition ${
                            item.is_active
                              ? 'bg-emerald-500/15 text-emerald-100 hover:bg-emerald-500/25'
                              : 'bg-white/10 text-white/45 hover:bg-white/15'
                          }`}
                        >
                          {item.is_active ? 'Active' : 'Hidden'}
                        </button>
                      </TableCell>
                      <TableCell className="px-5 py-4">
                        <div className="flex justify-end gap-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => openEditModal(item)}
                            className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                          >
                            <Pencil className="size-4" />
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteClick(item)}
                          >
                            <Trash2 className="size-4" />
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>

              <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 text-sm text-white/55 sm:flex-row sm:items-center sm:justify-between">
                <p>
                  Menampilkan {firstItemNumber}-{lastItemNumber} dari {items.length} data
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToPreviousPage}
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
                    onClick={goToNextPage}
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

      <Dialog.Root open={isModalOpen} onOpenChange={handleModalOpenChange}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content
            onInteractOutside={(event) => event.preventDefault()}
            className="fixed left-1/2 top-1/2 z-50 max-h-[92vh] w-[calc(100%-2rem)] max-w-5xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl border border-white/10 bg-black/90 text-white shadow-2xl shadow-black/60 outline-none [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-black/95 px-5 py-4">
              <Dialog.Title className="text-base font-semibold text-white">
                {editingId ? 'Edit Portfolio' : 'Tambah Portfolio'}
              </Dialog.Title>
              <Dialog.Close asChild>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-white/60 hover:bg-white/10 hover:text-white"
                >
                  <X className="size-4" />
                </Button>
              </Dialog.Close>
            </div>

            <form className="space-y-6 px-5 py-5" onSubmit={handleFormSubmit}>
              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Title" htmlFor="title">
                  <Input
                    id="title"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    placeholder="Titu Laundry"
                    className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                  />
                </FormField>

                <FormField label="Type" htmlFor="type_id">
                  <select
                    id="type_id"
                    name="type_id"
                    value={form.type_id}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none transition focus-visible:border-white/35 focus-visible:ring-3 focus-visible:ring-white/10"
                  >
                    <option value="" className="bg-black text-white">Pilih type</option>
                    {typeOptions.map((option) => (
                      <option key={option.id} value={option.id} className="bg-black text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="Category" htmlFor="category_id">
                  <select
                    id="category_id"
                    name="category_id"
                    value={form.category_id}
                    onChange={handleChange}
                    required
                    className="h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none transition focus-visible:border-white/35 focus-visible:ring-3 focus-visible:ring-white/10"
                  >
                    <option value="" className="bg-black text-white">Pilih category</option>
                    {categoryOptions.map((option) => (
                      <option key={option.id} value={option.id} className="bg-black text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </FormField>

                <FormField label="GitHub URL" htmlFor="github_url">
                  <Input
                    id="github_url"
                    name="github_url"
                    value={form.github_url}
                    onChange={handleChange}
                    placeholder="https://github.com/..."
                    className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                  />
                </FormField>

                <FormField label="Website URL" htmlFor="website_url">
                  <Input
                    id="website_url"
                    name="website_url"
                    value={form.website_url}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                  />
                </FormField>

                <FormField label="Status" htmlFor="status">
                  <select
                    id="status"
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none transition focus-visible:border-white/35 focus-visible:ring-3 focus-visible:ring-white/10"
                  >
                    <option value="draft" className="bg-black text-white">Draft</option>
                    <option value="development" className="bg-black text-white">Development</option>
                    <option value="published" className="bg-black text-white">Published</option>
                    <option value="archived" className="bg-black text-white">Archived</option>
                  </select>
                </FormField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <FormField label="Description" htmlFor="description">
                  <textarea
                    id="description"
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Deskripsi singkat untuk card."
                    className="w-full resize-y rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-1 focus-visible:ring-white/10"
                  />
                </FormField>

                <FormField label="Long Description" htmlFor="long_description">
                  <textarea
                    id="long_description"
                    name="long_description"
                    value={form.long_description}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Deskripsi lengkap untuk modal detail."
                    className="w-full resize-y rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-1 focus-visible:ring-white/10"
                  />
                </FormField>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <ArrayField
                  id="tech_stack"
                  label="Tech Stack"
                  value={form.tech_stack}
                  placeholder="Flutter, Dart, REST API"
                  onChange={handleChange}
                  name="tech_stack"
                />
                <ArrayField
                  id="features"
                  label="Features"
                  value={form.features}
                  placeholder="Real-time tracking, Notifikasi, History booking"
                  onChange={handleChange}
                  name="features"
                />
              </div>

              <div className="grid gap-4 md:grid-cols-[1fr_1.4fr]">
                <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex h-56 items-center justify-center overflow-hidden rounded-lg border border-white/10 bg-white/5 sm:h-72">
                    {form.image_path ? (
                      <img
                        src={getPortfolioAssetUrl(form.image_path)}
                        alt={form.title || 'Portfolio preview'}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <ImageIcon className="size-8 text-white/25" />
                    )}
                  </div>
                  <input
                    id="main_image_upload"
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml"
                    className="sr-only"
                    onChange={handleMainImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    disabled={Boolean(uploadingField)}
                    className="h-10 w-full border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                    asChild
                  >
                    <label htmlFor="main_image_upload" className="cursor-pointer">
                      <Upload className="size-4" />
                      {uploadingField === 'image_path' ? 'Mengupload...' : 'Upload Main Image'}
                    </label>
                  </Button>
                  <p className="text-xs text-white/40">Maksimal 3 MB. Format PNG, JPG, WEBP, atau SVG.</p>
                  <FormField label="Main Image Path" htmlFor="image_path">
                    <Input
                      id="image_path"
                      name="image_path"
                      value={form.image_path}
                      onChange={handleChange}
                      required
                      disabled
                      placeholder="lab-projects/project/image.png"
                      className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 disabled:cursor-not-allowed disabled:opacity-60 focus-visible:border-white/35 focus-visible:ring-white/10"
                    />
                  </FormField>
                </div>

                <div className="space-y-3 rounded-xl border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-white/80">Screenshots</h3>
                      <p className="mt-1 text-xs text-white/40">{form.screenshots.length} gambar dipilih</p>
                    </div>
                    <input
                      id="screenshots_upload"
                      type="file"
                      accept="image/png,image/jpeg,image/webp,image/svg+xml"
                      multiple
                      className="sr-only"
                      onChange={handleScreenshotsUpload}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      disabled={Boolean(uploadingField)}
                      className="h-10 border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                      asChild
                    >
                      <label htmlFor="screenshots_upload" className="cursor-pointer">
                        <Upload className="size-4" />
                        {uploadingField === 'screenshots' ? 'Mengupload...' : 'Upload Banyak'}
                      </label>
                    </Button>
                  </div>

                  <textarea
                    id="screenshots"
                    value={form.screenshots.join('\n')}
                    onChange={(event) => handleArrayChange('screenshots', event.target.value, '\n')}
                    rows={4}
                    placeholder="Satu path gambar per baris"
                    className="w-full resize-y rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-1 focus-visible:ring-white/10"
                  />

                  {form.screenshots.length > 0 && (
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                      {form.screenshots.map((screenshot) => (
                        <div key={screenshot} className="group relative overflow-hidden rounded-lg border border-white/10 bg-white/5">
                          <img
                            src={getPortfolioAssetUrl(screenshot)}
                            alt="Screenshot preview"
                            className="aspect-video w-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => removeScreenshot(screenshot)}
                            className="absolute right-2 top-2 rounded-full bg-black/70 p-1 text-white opacity-0 transition group-hover:opacity-100"
                            aria-label="Hapus screenshot"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <label className="flex w-max items-center gap-3 rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/75">
                <input
                  name="is_active"
                  type="checkbox"
                  checked={form.is_active}
                  onChange={handleChange}
                  className="size-4 accent-white"
                />
                Tampilkan di halaman depan
              </label>

              <div className="flex flex-wrap justify-end gap-2 border-t border-white/10 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetForm}
                  className="h-10 border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white"
                >
                  <RotateCcw className="size-4" />
                  Reset
                </Button>
                <Button
                  type="submit"
                  disabled={isSaving || Boolean(uploadingField)}
                  className="h-10 bg-white px-4 text-black hover:bg-white/90"
                >
                  {isSaving ? (
                    <LoaderCircle className="size-4 animate-spin" />
                  ) : editingId ? (
                    <Pencil className="size-4" />
                  ) : (
                    <Plus className="size-4" />
                  )}
                  {isSaving ? 'Menyimpan...' : editingId ? 'Update Portfolio' : 'Tambah Portfolio'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

function FormField({ label, htmlFor, children }) {
  return (
    <div className="space-y-2">
      <label htmlFor={htmlFor} className="text-sm font-medium text-white/80">
        {label}
      </label>
      {children}
    </div>
  )
}

function ArrayField({ id, label, value, placeholder, onChange, name }) {
  return (
    <FormField label={label} htmlFor={id}>
      <Input
        id={id}
        name={name || id}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
      />
    </FormField>
  )
}

export default PortfolioPage
