import { Outlet } from 'react-router-dom'
import Swal from 'sweetalert2'
import 'sweetalert2/dist/sweetalert2.min.css'
import Sidebar from '../components/partials/Sidebar'
import Header from '../components/partials/Header'

const AdminLayout = () => {
  const showToast = ({ icon = 'success', title }) => {
    Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 2400,
      timerProgressBar: true,
      background: '#111111',
      color: '#ffffff',
      customClass: {
        popup: 'border border-white/10 shadow-2xl shadow-black/50',
      },
    }).fire({
      icon,
      title,
    })
  }

  const confirmDelete = async ({
    title = 'Hapus data?',
    text = 'Data yang dihapus tidak bisa dikembalikan.',
  } = {}) => {
    const result = await Swal.fire({
      title,
      text,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, hapus',
      cancelButtonText: 'Batal',
      reverseButtons: true,
      background: '#111111',
      color: '#ffffff',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#3f3f46',
      customClass: {
        popup: 'border border-white/10 shadow-2xl shadow-black/50',
      },
    })

    return result.isConfirmed
  }

  return (
    <div className="relative flex h-screen w-full overflow-hidden bg-black text-white">
      <Sidebar />

      <div className="relative z-10 flex w-full flex-1 flex-col">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 text-white md:p-6 lg:p-8 [&_h1]:text-white [&_p]:text-white/55">
          <div className="mx-auto max-w-7xl rounded-2xl border border-white/10 bg-white/6 p-4 shadow-2xl shadow-black/40 backdrop-blur-2xl md:p-6">
            <Outlet context={{ showToast, confirmDelete }} />
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
