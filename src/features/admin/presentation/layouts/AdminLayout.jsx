import { useState, useCallback } from 'react'
import { Outlet } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import * as Dialog from '@radix-ui/react-dialog'
import { Button } from '@/components/ui/button'
import SEO from '@/components/common/SEO'
import Sidebar from '../components/partials/Sidebar'
import Header from '../components/partials/Header'

const AdminLayout = () => {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', text: '', resolve: null })

  const showToast = ({ icon = 'success', title }) => {
    if (icon === 'success') {
      toast.success(title, { theme: 'dark' });
    } else if (icon === 'error') {
      toast.error(title, { theme: 'dark' });
    } else {
      toast(title, { theme: 'dark' });
    }
  }

  const confirmDelete = useCallback(({
    title = 'Hapus data?',
    text = 'Data yang dihapus tidak bisa dikembalikan.',
  } = {}) => {
    return new Promise((resolve) => {
      setConfirmDialog({ isOpen: true, title, text, resolve })
    })
  }, [])

  const handleConfirm = () => {
    if (confirmDialog.resolve) confirmDialog.resolve(true)
    setConfirmDialog({ isOpen: false, title: '', text: '', resolve: null })
  }

  const handleCancel = () => {
    if (confirmDialog.resolve) confirmDialog.resolve(false)
    setConfirmDialog({ isOpen: false, title: '', text: '', resolve: null })
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-[#0a0a0a] text-white">
      <SEO
        title="Admin"
        description="Dashboard admin DaffaDev."
        path="/admin"
        noIndex
      />

      <Sidebar />

      <div className="relative z-10 flex w-full flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 text-white md:p-6 lg:p-8 [&_h1]:text-white [&_p]:text-white/55">
          <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-white/6 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-6">
            <Outlet context={{ showToast, confirmDelete }} />
          </div>
        </main>
      </div>
      
      <ToastContainer position="top-right" autoClose={2400} />

      <Dialog.Root open={confirmDialog.isOpen} onOpenChange={(open) => !open && handleCancel()}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border border-white/10 bg-black/90 p-6 text-white shadow-2xl shadow-black/60 outline-none">
            <div className="flex flex-col gap-4">
              <div>
                <Dialog.Title className="text-lg font-semibold text-white">{confirmDialog.title}</Dialog.Title>
                <Dialog.Description className="mt-2 text-sm text-white/60">
                  {confirmDialog.text}
                </Dialog.Description>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <Button type="button" variant="outline" onClick={handleCancel} className="border-white/10 bg-white/6 text-white hover:bg-white/10 hover:text-white">
                  Batal
                </Button>
                <Button type="button" variant="destructive" onClick={handleConfirm}>
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

export default AdminLayout
