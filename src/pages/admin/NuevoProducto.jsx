import AdminGuard from '../../components/AdminGuard.jsx';
import ProductoForm from '../../components/ProductoForm.jsx';

export default function NuevoProducto() {
  return (
    <AdminGuard>
      <div className="max-w-6xl mx-auto px-5 py-10 dark:bg-graphite-950 min-h-screen transition-colors duration-300">
        <h1 className="font-display font-bold text-2xl text-graphite-900 dark:text-white mb-8">Nuevo producto</h1>
        <ProductoForm />
      </div>
    </AdminGuard>
  );
}