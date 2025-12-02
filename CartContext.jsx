import { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';
import api from '../services/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
	let mounted = true;

	if (!user) {
	  setCartItems([]);
	  return;
	}

	const fetchCart = async () => {
	  try {
		const res = await api.get(`/cart/${user.id}`);
		if (mounted) setCartItems(res.data || []);
	  } catch (err) {
		console.error('Failed to load cart', err);
	  }
	};

	fetchCart();

	return () => {
	  mounted = false;
	};
  }, [user]);

  const value = { cartItems, setCartItems };

  return (
	<CartContext.Provider value={value}>
	  {children}
	</CartContext.Provider>
  );
};