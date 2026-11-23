import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import api from "../api/axios";

const etb = (n) => Number(n).toLocaleString("en-US") + " ETB";

export default function Checkout() {
  const { cart, total, clearCart } = useCart();
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) return setError("Please enter a delivery address.");
    if (cart.length === 0) return setError("Your cart is empty.");

    setLoading(true);
    setError("");

    try {
      // Get the merchantProfileId from the first item (Assuming all items are from same merchant for MVP)
      const merchantProfileId = cart[0].merchantProfileId;

      const payload = {
        merchantProfileId,
        deliveryAddress: address,
        items: cart.map(item => ({
          productId: item.id,
          quantity: item.qty
        }))
      };

      // Send to backend
      await api.post("/orders", payload);
      
      clearCart();
      alert("Order placed successfully! Waiting for a driver.");
      navigate("/shop"); // Or to a "My Orders" page
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="min-h-screen flex items-center justify-center text-xl text-gray-500">Your cart is empty. <button onClick={() => navigate("/shop")} className="ml-2 text-[#FC5207] font-bold underline">Go Shop</button></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h2>
          
          {error && <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">{error}</div>}

          <form onSubmit={handlePlaceOrder} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
              <textarea
                required
                rows="3"
                className="w-full border-gray-300 rounded-xl shadow-sm focus:border-[#FC5207] focus:ring-[#FC5207] p-4 border"
                placeholder="Enter your full address (e.g., Bole, Addis Ababa)"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>
              {cart.map(item => (
                <div key={item.id} className="flex justify-between py-2 text-sm text-gray-600">
                  <span>{item.qty} × {item.name}</span>
                  <span>{etb(item.price * item.qty)}</span>
                </div>
              ))}
              <div className="flex justify-between py-4 text-xl font-bold text-gray-900 border-t mt-4">
                <span>Total (Cash on Delivery)</span>
                <span className="text-[#FC5207]">{etb(total)}</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#FC5207] text-white font-bold py-4 rounded-xl hover:bg-orange-600 transition-colors disabled:opacity-70"
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}