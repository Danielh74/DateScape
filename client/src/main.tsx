import { createRoot } from 'react-dom/client'
import { router } from './routes/Router.tsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/authContext.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'


createRoot(document.getElementById('root')!).render(
  <AuthProvider>
    <RouterProvider router={router} />
  </AuthProvider>
)
