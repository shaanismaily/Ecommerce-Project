function CartItem({
  item,
  onIncrease,
  onDecrease,
  onRemove,
  loading,
}) {
  const product = item.product;

  return (
    <div
      style={{
        display: "flex",
        gap: "20px",
        alignItems: "center",
        border: "1px solid #ccc",
        padding: "15px",
        borderRadius: "10px",
        marginBottom: "15px",
      }}
    >
      {/* Product Image */}
      <img
        src={product?.mainImage?.url}
        alt={product?.name}
        style={{
          width: "120px",
          height: "120px",
          objectFit: "cover",
          borderRadius: "10px",
        }}
      />

      {/* Product Details */}
      <div style={{ flex: 1 }}>
        <h2>{product?.name}</h2>

        <h3>₹ {product?.price}</h3>

        {/* Quantity Controls */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginTop: "10px",
          }}
        >
          <button
            onClick={() => onDecrease(product._id)}
            disabled={loading}
          >
            -
          </button>

          <span>{item.quantity}</span>

          <button
            onClick={() => onIncrease(product._id)}
            disabled={loading}
          >
            +
          </button>
        </div>
      </div>

      {/* Remove Button */}
      <button
        onClick={() => onRemove(product._id)}
        disabled={loading}
        style={{
          background: "red",
          color: "white",
          border: "none",
          padding: "10px 15px",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Remove
      </button>
    </div>
  );
}

export default CartItem;