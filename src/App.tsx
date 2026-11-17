import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductPage } from './pages/ProductPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-[#18181b] text-white">
        <Header />

        <main className="flex-1">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/catalog" element={<CatalogPage />} />
            <Route path="/product/:slug" element={<ProductPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/account" element={<AccountPage />} />
          </Routes>
        </main>

        <footer className="border-t border-zinc-800/80 py-8 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} i:Store Новосибирск. Учебный проект.
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default App;
