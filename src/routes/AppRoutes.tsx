import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Dashboard from '../pages/Dashboard/Dashboard'
import Register from '../pages/Register/Register'
import Login from '../pages/Login/Login'
import RecoverPassword from '../pages/recoverPassword/recoverPassword'

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} /> 
      <Route path="/register" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<RecoverPassword />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
