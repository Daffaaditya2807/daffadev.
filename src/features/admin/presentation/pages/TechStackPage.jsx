import { useEffect, useMemo, useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { ChevronLeft, ChevronRight, Pencil, Plus, RotateCcw, Trash2, X } from 'lucide-react'
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
import { iconMap, iconOptions } from '../data/techStackPageData'
import { useTechStackPage } from '../hooks/useTechStackPage'

const PAGE_SIZE = 10

const TechStackPage = () => {
  const { showToast, confirmDelete } = useOutletContext()
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const {
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
  } = useTechStackPage()

  const PreviewIcon = iconMap[form.icon_key]
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
      title: `Hapus ${item.name}?`,
      text: 'Tech stack ini akan dihapus permanen dari database.',
    })

    if (isConfirmed) {
      handleDelete(item.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Tech Stack</h1>
          <p className="mt-1 text-white/55">
            Kelola stack teknologi yang akan tampil di halaman portfolio.
          </p>
        </div>

        <Button type="button" onClick={openCreateModal} className="h-10 bg-white px-4 text-black hover:bg-white/90">
          <Plus className="size-4" />
          Tambah Stack
        </Button>
      </div>

      <Card className="border-white/10 bg-white/[0.07] py-0 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">Daftar Tech Stack</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {isLoading ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Memuat tech stack...
            </div>
          ) : items.length === 0 ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Belum ada tech stack.
            </div>
          ) : (
            <>
              <Table className="min-w-190">
                <TableHeader className="bg-black/20 text-xs uppercase text-white/45">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="px-5 py-3 text-white/45">Stack</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Icon Key</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Color</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Order</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Status</TableHead>
                    <TableHead className="px-5 py-3 text-right text-white/45">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => {
                    const ItemIcon = iconMap[item.icon_key]

                    return (
                      <TableRow key={item.id} className="border-white/10 hover:bg-white/4">
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex size-10 items-center justify-center rounded-lg border border-white/10 bg-white/6">
                              {ItemIcon && <ItemIcon className="size-6" style={{ color: item.color }} />}
                            </div>
                            <span className="font-medium text-white">{item.name}</span>
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-white/60">{item.icon_key}</TableCell>
                        <TableCell className="px-5 py-4">
                          <div className="flex items-center gap-2 text-white/60">
                            <span
                              className="size-4 rounded-full border border-white/20"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.color}
                          </div>
                        </TableCell>
                        <TableCell className="px-5 py-4 text-white/60">{item.sort_order}</TableCell>
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
                    )
                  })}
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
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-2xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 text-white shadow-2xl shadow-black/60 outline-none">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Dialog.Title className="text-base font-semibold text-white">
                {editingId ? 'Edit Tech Stack' : 'Tambah Tech Stack'}
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

            <form className="space-y-5 px-5 py-5" onSubmit={handleFormSubmit}>
              <div className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/6 p-4">
                <div className="flex size-14 items-center justify-center rounded-lg border border-white/10 bg-black/30">
                  {PreviewIcon && <PreviewIcon className="size-8" style={{ color: form.color }} />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{form.name || 'Preview'}</p>
                  <p className="mt-1 text-xs text-white/45">{form.icon_key}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium text-white/80">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    required
                    placeholder="Flutter"
                    className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="icon_key" className="text-sm font-medium text-white/80">
                    Icon
                  </label>
                  <select
                    id="icon_key"
                    name="icon_key"
                    value={form.icon_key}
                    onChange={handleChange}
                    className="h-10 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-sm text-white outline-none transition focus-visible:border-white/35 focus-visible:ring-3 focus-visible:ring-white/10"
                  >
                    {iconOptions.map((option) => (
                      <option key={option.value} value={option.value} className="bg-black text-white">
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="color" className="text-sm font-medium text-white/80">
                    Color
                  </label>
                  <div className="flex gap-2">
                    <Input
                      id="color"
                      name="color"
                      type="color"
                      value={form.color}
                      onChange={handleChange}
                      className="h-10 w-14 border-white/10 bg-white/6 p-1"
                    />
                    <Input
                      name="color"
                      value={form.color}
                      onChange={handleChange}
                      placeholder="#02569B"
                      className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="sort_order" className="text-sm font-medium text-white/80">
                    Sort Order
                  </label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    value={form.sort_order}
                    onChange={handleChange}
                    className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/6 px-3 py-2 text-sm text-white/75">
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
                  disabled={isSaving}
                  className="h-10 bg-white px-4 text-black hover:bg-white/90"
                >
                  <Plus className="size-4" />
                  {isSaving ? 'Menyimpan...' : editingId ? 'Update Stack' : 'Tambah Stack'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default TechStackPage
