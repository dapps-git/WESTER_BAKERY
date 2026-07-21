import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CakesPage from './pages/Cakes'
import AdminDashboard from './pages/AdminDashboard'
import './index.css'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cakes" element={<CakesPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </BrowserRouter>
  )
}
