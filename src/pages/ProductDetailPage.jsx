// src/pages/ProductDetailPage.jsx
// This is the ONE place where fetching inside a component using getProductById is correct — because we only have the :id from the URL, not the full object.
// 

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { getProductById } from "../api/products"
import useCart from "../hooks/useCart"

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const { addToCart, removeFromCart, isInCart, actionLoading } = useCart()
  const inCart = product ? isInCart(product._id) : false

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      setError(null)
      try {
        const { data } = await getProductById(id)
        setProduct(data.data)
      } catch (err) {
        setError(err.response?.data?.message || "Could not load product")
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [id])

  if (loading) return <p>Loading product...</p>
  if (error)   return <p style={{ color: "red" }}>{error}</p>
  if (!product) return null

  return (
    <div className="max-w-225 mx-auto p-8">
      <button onClick={() => navigate(-1)} className="mb-6">
        ← Back
      </button>

      <div className="flex gap-8 flex-wrap">
        {/* ── Image ── */}
        <img
          src={product.mainImage?.url}
          alt={product.name}
          className="w-90 h-90 object-cover rounded-3xl border border-[#eee]"
        />

        {/* ── Info ── */}
        <div className="flex-1 min-w-6.5">
          <p className="text-[0.8rem] text-gray-600 mb-1.5">
            {product.category?.name}
          </p>

          <h1 className="text-[1.75rem] font-bold mb-2">
            {product.name}
          </h1>

          <p style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "1rem" }}>
            ₹ {product.price}
          </p>

          <p style={{ color: "#555", lineHeight: 1.6, marginBottom: "1.5rem" }}>
            {product.description}
          </p>

          {/* Stock status */}
          <p style={{ marginBottom: "1.25rem", fontSize: "0.875rem" }}>
            {product.stock > 0
              ? <span style={{ color: "green" }}>✓ In stock ({product.stock} left)</span>
              : <span style={{ color: "red" }}>✗ Out of stock</span>
            }
          </p>

          <button
            onClick={() => inCart ? removeFromCart(product._id) : addToCart(product._id)}
            disabled={actionLoading === product._id || product.stock === 0}
            style={{ padding: "12px 28px", fontSize: "1rem", cursor: "pointer" }}
          >
            {actionLoading === product._id
              ? "Loading..."
              : inCart ? "Remove from cart" : "Add to cart"}
          </button>
        </div>
      </div>

      {/* ── Sub images ── */}
      {product.subImages?.length > 0 && (
        <div style={{ marginTop: "2rem" }}>
          <h2 style={{ marginBottom: "1rem", fontSize: "1rem", color: "gray" }}>More images</h2>
          <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
            {product.subImages.map((img, i) => (
              <img
                key={i}
                src={img.url}
                alt={`${product.name} ${i + 1}`}
                style={{ width: "120px", height: "120px", objectFit: "cover", borderRadius: "8px", border: "1px solid #eee" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetailPage