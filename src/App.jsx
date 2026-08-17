import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import SocialLinks from './components/SocialLinks.jsx';
import Catalogo from './pages/Catalogo.jsx';
import ProductoDetalle from './pages/ProductoDetalle.jsx';
import AdminLogin from './pages/admin/AdminLogin.jsx';
import AdminProductos from './pages/admin/AdminProductos.jsx';
import NuevoProducto from './pages/admin/NuevoProducto.jsx';
import EditarProducto from './pages/admin/EditarProducto.jsx';
import WhatsAppButton from './components/WhatsappButton.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <SocialLinks />
      <main>
        <Routes>
          <Route path="/" element={<Catalogo />} />
          <Route path="/producto/:id" element={<ProductoDetalle />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/productos" element={<AdminProductos />} />
          <Route path="/admin/productos/nuevo" element={<NuevoProducto />} />
          <Route path="/admin/productos/:id/editar" element={<EditarProducto />} />
        </Routes>
      </main>
      <WhatsAppButton />
    </BrowserRouter>
  );
}
