import React, { useEffect, useState } from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa';

import { useCart} from '../../cardContext/cardContext.jsx'
import { dummyMenuData } from '../../assets/OmDD.js'
import axios from 'axios';
const OurMenu = () => {

    const categories = ['Breakfast', 'Lunch', 'Dinner', 'Mexican', 'Italian','Desserts', 'Drinks'];
   
    const [activeCategory, setActiveCategory] = useState(categories[0]);
    const [menuData, setMenuData] = useState({});
   
    const { cartItems, addToCart, removeFromCart, updateQuantity } = useCart();
    useEffect(()=>{
        const fetchMenu = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/items');
                const byCategory = res.data.reduce((acc, item) => {
                    const cat = item.category || 'uncategorised';
                    acc[cat] = acc[cat] || [];
                    acc[cat].push(item);
                    return acc;
                }, {});
                setMenuData(byCategory);
            } catch (err) {
                console.error("failed to load menu", err);
            }
        };
        fetchMenu();
    }, []);

      const getQuantity = (itemId) => {
        const cartItem = cartItems.find(ci => {
            // Handle both direct item structure and nested item structure
             return ci.item && ci.item._id === itemId;
        });
       return cartItem ? cartItem.quantity : 0;
    };
    const getCartItem = (itemId) => {
        return cartItems.find(ci => ci.item && ci.item._id === itemId);
    };

    const displayItems = (menuData[activeCategory] ?? []).slice(0, 12);


    const handleAddItem = (item) => {
        addToCart(item, 1);
    };

    const handleRemoveItem = (item) => {
        const cartEntry = getCartItem(item._id);
        const quantity = cartEntry?.quantity || 0;
        if (cartEntry && quantity > 1) {
            updateQuantity(cartEntry._id, quantity - 1);
        } else if (cartEntry) {
            removeFromCart(cartEntry._id);
        }
    };

    const handleIncreaseQuantity = (item) => {
        const cartEntry = getCartItem(item._id);
        const quantity = cartEntry?.quantity || 0;
        if (cartEntry && quantity > 0) {
            updateQuantity(cartEntry._id, quantity + 1);
        } else {
            addToCart(item, 1);
        }
    };
    return (
        <div className='bg-gradient-to-br from-[#1a120b] via-[#2a1e14] to-[#3e2b1d] min-h-screen py-16 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-7xl mx-auto'>
                <h2 className='text-4xl sm:text-6xl font-bold text-center mb-12 bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-amber-300 to-amber-200'>
                    <span className='font-dancingscript block text-5xl md:text-7xl sm:text-6xl mb-2'>
                        Our Exquisite Menu
                    </span>
                    <span className='block text-xl sm:text-2xl md:text-3xl font-cinzel mt-4 text-amber-100/80'>
                        A Symphony of Flavours
                    </span>
                </h2>
                
                <div className='flex flex-wrap justify-center gap-4 mb-16'>
                    {categories.map((cat) => (
                        <button 
                            key={cat} 
                            onClick={() => setActiveCategory(cat)}
                            className={`px-4 sm:px-6 py-2 rounded-full border-2 transition-all duration-300 transform font-cinzel text-sm sm:text-lg tracking-widest backdrop-blur-sm 
                            ${activeCategory === cat
                                ? 'bg-gradient-to-r from-amber-900/80 to-amber-700/80 border-amber-800 scale-105 shadow-xl text-white'
                                : 'bg-amber-900/20 border-amber-800/30 text-amber-100/80 hover:bg-amber-800/40 hover:text-white'
                            }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4'>
                    {displayItems.map((item, i) => {
                        const cartEntry = getCartItem(item._id);
                        const quantity = cartEntry?.quantity || 0;
                        return (
                            <div 
                                key={item._id} 
                                className='relative bg-amber-900/20 rounded-xl overflow-hidden border border-amber-800/30 backdrop-blur-sm flex flex-col transition-all duration-500 hover:border-amber-600/50 hover:bg-amber-900/30' 
                                style={{ '--index': i }}
                            >
                                <div className='relative h-48 sm:h-56 md:h-60 flex items-center justify-center bg-black/10'>
                                    <img 
                                       src={
        item.image
            ? item.image.startsWith('http')
                ? item.image
                : `http://localhost:8000${item.image}`
            : '/placeholder.jpg'
    }
                                        alt={item.name}
                                        className='max-h-full max-w-full object-contain transition-all duration-700' 
                                    />
                                </div>
                                
                                <div className='p-4 sm:p-6 flex flex-col flex-grow'>
                                    <div className='absolute top-0 left-1/2 -translate-x-1/2 w-16 h-1 bg-gradient-to-r from-transparent via-amber-800/50 to-transparent opacity-50 transition-all duration-300' />
                                    
                                    <h3 className="text-xl sm:text-2xl mb-2 font-dancingscript text-amber-100">
                                        {item.name}
                                    </h3>

                                    <p className="text-amber-100/80 text-xs sm:text-sm mb-4 font-cinzel leading-relaxed">
                                        {item.description}
                                    </p>

                                    <div className="mt-auto flex items-center gap-4 justify-between">
                                        <div className="bg-amber-100/10 backdrop-blur-sm px-3 py-1 rounded-2xl shadow-lg">
                                            <span className="text-xl font-bold text-amber-300 font-dancingscript">
                                                ₹{item.price}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            {quantity > 0 ? (
                                                <>
                                                    <button
                                                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-colors active:scale-95"
                                                        onClick={() => quantity > 1 && cartEntry ? updateQuantity(cartEntry._id, quantity - 1) : cartEntry ? removeFromCart(cartEntry._id) : null}
                                                    >
                                                        <FaMinus className="text-amber-100 text-xs" />
                                                    </button>
                                                    <span className="w-8 text-center text-amber-100 font-bold">
                                                        {quantity}
                                                    </span>
                                                    <button
                                                        className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-colors active:scale-95"
                                                        onClick={() => cartEntry ? updateQuantity(cartEntry._id, quantity + 1) : addToCart(item, 1)}
                                                    >
                                                        <FaPlus className="text-amber-100 text-xs" />
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    className="w-8 h-8 rounded-full bg-amber-900/40 flex items-center justify-center hover:bg-amber-800/50 transition-colors active:scale-95"
                                                    onClick={() => addToCart(item, 1)}
                                                >
                                                    <FaPlus className="text-amber-100 text-xs" />
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className='flex justify-center mt-16'>
 
</div>

            </div>
        </div>
    );
}

export default OurMenu
