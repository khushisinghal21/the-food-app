import React, {
  useReducer,
  useEffect,
  useCallback,
  useContext,
  useMemo,
} from 'react';
import axios from 'axios';

const CartContext = React.createContext();

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'HYDRATE_CART': {
      const data = Array.isArray(action.payload) ? action.payload : [];
      return data;
    }

    case 'ADD_ITEM': {
      const newItem = action.payload;
      // Check if item already exists by comparing menu item IDs
      const existingIndex = state.findIndex(ci => 
        ci.item && ci.item._id === newItem.item._id
      );
      
      if (existingIndex >= 0) {
        // Update existing item
        return state.map((ci, index) =>
          index === existingIndex ? newItem : ci
        );
      }
      // Add new item
      return [...state, newItem];
    }

    case 'REMOVE_ITEM':
      return state.filter(ci => ci._id !== action.payload);

    case 'UPDATE_ITEM': {
      const updatedItem = action.payload;
      return state.map(ci =>
        ci._id === updatedItem._id ? updatedItem : ci
      );
    }

    case 'CLEAR_CART':
      return [];

    default:
      return state;
  }
};

// Load cart from localStorage initially
const initializer = () => {
  if (typeof window !== 'undefined') {
    const storedCart = localStorage.getItem('cart');
    return storedCart ? JSON.parse(storedCart) : [];
  }
  return [];
};

export const CardProvider = ({ children }) => {
  const [cart, dispatch] = useReducer(cartReducer, [], initializer);

  // HYDRATE from backend
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (!token) return; // Don't fetch if not authenticated
    
    axios
      .get('http://localhost:8000/api/cart', {
        withCredentials: true,
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(res => {
        console.log('HYDRATE_CART response:', res.data); 
        // Your backend returns { success: true, data: [...] }
        const items = res.data.success ? res.data.data : [];
        dispatch({ type: 'HYDRATE_CART', payload: items });
      })
      .catch(err => {
        if (err.response?.status !== 401) {
          console.error('Failed to load cart:', err);
        }
      });
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart.length > 0) {
      localStorage.setItem('cart', JSON.stringify(cart));
    } else {
      localStorage.removeItem('cart');
    }
  }, [cart]);

  // === Action Dispatchers ===
  const addToCart = useCallback(async (item, qty) => {
    const itemId = item._id || item.id;
    if (!itemId) {
      console.error('Invalid item passed to addToCart:', item);
      return;
    }
    
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    try {
      const res = await axios.post(
        'http://localhost:8000/api/cart',
        {
          itemId: itemId,
          quantity: qty,
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Add to cart response:', res.data);
      
      if (res.data.success) {
        dispatch({ type: 'ADD_ITEM', payload: res.data.data });
      }
    } catch (err) {
      console.error('Add to cart error:', err.response?.data || err.message);
    }
  }, []);

  const removeFromCart = useCallback(async (cartItemId) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    try {
      const res = await axios.delete(`http://localhost:8000/api/cart/${cartItemId}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Remove from cart response:', res.data);
      
      if (res.data.success) {
        dispatch({ type: 'REMOVE_ITEM', payload: cartItemId });
      }
    } catch (err) {
      console.error('Remove from cart error:', err.response?.data || err.message);
    }
  }, []);

  const updateQuantity = useCallback(async (cartItemId, qty) => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    if (!cartItemId || qty === undefined) {
      console.error('[updateQuantity] Missing cartItemId or qty', { cartItemId, qty });
      return;
    }

    try {
      const res = await axios.put(
        `http://localhost:8000/api/cart/${cartItemId}`,
        { quantity: qty },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Update quantity response:', res.data);
      if (res.data.data) {
        dispatch({ type: 'UPDATE_ITEM', payload: res.data.data });
      }
    } catch (err) {
      console.error('Update quantity error:', err.response?.data || err.message);
    }
  }, []);

  const clearCart = useCallback(async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      console.error('No auth token found');
      return;
    }

    try {
      const res = await axios.delete(
        'http://localhost:8000/api/cart/clear',
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      console.log('Clear cart response:', res.data);
      
      if (res.data.success) {
        dispatch({ type: 'CLEAR_CART' });
      }
    } catch (err) {
      console.error('Clear cart error:', err.response?.data || err.message);
    }
  }, []);

  // === Cart Summary ===
  const cartItems = useMemo(() => Array.isArray(cart) ? cart : [], [cart]);

  const totalItems = useMemo(
    () => cartItems.reduce((sum, ci) => sum + (ci?.quantity || 0), 0),
    [cartItems]
  );

  const totalAmount = useMemo(
    () =>
      cartItems.reduce((sum, ci) => {
        const price = ci?.item?.price ?? 0;
        const qty = ci?.quantity ?? 0;
        return sum + price * qty;
      }, 0),
    [cartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalAmount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};