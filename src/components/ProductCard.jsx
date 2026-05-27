// receives the full product object — no fetching inside
function ProductCard({ product }) {
  const { addToCart, removeFromCart, isInCart, actionLoading } = useCart()
  const inCart = isInCart(product._id)

  return (
    <div style={{ border: "1px solid gray", padding: "20px", borderRadius: "10px" }}>
      <img
        src={product?.mainImage?.url}
        alt={product?.name}
        style={{ width: "100%", height: "200px", objectFit: "cover" }}
      />
      <h2>{product?.name}</h2>
      <h3>₹ {product?.price}</h3>
      <button
        onClick={() => inCart ? removeFromCart(product._id) : addToCart(product._id)}
        disabled={actionLoading === product._id}
      >
        {actionLoading === product._id
          ? "Loading..."
          : inCart ? "Remove from cart" : "Add to cart"}
      </button>
    </div>
  )
}
export default ProductCard