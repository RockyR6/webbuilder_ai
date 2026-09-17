import { Routes, Route, Navigate } from 'react-router-dom'
import {GuestLayout, AuthLayout} from './pages/LayoutPage'
import AuthPage from './pages/AuthPage'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import PreviewPage from './pages/PreviewPage'

const App = () => {
  return (
    <Routes>
      {/*Login Routes */}
      <Route element={<GuestLayout />}>
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
      </Route>

      {/*Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
      </Route>
      
      {/*Protected Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/builder/:id" element={<BuilderPage />} />
        <Route path="/preview/:id" element={<PreviewPage />} />
      </Route>

      {/* Catch-all */}
      <Route path="*" element={<Navigate replace to="/" />} />
    </Routes>

    
  )
}

export default App
