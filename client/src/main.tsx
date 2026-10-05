import { createRoot } from 'react-dom/client'
import { router } from './routes/Router.tsx'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from './contexts/authContext.tsx'
import { Suspense } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './index.css'
import './utils/i18n';
import './App.css'
import './components/Loaders.css'
import { AppLoader } from './components/Loaders.tsx';

createRoot(document.getElementById('root')!).render(
  <Suspense fallback={<AppLoader />}>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </Suspense>
)
