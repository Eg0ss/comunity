import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Home from './pages/Home'
import Login from './pages/Login'
import PostDetail from './pages/PostDetail'
import PrivateRoute from './routes/PrivateRoute'
import PublicRoute from './routes/PublicRoute'

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />
          <Route path="/posts/:slug" element={<PostDetail />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
