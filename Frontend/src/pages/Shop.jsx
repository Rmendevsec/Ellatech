import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";

const etb = (n) => Number(n).toLocaleString("en-US") + " ETB";

export default function Shop() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart, addToCart, updateQty } = useCart();
  const [cartOpen, setCartOpen] = useState(false);
  const navigate = useNavigate();

  // Fetch products from your real backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data.products);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);

  // Handle Checkout (Redirects to checkout page)
  const handleCheckout = () => {
    if (cartCount === 0) return;
    setCartOpen(false);
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] font-sans selection:bg-orange-500 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md shadow-sm py-4 px-6 md:px-12 flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/shop")}>
          <div className="w-10 h-10 bg-[#FC5207] text-white rounded-xl flex items-center justify-center font-bold text-xl">M</div>
          <span className="text-xl font-bold tracking-tight text-gray-900">Merkato</span>
        </div>
        <div className="flex items-center gap-6">
          <button className="text-gray-600 font-medium hover:text-[#FC5207]" onClick={() => navigate("/login")}>Login</button>
          <button className="relative p-2 text-gray-600 hover:text-[#FC5207]" onClick={() => setCartOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 4h2.5l2 10h10L19 7H6M9 19h.01M17 19h.01"/></svg>
            {cartCount > 0 && <span className="absolute top-0 right-0 bg-[#FC5207] text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">{cartCount}</span>}
          </button>
        </div>
      </header>

      {/* HERO */}
      <section className="text-center py-20 px-4">
        <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight mb-6">
          Shop anything from<br />
          <span className="bg-[#FC5207] text-white px-6 py-1 rounded-full inline-block -rotate-2 mt-2">Merkato</span> at your home
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto text-lg mb-8">
          Find everything you need from Merkato in one place. Order easily and get your items delivered safely to your home.
        </p>
      </section>

      {/* PRODUCTS GRID */}
      <section className="max-w-7xl mx-auto px-6 pb-24">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Trending Products</h2>
        
        {loading ? (
          <div className="text-center py-20 text-gray-500">Loading products...</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-500 bg-white rounded-2xl border border-gray-100">
            No products available yet. Merchants can add them from their dashboard!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p) => (
              <div key={p.id} className="bg-white rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 group">
                <div className="h-48 bg-gray-50 rounded-xl mb-4 overflow-hidden flex items-center justify-center p-4">
                  {p.imageUrl ? (
                     <img src={`http://localhost:5000${p.imageUrl}`} alt={p.name} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                  ) : (
                     <span className="text-gray-300 font-bold text-4xl">{p.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <span className="text-xs text-gray-400 font-semibold uppercase">{p.category || "General"}</span>
                  <h3 className="font-bold text-gray-900 mt-1 mb-2">{p.name}</h3>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-[#FC5207]">{etb(p.price)}</span>
                    <button 
                      onClick={() => addToCart(p)}
                      className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-[#FC5207] transition-colors"
                    >
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* CART DRAWER */}
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity ${cartOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setCartOpen(false)} />
      <aside className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl transition-transform duration-300 flex flex-col ${cartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="p-6 border-b flex justify-between items-center">
          <h3 className="text-xl font-bold">Your Cart ({cartCount})</h3>
          <button onClick={() => setCartOpen(false)} className="text-gray-500 hover:text-black">✕</button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cart.length === 0 ? (
            <p className="text-center text-gray-500 mt-10">Your cart is empty.</p>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex gap-4 items-center border-b pb-4">
                <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                   {item.imageUrl && <img src={`http://localhost:5000${item.imageUrl}`} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1">
                  <h4 className="font-bold text-sm">{item.name}</h4>
                  <p className="text-[#FC5207] font-bold text-sm">{etb(item.price)}</p>
                  <div className="flex items-center gap-3 mt-2 border rounded-full w-max px-2 py-1">
                    <button onClick={() => updateQty(item.id, -1)} className="text-gray-500 hover:text-black">-</button>
                    <span className="text-sm font-bold w-4 text-center">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, 1)} className="text-gray-500 hover:text-black">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="p-6 border-t bg-gray-50">
            <button onClick={handleCheckout} className="w-full bg-[#FC5207] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors">
              Proceed to Checkout
            </button>
          </div>
        )}
      </aside>
    </div>
  );
}