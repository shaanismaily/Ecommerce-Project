import { useCallback, useEffect, useMemo, useState } from "react";
import { getProducts, getProductsByCategory } from "../api/products";

const LIMIT = 9

function useProducts(page, categoryId='', search='') {
    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [totalPages, setTotalPages] = useState(1)
    const [totalProducts, setTotalProducts] = useState(0)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)

    const fetchAllProducts = useCallback(async() => {
        setLoading(true)
        setError(null)
        try {
            const { data } = await getProducts(page, LIMIT)
            setProducts(data.data.products)
            setTotalPages(data.data.totalPages)
            setTotalProducts(data.data.totalProducts)
            setAllProducts([])

        } catch (error) {
            setError(error.response?.data?.message || "Could not load products")

        } finally {
            setLoading(false)
        }
    }, [page])

    const fetchByCategory = useCallback(async() => {
        setLoading(true)
        setError(null)

        try {
            const { data } = await getProductsByCategory(categoryId)
            setAllProducts(data.data.products)
            setProducts([])
        } catch (error) {
            setError(error.response?.data?.message || "Could not load products")
        } finally {
            setLoading(false)
        }
    }, [categoryId])
    
    useEffect(() => {
        if (categoryId) {
            fetchByCategory()
        } else {
            fetchAllProducts()
        }
    }, [categoryId, fetchByCategory, fetchAllProducts])

    const filteredByCategoryAndSearch = useMemo(() => {
        if (!categoryId) return []

        return allProducts.filter(p => 
            !search || p.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [categoryId, allProducts, search])

    const categoryTotalPages = Math.ceil(filteredByCategoryAndSearch.length / LIMIT)
    const paginatedCategoryProducts = filteredByCategoryAndSearch.slice((page-1) * LIMIT, page * LIMIT)

    const filteredPageProducts = useMemo(() => {
        if (categoryId) return []

        return products.filter(p => 
            !search || p.name.toLowerCase().includes(search.toLowerCase())
        )
    }, [search, categoryId, products])

    return {
        products:   categoryId ? paginatedCategoryProducts : filteredPageProducts,
        loading,
        error,
        totalPages: categoryId ? categoryTotalPages : totalPages,
        totalItems: categoryId ? filteredByCategoryAndSearch.length : totalProducts,
        refetch:    categoryId ? fetchByCategory : fetchAllProducts,
    }
}

export default useProducts