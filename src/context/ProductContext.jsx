import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { productService, categoryService } from '../services/api'
import { PRODUCTS as FALLBACK_PRODUCTS, CATEGORIES as FALLBACK_CATEGORIES } from '../data/products'

const ProductContext = createContext(null)

export const ProductProvider = ({ children }) => {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)

  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      // Load live data from MongoDB via the backend API
      const [apiProducts, apiCategories] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ])

      setProducts(Array.isArray(apiProducts) && apiProducts.length > 0 ? apiProducts : FALLBACK_PRODUCTS)
      setCategories(Array.isArray(apiCategories) && apiCategories.length > 0 ? apiCategories : FALLBACK_CATEGORIES)
    } catch (err) {
      // Backend unavailable — fall back to static local data
      console.warn('[ProductContext] Backend unavailable, using local fallback data:', err.message)
      setProducts(FALLBACK_PRODUCTS)
      setCategories(FALLBACK_CATEGORIES)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const getProductBySlug = useCallback(
    (slugOrId) => {
      if (!slugOrId) return null
      const target = String(slugOrId).toLowerCase()
      return products.find(
        (p) =>
          (p.slug     && String(p.slug).toLowerCase()     === target) ||
          (p.id       && String(p.id).toLowerCase()       === target) ||
          (p.customId && String(p.customId).toLowerCase() === target) ||
          (p._id      && String(p._id).toLowerCase()      === target)
      )
    },
    [products]
  )

  const value = {
    products,
    categories,
    loading,
    getProductBySlug,
    refreshProducts: loadData,
  }

  return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>
}

export const useProducts = () => {
  const context = useContext(ProductContext)
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider')
  }
  return context
}

export default ProductContext
