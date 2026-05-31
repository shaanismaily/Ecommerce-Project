// Flow:
// 1. Fetch saved addresses on mount
// 2. User selects an address (or adds a new one)
// 3. Click "Place order" → POST /ecommerce/orders { addressId }
// 4. On success → clear cart in Redux → navigate to order detail page

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { getAddresses, addAddress, deleteAddress } from "../api/address"
import { placeOrder } from "../api/orders"
import { clearCart } from "../store/cartSlice"
import { useForm } from "react-hook-form"

function CheckoutPage() {
  const navigate  = useNavigate()
  const dispatch  = useDispatch()

  const { items, totalPrice, totalItems } = useSelector(state => state.cart)

  const [addresses, setAddresses]           = useState([])
  const [selectedAddressId, setSelectedAddressId] = useState(null)
  const [showAddressForm, setShowAddressForm]     = useState(false)
  const [addressLoading, setAddressLoading] = useState(false)
  const [orderLoading, setOrderLoading]     = useState(false)
  const [error, setError]                   = useState(null)

  const { values, handleChange, reset } = useForm({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    country: "",
    pincode: "",
  })

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0) navigate("/cart")
  }, [items, navigate])

  // Fetch saved addresses on mount
  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const { data } = await getAddresses()
        const list = data.data.data ?? []
        setAddresses(list)
        // Auto-select first address if available
        if (list.length > 0) setSelectedAddressId(list[0]._id)
      } catch (err) {
        setError("Could not load addresses")
      }
    }
    fetchAddresses()
  }, [])

  // ── Add new address ──────────────────────────────────────────────────────
  const handleAddAddress = async (e) => {
    e.preventDefault()
    setAddressLoading(true)
    setError(null)
    try {
      const { data } = await addAddress(values)
      const newAddress = data.data
      setAddresses(prev => [...prev, newAddress])
      setSelectedAddressId(newAddress._id)
      setShowAddressForm(false)
      reset()
    } catch (err) {
      setError(err.response?.data?.message || "Could not add address")
    } finally {
      setAddressLoading(false)
    }
  }

  // ── Delete address ───────────────────────────────────────────────────────
  const handleDeleteAddress = async (addressId) => {
    try {
      await deleteAddress(addressId)
      setAddresses(prev => prev.filter(a => a._id !== addressId))
      if (selectedAddressId === addressId) {
        const remaining = addresses.filter(a => a._id !== addressId)
        setSelectedAddressId(remaining[0]?._id ?? null)
      }
    } catch (err) {
      setError("Could not delete address")
    }
  }

  // ── Place order ──────────────────────────────────────────────────────────
  const handlePlaceOrder = async () => {
    if (!selectedAddressId) {
      setError("Please select a delivery address")
      return
    }
    setOrderLoading(true)
    setError(null)
    try {
      const { data } = await placeOrder(selectedAddressId)
      dispatch(clearCart())                          // sync Redux — server cleared cart
      navigate(`/orders/${data.data._id}`)           // go to order confirmation
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order")
    } finally {
      setOrderLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
      <button onClick={() => navigate("/cart")} style={{ marginBottom: "1.5rem" }}>
        ← Back to cart
      </button>

      <h1 style={{ marginBottom: "1.5rem" }}>Checkout</h1>

      {error && (
        <p style={{ color: "red", marginBottom: "1rem", padding: "10px", background: "#fff0f0", borderRadius: "8px" }}>
          {error}
        </p>
      )}

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap", alignItems: "flex-start" }}>
        {/* ── Left: Addresses ── */}
        <div style={{ flex: 1, minWidth: "300px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h2>Delivery address</h2>
            <button onClick={() => setShowAddressForm(v => !v)} style={{ fontSize: "0.875rem" }}>
              {showAddressForm ? "Cancel" : "+ Add new"}
            </button>
          </div>

          {/* Add address form */}
          {showAddressForm && (
            <form onSubmit={handleAddAddress} style={{ border: "1px solid #eee", borderRadius: "10px", padding: "1rem", marginBottom: "1rem", display: "flex", flexDirection: "column", gap: "8px" }}>
              {[
                { name: "addressLine1", placeholder: "Address line 1" },
                { name: "addressLine2", placeholder: "Address line 2 (optional)" },
                { name: "city",         placeholder: "City" },
                { name: "state",        placeholder: "State" },
                { name: "country",      placeholder: "Country" },
                { name: "pincode",      placeholder: "Pincode" },
              ].map(field => (
                <input
                  key={field.name}
                  name={field.name}
                  value={values[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  required={field.name !== "addressLine2"}
                  style={{ padding: "8px 10px", borderRadius: "6px", border: "1px solid #ddd" }}
                />
              ))}
              <button type="submit" disabled={addressLoading} style={{ padding: "10px", marginTop: "4px" }}>
                {addressLoading ? "Saving..." : "Save address"}
              </button>
            </form>
          )}

          {/* Address list */}
          {addresses.length === 0 && !showAddressForm && (
            <p style={{ color: "gray" }}>No saved addresses. Add one above.</p>
          )}

          {addresses.map(address => (
            <div
              key={address._id}
              onClick={() => setSelectedAddressId(address._id)}
              style={{
                padding: "1rem",
                border: `2px solid ${selectedAddressId === address._id ? "#2D5BE3" : "#eee"}`,
                borderRadius: "10px",
                marginBottom: "10px",
                cursor: "pointer",
                background: selectedAddressId === address._id ? "#EBF0FD" : "#fff",
                transition: "all 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div>
                  <p style={{ fontWeight: 500 }}>{address.addressLine1}</p>
                  {address.addressLine2 && <p style={{ fontSize: "0.875rem", color: "gray" }}>{address.addressLine2}</p>}
                  <p style={{ fontSize: "0.875rem", color: "gray" }}>
                    {address.city}, {address.state} — {address.pincode}
                  </p>
                  <p style={{ fontSize: "0.875rem", color: "gray" }}>{address.country}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDeleteAddress(address._id) }}
                  style={{ color: "red", background: "none", border: "none", cursor: "pointer", alignSelf: "flex-start" }}
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* ── Right: Order summary ── */}
        <div style={{ width: "280px", border: "1px solid #eee", borderRadius: "10px", padding: "1.25rem" }}>
          <h2 style={{ marginBottom: "1rem" }}>Order summary</h2>

          {items.map(item => (
            <div key={item.product._id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", fontSize: "0.875rem" }}>
              <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "160px" }}>
                {item.product.name} × {item.quantity}
              </span>
              <span>₹ {item.product.price * item.quantity}</span>
            </div>
          ))}

          <hr style={{ margin: "1rem 0" }} />

          <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, marginBottom: "1.25rem" }}>
            <span>Total</span>
            <span>₹ {totalPrice}</span>
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={orderLoading || !selectedAddressId}
            style={{ width: "100%", padding: "12px", fontSize: "1rem", cursor: "pointer" }}
          >
            {orderLoading ? "Placing order..." : "Place order"}
          </button>

          {!selectedAddressId && (
            <p style={{ fontSize: "0.78rem", color: "gray", marginTop: "8px", textAlign: "center" }}>
              Select a delivery address to continue
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage