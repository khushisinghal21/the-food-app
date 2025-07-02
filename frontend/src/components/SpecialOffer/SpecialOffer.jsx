import React, { useEffect, useState } from 'react';
import { cardData, additionalData } from '../../assets/dummydata';
import { useCart } from '../../cardContext/cardContext';
import { FaPlus, FaFire } from 'react-icons/fa';
import { HiPlus, HiMinus } from 'react-icons/hi';
import FloatingParticle from '../FloatingParticle/FloatingParticle';
import axios from 'axios';
const SpecialOffer = () => {
  const [showAll, setShowAll] = useState(false);
  const initialData = [...cardData, ...additionalData];
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();

  const handleAdd = (item) => {
    addToCart(item, 1);
  };
  const [items,setItems]=useState([])
  useEffect(()=>{
    axios.get('https://the-food-app-backend.onrender.com/api/items')
    .then(res=>setItems(res.data.items ?? res.data))
    .catch(err=>console.error(err))

  },[])

  const displayList=Array.isArray(items)?items.slice(0,showAll?8:4):[]

  const addButtonBase = 'relative z-10 flex items-center gap-2 bg-amber-700 px-4 py-2 rounded-full font-bold text-white';
  const addButtonHover = 'hover:bg-amber-800 hover:scale-105 hover:shadow-lg';
  const commonTransition = 'transition-all duration-300';

  return (
    <div className='bg-gradient-to-b from-[#1a1212] to-[#2a1e1e] text-white py-16 px-4 font-[Poppins]'>
      <div className='max-w-7xl mx-auto'>
        <div className='text-center mb-14'>
          <h1 className='text-5xl bold mb-4 bg-gradient-to-r from-amber-400 to-red-500 bg-clip-text text-transparent font-[Playfair_Display] italic'>
            Today’s <span className='text-stroke-gold'>Special</span> Offers
          </h1>
          <p className='text-lg text-gray-300 max-w-3xl mx-auto tracking-wide leading-relaxed'>
            Savor the extraordinary with our culinary masterpieces crafted to perfection.
          </p>
        </div>

        {/* Product Cards */}
        <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8'>
          {displayList.map(item => {
            const cartItem = cartItems.find(ci => ci.item._id === item._id);
            const qty = cartItem ? cartItem.quantity : 0;
            const cartId=cartItem?._id


            return (
              <div
                key={item._id}
                className='relative group bg-[#4b3b3b] rounded-3xl overflow-hidden shadow-2xl transform hover:-translate-y-4 transition-all duration-500 hover:shadow-red-900/40 border-2 border-transparent hover:border-amber-500/20'
              >
                <div className='relative h-72 overflow-hidden'>
                  <img
                    src={
    item.image
      ? item.image.startsWith('http')
        ? item.image
        : `https://the-food-app-backend.onrender.com${item.image}`
      : '/placeholder.jpg'
  }
                    alt={item.name}
                    className='w-full h-full object-cover brightness-90 group-hover:brightness-110 transition-all duration-500'
                  />
                </div>
                <div className='p-4'>
                  <h2 className='text-xl font-semibold'>{item.name}</h2>
                  <p className='text-sm text-gray-300 mb-2'>{item.description}</p>
                  <div className='flex items-center justify-between'>
                    <span className='text-amber-400 font-bold'>₹{Number(item.price).toFixed(2)}</span>
                    {cartItem ? (
                      <div className='flex items-center gap-3'>
                        <button
                          onClick={() => {
                            qty > 0
                              ? updateQuantity(cartId, qty - 1)
                              : removeFromCart(cartId);
                          }}
                          className='w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95'
                        >
                          <HiMinus />
                        </button>
                        <span className='w-8 text-center text-amber-100 font-cinzel'>{qty}</span>
                        <button
                          onClick={() => updateQuantity(cartId, qty + 1)}
                          className='w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-all duration-200 active:scale-95'
                        >
                          <HiPlus className='w-4 h-4 text-amber-100' />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() =>
                          addToCart(item,1)
                        }
                        className={`${addButtonBase} ${addButtonHover} ${commonTransition}`}
                      >
                        <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300'></div>
                        <FaPlus className='text-lg transition-transform' />
                        <span className='relative z-10'>Add</span>
                      </button>
                    )}
                  </div>
                </div>

                <div className='absolute inset-0 rounded-3xl pointer-events-none border-2 border-transparent group-hover:border-amber-500/50 transition-all duration-500'></div>

                <div className='opacity-0 group-hover:opacity-100'>
                  <FloatingParticle />
                </div>
              </div>
            );
          })}
        </div>

        {/* Show More Button */}
        <div className='mt-12 flex justify-center'>
          <button
            onClick={() => setShowAll(!showAll)}
            className='relative flex items-center gap-3 bg-gradient-to-r from-red-700 to-amber-700 text-white px-8 py-4 rounded-2xl font-bold text-lg uppercase tracking-wider hover:gap-4 hover:scale-105 hover:shadow-xl hover:shadow-amber-500/20 transition-all duration-300 group border-2 border-amber-400 overflow-hidden'
          >
            <div className='absolute inset-0 bg-gradient-to-r from-amber-500/20 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
            <FaFire className='text-xl animate-pulse' />
            <span className='relative z-10'>{showAll ? 'Show Less' : 'Show More'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpecialOffer;
