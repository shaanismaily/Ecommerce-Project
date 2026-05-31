// Also serves as the order confirmation page after checkout —
// CheckoutPage navigates here immediately after placeOrder succeeds.

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getOrderById } from "../api/orders"

const STATUS_STYLES = {
  PENDING:    { background: "#FEF3C7", color: "#92400E" },
  DELIVERED:  { background: "#D1FAE5", color: "#065F46" },
  CANCELLED:  { background: "#FEE2E2", color: "#991B1B" },
  PROCESSING: { background: "#DBEAFE", color: "#1E40AF" },
}

// Visual order timeline
const STATUS_STEPS = ["PENDING", "PROCESSING", "DELIVERED"]

function OrderDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [order, setOrder]     = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await getOrderById(id)
        setOrder(data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Could not load order")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <p style={{ padding: "2rem" }}>Loading order...</p>
  if (error)   return <p style={{ padding: "2rem", color: "red" }}>{error}</p>
  if (!order)  return null

  const statusStyle   = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING
  const currentStep   = STATUS_STEPS.indexOf(order.status)
  const address       = order.address

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>
      <button onClick={() => navigate("/orders")} style={{ marginBottom: "1.5rem" }}>
        ← My orders
      </button>

      {/* ── Header ── */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "1.5rem" }}>
        <div>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 700 }}>
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: "gray", fontSize: "0.875rem", marginTop: "4px" }}>
            Placed on {new Date(order.createdAt).toLocaleDateString("en-IN", {
              year: "numeric", month: "long", day: "numeric"
            })}
          </p>
        </div>
        <span style={{ ...statusStyle, padding: "5px 14px", borderRadius: "20px", fontWeight: 600, fontSize: "0.875rem" }}>
          {order.status}
        </span>
      </div>

      {/* ── Status timeline ── */}
      {order.status !== "CANCELLED" && (
        <div style={{ display: "flex", alignItems: "center", marginBottom: "2rem", padding: "1.25rem", background: "#f9f9f9", borderRadius: "10px" }}>
          {STATUS_STEPS.map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", flex: i < STATUS_STEPS.length - 1 ? 1 : 0 }}>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div style={{
                  width: "28px", height: "28px", borderRadius: "50%",
                  background: i <= currentStep ? "#2D5BE3" : "#ddd",
                  color: "#fff", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.75rem", fontWeight: 600,
                }}>
                  {i < currentStep ? "✓" : i + 1}
                </div>
                <p style={{ fontSize: "0.7rem", marginTop: "4px", color: i <= currentStep ? "#2D5BE3" : "gray", fontWeight: i === currentStep ? 600 : 400 }}>
                  {step}
                </p>
              </div>
              {i < STATUS_STEPS.length - 1 && (
                <div style={{ flex: 1, height: "2px", background: i < currentStep ? "#2D5BE3" : "#ddd", margin: "0 8px", marginBottom: "20px" }} />
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Order items ── */}
      <div style={{ border: "1px solid #eee", borderRadius: "10px", marginBottom: "1.25rem", overflow: "hidden" }}>
        <div style={{ padding: "1rem 1.25rem", borderBottom: "1px solid #eee", background: "#fafafa" }}>
          <h2 style={{ fontSize: "1rem" }}>Items ({order.items?.length})</h2>
        </div>

        {order.items?.map(item => (
          <div
            key={item.product._id}
            style={{ display: "flex", gap: "1rem", padding: "1rem 1.25rem", borderBottom: "1px solid #eee", alignItems: "center", cursor: "pointer" }}
            onClick={() => navigate(`/products/${item.product._id}`)}
          >
            <img
              src={item.product.mainImage?.url}
              alt={item.product.name}
              style={{ width: "64px", height: "64px", objectFit: "cover", borderRadius: "8px", flexShrink: 0 }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {item.product.name}
              </p>
              <p style={{ fontSize: "0.875rem", color: "gray", marginTop: "2px" }}>
                ₹ {item.product.price} × {item.quantity}
              </p>
            </div>
            <p style={{ fontWeight: 600, flexShrink: 0 }}>
              ₹ {item.product.price * item.quantity}
            </p>
          </div>
        ))}

        {/* Total row */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "1rem 1.25rem", fontWeight: 700 }}>
          <span>Total</span>
          <span>₹ {order.orderPrice}</span>
        </div>
      </div>

      {/* ── Delivery address ── */}
      {address && (
        <div style={{ border: "1px solid #eee", borderRadius: "10px", padding: "1.25rem" }}>
          <h2 style={{ fontSize: "1rem", marginBottom: "10px" }}>Delivery address</h2>
          <p style={{ fontWeight: 500 }}>{address.addressLine1}</p>
          {address.addressLine2 && <p style={{ color: "gray", fontSize: "0.875rem" }}>{address.addressLine2}</p>}
          <p style={{ color: "gray", fontSize: "0.875rem" }}>
            {address.city}, {address.state} — {address.pincode}
          </p>
          <p style={{ color: "gray", fontSize: "0.875rem" }}>{address.country}</p>
        </div>
      )}

      {/* ── Actions ── */}
      <div style={{ display: "flex", gap: "10px", marginTop: "1.5rem" }}>
        <button onClick={() => navigate("/products")} style={{ padding: "10px 20px" }}>
          Continue shopping
        </button>
        <button onClick={() => navigate("/orders")} style={{ padding: "10px 20px" }}>
          All orders
        </button>
      </div>
    </div>
  )
}

export default OrderDetailPage