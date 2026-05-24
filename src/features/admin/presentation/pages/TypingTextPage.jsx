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
import { useTypingPage } from '../hooks/usetypingPage'

const PAGE_SIZE = 10

const TypingTextPage = () => {
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
  } = useTypingPage()

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
      title: 'Hapus typing text?',
      text: `"${item.text}" akan dihapus permanen dari database.`,
    })

    if (isConfirmed) {
      handleDelete(item.id)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Typing Text</h1>
          <p className="mt-1 text-white/55">
            Kelola teks animasi typing yang tampil di halaman portfolio.
          </p>
        </div>

        <Button type="button" onClick={openCreateModal} className="h-10 bg-white px-4 text-black hover:bg-white/90">
          <Plus className="size-4" />
          Tambah Text
        </Button>
      </div>

      <Card className="border-white/10 bg-white/[0.07] py-0 text-white shadow-2xl shadow-black/30 backdrop-blur-2xl">
        <CardHeader className="border-b border-white/10 px-5 py-4">
          <CardTitle className="text-base font-semibold text-white">Daftar Typing Text</CardTitle>
        </CardHeader>
        <CardContent className="px-0 py-0">
          {isLoading ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Memuat typing text...
            </div>
          ) : items.length === 0 ? (
            <div className="m-5 rounded-lg border border-white/10 bg-black/20 px-4 py-3 text-sm text-white/55">
              Belum ada typing text.
            </div>
          ) : (
            <>
              <Table className="min-w-150">
                <TableHeader className="bg-black/20 text-xs uppercase text-white/45">
                  <TableRow className="border-white/10 hover:bg-transparent">
                    <TableHead className="px-5 py-3 text-white/45">Text</TableHead>
                    <TableHead className="px-5 py-3 text-white/45">Active</TableHead>
                    <TableHead className="px-5 py-3 text-right text-white/45">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.map((item) => (
                    <TableRow key={item.id} className="border-white/10 hover:bg-white/4">
                      <TableCell className="px-5 py-4">
                        <div>
                          <p className="font-medium text-white">{item.text}</p>
                          <p className="mt-1 text-xs text-white/40">Order: {item.sort_order}</p>
                        </div>
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
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 text-white shadow-2xl shadow-black/60 outline-none">
            <div className="flex items-center justify-between border-b border-white/10 px-5 py-4">
              <Dialog.Title className="text-base font-semibold text-white">
                {editingId ? 'Edit Typing Text' : 'Tambah Typing Text'}
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
              <div className="space-y-2">
                <label htmlFor="text" className="text-sm font-medium text-white/80">
                  Text
                </label>
                <Input
                  id="text"
                  name="text"
                  value={form.text}
                  onChange={handleChange}
                  required
                  placeholder="Frontend Developer"
                  className="h-10 border-white/10 bg-white/6 text-white placeholder:text-white/30 focus-visible:border-white/35 focus-visible:ring-white/10"
                />
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
                  {isSaving ? 'Menyimpan...' : editingId ? 'Update Text' : 'Tambah Text'}
                </Button>
              </div>
            </form>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  )
}

export default TypingTextPage
