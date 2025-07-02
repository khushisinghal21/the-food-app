import React, { useState } from 'react';
import { useCart } from '../../cardContext/cardContext';
import { Link } from 'react-router-dom';
import { FaPlus, FaMinus } from 'react-icons/fa';
import { FaTrash } from 'react-icons/fa';
import { FaTimes } from 'react-icons/fa';
const API_URL="https://the-food-app-backend.onrender.com"

const buildImageUrl = (path) => {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  if (path.startsWith("/uploads/")) return `${API_URL}${path}`;
  return `${API_URL}/uploads/${path}`;
};
const CartPage = () => {
    const { cartItems, removeFromCart, updateQuantity, totalAmount } = useCart();
    const [selectedImage, setSelectedImage] = useState(null);
  
    return (
      <div className="min-h-screen overflow-x-hidden py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#1a120b] via-[#2b2b1d] to-[#3e2b1d]">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center mb-12 animate-fade-in-down">
            <span className="text-5xl sm:text-6xl md:text-7xl mb-2 bg-gradient-to-r from-amber-400 to-amber-400 bg-clip-text text-transparent">
              Your Cart
            </span>
          </h1>
  
          {cartItems.length === 0 ? (
            <div className="text-center animate-fade-in">
              <p className="text-amber-100/80 text-xl mb-4">
                Your cart is empty. Start adding items to enjoy our delicious offerings!
              </p>
              <Link
                to="/menu"
                className="transition-all duration-100 text-amber-100 inline-flex items-center gap-2 hover:gap-3 hover:bg-amber-800/50 bg-amber-900/40 px-6 py-2 rounded-full font-cinzel text-sm uppercase"
              >
                Browse Menu
              </Link>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {cartItems.map((ci) => {
                const { _id, item, quantity } = ci;
                // Guard: skip rendering if item is missing
                if (!item) return null;
                return (
                  <div
                    key={_id}
                    className="group bg-amber-900/20 p-4 rounded-2xl border-4 ..."
                  >
                    <div
                      className="w-24 h-24 ... "
                      onClick={() => setSelectedImage(buildImageUrl(item.image))}
                    >
                      <img src={buildImageUrl(item.image)} alt={item.name} className="..." />
                    </div>
                    <div className="text-amber-100 mt-4 text-center">
                      <p className="text-lg font-semibold">{item.name}</p>
                      <p className="text-sm">Price: ₹{Number(item.price).toFixed(2)}</p>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-center gap-3 mt-3">
                        <button
                          onClick={() => {
                            console.log('[CART PAGE] updateQuantity', _id, Math.max(1, quantity - 1));
                            updateQuantity(_id, Math.max(1, quantity - 1));
                          }}
                          className="..."
                        >
                          <FaMinus className="..." />
                        </button>

                        <span className="w-8 text-center text-amber-100 font-cinzel">{quantity}</span>

                        <button
                          onClick={() => {
                            console.log('[CART PAGE] updateQuantity', _id, quantity + 1);
                            updateQuantity(_id, quantity + 1);
                          }}
                          className="..."
                        >
                          <FaPlus className="..." />
                        </button>
                      </div>

                      <div className="flex items-center justify-between w-full mt-4">
                        <button
                          onClick={() => removeFromCart(_id)}
                          className="..."
                        >
                          <FaTrash className="..." />
                          <span className="text-amber-100">Remove</span>
                        </button>
                        <p className="text-sm font-dancingscript text-amber-300">
                          ₹{Number(quantity * item.price).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}

              </div>
  
              {/* Bottom Section with Continue Shopping & Total */}
              <div className="mt-12 pt-8 border-t border-amber-800/30 animate-fade-in-up">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-8">
                  <Link
                    to="/menu"
                    className="bg-amber-900/40 px-8 py-3 rounded-full font-cinzel uppercase tracking-wider hover:bg-amber-800/50 transition-all duration-300 text-amber-100 inline-flex items-center gap-2 hover:gap-3 active:scale-95"
                  >
                    Continue Shopping
                  </Link>
  
                  <div className="flex items-center gap-8">
                    <h2 className="text-3xl font-dancingscript text-amber-100">
                      Total: ₹{totalAmount}
                    </h2>

                    <Link to='/checkout' className='bg-amber-900/40 px-8 py-3 rounded-full font-cinzel
                    uppercase tracking-wide hover:bg-amber-800/50 transition-all duration-300 text-amber-100 flex items-center gap-2 active:scale-95 '>CheckOut Now</Link>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {selectedImage && (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-amber-900/40 bg-opacity-75 backdrop-blur p-4 overflow-auto"
       onClick={() => setSelectedImage(null)}>
    <div className="relative max-w-full max-h-full">
      <img src={selectedImage} alt="Full View" className="max-w-[90vw] max-h-[90vh] rounded-lg object-contain" />
      <button
        onClick={() => setSelectedImage(null)}
        className="absolute top-1 right-1 bg-amber-900/80 rounded-full p-2 text-black hover:bg-amber-800/90 transition duration-200 active:scale-90"
      >
        <FaTimes className="w-6 h-6" />
      </button>
    </div>
  </div>
)}

      </div>
    );
  };
  
  export default CartPage;