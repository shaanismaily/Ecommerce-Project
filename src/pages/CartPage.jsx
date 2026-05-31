// Reads cart from Redux via useCart hook.
// No API call needed here — cart was already fetched when useCart mounted on ProductsPage. Redux already has the data.

import { useNavigate } from "react-router-dom"
import useCart from "../hooks/useCart"

function CartPage() {
  const navigate = useNavigate()
  const {
    items,
    totalPrice,
    totalItems,
    loading,
    error,
    actionLoading,
    removeFromCart,
    clearCart,
  } = useCart()

  if (loading) return <p>Loading cart...</p>

  if (error) return <p style={{ color: "red" }}>{error}</p>

  if (items.length === 0) {
    return (
      <div style={{ maxWidth: "700px", margin: "4rem auto", textAlign: "center", padding: "2rem" }}>
        <h2>Your cart is empty</h2>
        <p style={{ color: "gray", marginTop: "8px" }}>Add some products to get started</p>
        <button onClick={() => navigate("/products")} style={{ marginTop: "1.5rem", padding: "10px 24px" }}>
          Browse products
        </button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
        <h1>Your cart ({totalItems} items)</h1>
        <button
          onClick={clearCart}
          disabled={loading}
          style={{ color: "red", background: "none", border: "1px solid red", padding: "6px 14px", cursor: "pointer", borderRadius: "6px" }}
        >
          Clear cart
        </button>
      </div>

      {/* ── Cart items ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
        {items.map((item) => (
          <div
            key={item.product._id}
            style={{ display: "flex", gap: "1rem", padding: "1rem", border: "1px solid #eee", borderRadius: "10px", alignItems: "center" }}
          >
            <img
              src={item.product.mainImage?.url}
              alt={item.product.name}
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
            />

            <div style={{ flex: 1, minWidth: 0 }}>
              <p
                style={{ fontWeight: 600, cursor: "pointer", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}
                onClick={() => navigate(`/products/${item.product._id}`)}
              >
                {item.product.name}
              </p>
              <p style={{ color: "gray", fontSize: "0.875rem", marginTop: "4px" }}>
                ₹ {item.product.price} × {item.quantity}
              </p>
            </div>

            <div style={{ textAlign: "right", flexShrink: 0 }}>
              <p style={{ fontWeight: 600 }}>₹ {item.product.price * item.quantity}</p>
              <button
                onClick={() => removeFromCart(item.product._id)}
                disabled={actionLoading === item.product._id}
                style={{ marginTop: "8px", color: "red", background: "none", border: "none", cursor: "pointer", fontSize: "0.8rem" }}
              >
                {actionLoading === item.product._id ? "Removing..." : "Remove"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* ── Summary ── */}
      <div style={{ border: "1px solid #eee", borderRadius: "10px", padding: "1.25rem" }}>
        <h2 style={{ marginBottom: "1rem" }}>Order summary</h2>

        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ color: "gray" }}>Subtotal ({totalItems} items)</span>
          <span>₹ {totalPrice}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
          <span style={{ color: "gray" }}>Delivery</span>
          <span style={{ color: "green" }}>Free</span>
        </div>

        <hr style={{ marginBottom: "1rem" }} />

        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: "1.1rem", marginBottom: "1.25rem" }}>
          <span>Total</span>
          <span>₹ {totalPrice}</span>
        </div>

        <button
          onClick={() => navigate("/checkout")}
          style={{ width: "100%", padding: "12px", fontSize: "1rem", cursor: "pointer" }}
        >
          Proceed to checkout
        </button>
      </div>
    </div>
  )
}

export default CartPage