import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], totalPrice: 0 });
  const [cartLoading, setCartLoading] = useState(false);

  const fetchCart = async () => {
    if (!user || user.role !== 'customer') return;
    try {
      setCartLoading(true);
      const res = await api.get('/cart');
      setCart(res.data);
    } catch { } finally { setCartLoading(false); }
  };

  useEffect(() => { fetchCart(); }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    const res = await api.post('/cart/add', { productId, quantity });
    setCart(res.data.cart);
    return res.data;
  };

  const updateQuantity = async (productId, quantity) => {
    const res = await api.put('/cart/update', { productId, quantity });
    setCart(res.data.cart);
  };

  const removeItem = async (productId) => {
    const res = await api.delete(`/cart/item/${productId}`);
    setCart(res.data.cart);
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart({ items: [], totalPrice: 0 });
  };

  const itemCount = cart.items?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  return (
    <CartContext.Provider value={{ cart, cartLoading, fetchCart, addToCart, updateQuantity, removeItem, clearCart, itemCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
