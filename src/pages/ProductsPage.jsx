import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import ProductCard from "../components/ProductCard"
import Pagination from "../components/Pagination"
import useProducts from "../hooks/useProducts"
import useCart from "../hooks/useCart"
import { getCategories } from "../api/categories"

function ProductsPage() {
  const [page, setPage]             = useState(1)
  const [search, setSearch]         = useState("")
  const [categoryId, setCategoryId] = useState("")
  const [categories, setCategories] = useState([])

  // Load cart on mount so isInCart works correctly on every ProductCard
  useCart()

  // Fetch categories once for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await getCategories()
        setCategories(data.data.data ?? [])
      } catch (err) {
        console.error("Could not load categories", err)
      }
    }
    fetchCategories()
  }, [])

  const { products, loading, error, totalPages, totalItems } =
    useProducts(page, search, categoryId)

  const handleCategoryChange = (id) => { setCategoryId(id); setPage(1) }
  const handleSearchChange   = (val) => { setSearch(val);   setPage(1) }

  return (
    <div>
      <header>
        <h1>Products</h1>
        <p>Browse and add items to your cart</p>
      </header>

      <main>
        {/* ── Filters ── */}
        <div style={{ display: "flex", gap: "12px", marginBottom: "1.5rem", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{ padding: "8px 12px", flex: 1, minWidth: "200px" }}
          />

          <select
            value={categoryId}
            onChange={(e) => handleCategoryChange(e.target.value)}
            style={{ padding: "8px 12px" }}
          >
            <option value="">All categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* Clear filters button — only shows when a filter is active */}
          {(search || categoryId) && (
            <button onClick={() => { setSearch(""); setCategoryId(""); setPage(1) }}>
              Clear filters
            </button>
          )}
        </div>

        {/* ── Result count ── */}
        {!loading && !error && (
          <p style={{ marginBottom: "1rem", fontSize: "0.85rem", color: "gray" }}>
            {totalItems} product{totalItems !== 1 ? "s" : ""} found
            {categoryId && ` in ${categories.find(c => c._id === categoryId)?.name}`}
            {search && ` matching "${search}"`}
          </p>
        )}

        {/* ── Loading ── */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} style={{ border: "1px solid #eee", borderRadius: "10px", padding: "20px", height: "320px", background: "#f5f5f5" }} />
            ))}
          </div>
        )}

        {/* ── Error ── */}
        {error && !loading && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {/* ── Empty state ── */}
        {!loading && !error && products.length === 0 && (
          <p>No products found {search && `for "${search}"`}</p>
        )}

        {/* ── Product grid ── */}
        {!loading && !error && products.length > 0 && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1rem" }}>
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !error && products.length > 0 && (
          <Pagination
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        )}
      </main>
    </div>
  )
}

export default ProductsPage