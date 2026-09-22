import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { productService, categoryService } from '../services/api'

const ProductContext = createContext(null)

export const ProductProvider = ({ children }) => {
  const [products,   setProducts]   = useState([])
  const [categories, setCategories] = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState(null)

  const loadData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      // Load live data from MongoDB via the backend API
      const [apiProducts, apiCategories] = await Promise.all([
        productService.getAll(),
        categoryService.getAll(),
      ])

      setProducts(Array.isArray(apiProducts) ? apiProducts : [])
      setCategories(Array.isArray(apiCategories) ? apiCategories : [])
    } catch (err) {
      console.error('[ProductContext] Failed to load data from backend:', err.message)
      setError(err.message || 'Unable to load products from server. Please ensure the backend and MongoDB are running.')
      setProducts([])
      setCategories([])
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
    error,
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
