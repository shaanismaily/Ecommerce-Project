import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { getOrders } from "../api/orders"

// Status badge colors
const STATUS_STYLES = {
  PENDING:    { background: "#FEF3C7", color: "#92400E" },
  DELIVERED:  { background: "#D1FAE5", color: "#065F46" },
  CANCELLED:  { background: "#FEE2E2", color: "#991B1B" },
  PROCESSING: { background: "#DBEAFE", color: "#1E40AF" },
}

function OrdersPage() {
  const navigate = useNavigate()

  const [orders, setOrders]       = useState([])
  const [loading, setLoading]     = useState(true)
  const [error, setError]         = useState(null)
  const [page, setPage]           = useState(1)
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await getOrders(page, 5)
        setOrders(data.data.data ?? [])
        setTotalPages(data.data.totalPages ?? 1)
      } catch (err) {
        setError(err.response?.data?.message || "Could not load orders")
      } finally {
        setLoading(false)
      }
    }
    fetchOrders()
  }, [page])

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>
      <h1 style={{ marginBottom: "1.5rem" }}>My Orders</h1>

      {/* ── Loading ── */}
      {loading && <p>Loading orders...</p>}

      {/* ── Error ── */}
      {error && !loading && (
        <p style={{ color: "red" }}>{error}</p>
      )}

      {/* ── Empty ── */}
      {!loading && !error && orders.length === 0 && (
        <div style={{ textAlign: "center", padding: "3rem" }}>
          <p style={{ color: "gray" }}>You haven't placed any orders yet.</p>
          <button onClick={() => navigate("/products")} style={{ marginTop: "1rem", padding: "10px 24px" }}>
            Start shopping
          </button>
        </div>
      )}

      {/* ── Orders list ── */}
      {!loading && !error && orders.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {orders.map(order => {
            const statusStyle = STATUS_STYLES[order.status] ?? STATUS_STYLES.PENDING
            return (
              <div
                key={order._id}
                onClick={() => navigate(`/orders/${order._id}`)}
                style={{ border: "1px solid #eee", borderRadius: "10px", padding: "1.25rem", cursor: "pointer", transition: "border-color 0.15s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor = "#aaa"}
                onMouseLeave={e => e.currentTarget.style.borderColor = "#eee"}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                  <div>
                    {/* Order ID — truncated for display */}
                    <p style={{ fontWeight: 600, fontSize: "0.875rem" }}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </p>
                    <p style={{ color: "gray", fontSize: "0.8rem", marginTop: "4px" }}>
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric", month: "long", day: "numeric"
                      })}
                    </p>
                  </div>

                  <span style={{ ...statusStyle, padding: "3px 10px", borderRadius: "20px", fontSize: "0.75rem", fontWeight: 600 }}>
                    {order.status}
                  </span>
                </div>

                <hr style={{ margin: "12px 0" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {/* Show first 2 product names */}
                  <p style={{ fontSize: "0.875rem", color: "#555" }}>
                    {order.items?.slice(0, 2).map(i => i.product?.name).join(", ")}
                    {order.items?.length > 2 && ` +${order.items.length - 2} more`}
                  </p>
                  <p style={{ fontWeight: 700 }}>₹ {order.orderPrice}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* ── Pagination ── */}
      {!loading && !error && totalPages > 1 && (
        <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "2rem" }}>
          <button onClick={() => setPage(p => p - 1)} disabled={page === 1}>← Prev</button>
          <span style={{ padding: "8px 14px" }}>{page} / {totalPages}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>Next →</button>
        </div>
      )}
    </div>
  )
}

export default OrdersPage