import { useCallback, useEffect, useState } from "react";
import { getProductById } from "../api/products";

function ProductCard({ id }) {
  const [product, setProduct] = useState({});
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchProduct = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } = await getProductById(id);

      setProduct(data.data);
    } catch (error) {
      setError(error.message || "Could not load product");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  if (loading) {
    return <h2>Loading...</h2>;
  }

  if (error) {
    return <h2>{error}</h2>;
  }

  return (
    <div
      style={{
        border: "1px solid gray",
        padding: "20px",
        borderRadius: "10px",
        width: "300px",
      }}
    >
      <img
        src={product?.mainImage?.url}
        alt={product?.name}
        style={{
          width: "100%",
          height: "200px",
          objectFit: "cover",
        }}
      />

      <h2>{product?.name}</h2>

      <h3>₹ {product?.price}</h3>

      <button>Add to Cart</button>
    </div>
  );
}

export default ProductCard;