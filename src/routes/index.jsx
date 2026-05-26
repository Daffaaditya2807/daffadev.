import { createBrowserRouter } from 'react-router-dom'
import PortfolioPage from '../features/portfolio/page/PortfolioPage'
import AdminLayout from '../features/admin/presentation/layouts/AdminLayout'
import DashboardPage from '../features/admin/presentation/pages/DashboardPage'
import AdminPortfolioPage from '../features/admin/presentation/pages/PortfolioPage'
import ProfilePage from '../features/admin/presentation/pages/ProfilePage'
import TechStackPage from '../features/admin/presentation/pages/TechStackPage'
import ProtectedRoute from '../features/auth/presentation/components/ProtectedRoute'
import LoginPage from '../features/auth/presentation/pages/LoginPage'
import JourneyPage from '../features/admin/presentation/pages/JourneyPage'
import TypingTextPage from '../features/admin/presentation/pages/TypingTextPage'
import BlogPage from '../features/admin/presentation/pages/BlogPage'
import BlogUserPage from '../features/blog/page/BlogUserPage'
import BlogDetailPage from '../features/blog/page/BlogDetailPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <PortfolioPage />,
  },
  {
    path: '/blog',
    element: <BlogUserPage />,
  },
  {
    path: '/blog/:slug',
    element: <BlogDetailPage />,
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <ProfilePage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },
      {
        path: 'portfolio',
        element: <AdminPortfolioPage />,
      },
      {
        path: 'tech-stack',
        element: <TechStackPage />,
      },
      {
        path: 'journey',
        element: <JourneyPage />,
      },
      {
        path: 'typing-text',
        element: <TypingTextPage />,
      },
         {
        path: 'blog',
        element: <BlogPage />,
      },
    ],
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '*',
    element: <div className="p-10 text-center font-bold text-red-500">404 - Halaman Tidak Ditemukan</div>,
  },
])
