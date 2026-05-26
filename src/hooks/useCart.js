import { useDispatch, useSelector } from "react-redux";
import { addToCart, getCart, removeFromCart, clearCart } from "../api/cart";
import { setCart, clearCart as clearCartAction } from "../store/cartSlice";
import { useCallback, useEffect, useState } from "react";

function useCart() {
  const dispatch = useDispatch();

  const items = useSelector((state) => state.cart.items);
  const totalItems = useSelector((state) => state.cart.totalItems);
  const totalPrice = useSelector((state) => state.cart.totalPrice);

  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [error, setError] = useState(null);

  const fetchCart = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getCart();
      dispatch(
        setCart({
          items: data.data.items ?? [],
          totalItems: data.data.totalItems ?? 0,
          totalPrice: data.data.totalPrice ?? 0,
        }),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Could not load cart");
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const handleAddToCart = async (productId) => {
    setActionLoading(productId);
    setError(null);

    try {
      const { data } = await addToCart(productId);
      dispatch(
        setCart({
          items: data.data.items ?? [],
          totalPrice: data.data.totalPrice ?? 0,
          totalItems: data.data.totalItems ?? 0,
        }),
      );
    } catch (error) {
      setError(error.response?.data?.message || "Could not add item");
    } finally {
      setActionLoading(null);
    }
  };

  const handleRemoveFromCart = async (productId) => {
    setActionLoading(productId);
    setError(null);
    try {
      const { data } = await removeFromCart(productId);
      dispatch(
        setCart({
          items: data.data.items ?? [],
          totalPrice: data.data.totalPrice ?? 0,
          totalItems: data.data.totalItems ?? 0,
        }),
      );
    } catch (err) {
      setError(err.response?.data?.message || "Could not remove item");
    } finally {
      setActionLoading(null);
    }
  };

  const handleClearCart = async () => {
    setLoading(true)
    setError(null)
    try {
      await clearCart()
      dispatch(clearCartAction())  // no server response needed — just wipe Redux
    } catch (err) {
      setError(err.response?.data?.message || "Could not clear cart")
    } finally {
      setLoading(false)
    }
  }

  const isInCart = (productId) => 
    items.some(item => item.product._id === productId)

  return {
    items,
    totalItems,
    totalPrice,
    loading,
    error,
    actionLoading,

    refetch: fetchCart,
    addToCart: handleAddToCart,
    removeFromCart: handleRemoveFromCart,
    clearCart: handleClearCart,

    isInCart,
  }
}
export default useCart;