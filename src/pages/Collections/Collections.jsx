import { useState, useMemo, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import SEO from '../../components/SEO'
import FilterBar from '../../components/FilterBar/FilterBar'
import ProductCard from '../../components/ProductCard/ProductCard'
import Categories from '../../components/Categories/Categories'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import { PRODUCTS } from '../../data/products'
import { filterProducts } from '../../utils/helpers'
import { useDebounce } from '../../hooks/useLocalStorage'

const Collections = () => {
  const [searchParams] = useSearchParams()
  const [mobileFilters, setMobileFilters] = useState(false)
  const [filters, setFilters] = useState({
    search: '',
    category: searchParams.get('category') || 'all',
    occasion: 'all',
    priceRange: 'all',
    sortBy: searchParams.get('sort') || 'newest',
  })

  const debouncedSearch = useDebounce(filters.search)

  useEffect(() => {
    const cat = searchParams.get('category')
    const sort = searchParams.get('sort')
    if (cat) setFilters((f) => ({ ...f, category: cat }))
    if (sort) setFilters((f) => ({ ...f, sortBy: sort }))
  }, [searchParams])

  const filteredProducts = useMemo(
    () => filterProducts(PRODUCTS, { ...filters, search: debouncedSearch }),
    [filters, debouncedSearch]
  )

  return (
    <>
      <SEO title="Collections" description="Browse our premium jewellery rental collections." />
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          <AnimateOnScroll className="text-center mb-8 md:mb-12">
            <p className="text-gold tracking-[0.3em] uppercase text-xs md:text-sm mb-3">Our Collection</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Luxury Collections</h1>
            <p className="text-white/60 text-sm md:text-base max-w-2xl mx-auto">
              Discover handpicked pieces for every occasion. Filter by category, occasion, or price to find your perfect match.
            </p>
          </AnimateOnScroll>

          <FilterBar
            filters={filters}
            onChange={setFilters}
            mobileOpen={mobileFilters}
            onToggleMobile={() => setMobileFilters(!mobileFilters)}
          />

          <p className="text-white/50 text-sm mb-6">{filteredProducts.length} pieces found</p>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map((product, i) => (
                <AnimateOnScroll key={product.id} delay={i * 0.03}>
                  <ProductCard product={product} />
                </AnimateOnScroll>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 glass-card rounded-2xl">
              <p className="text-white/60 text-lg">No products match your filters.</p>
              <button
                type="button"
                onClick={() => setFilters({ search: '', category: 'all', occasion: 'all', priceRange: 'all', sortBy: 'newest' })}
                className="mt-4 text-gold hover:underline touch-target mx-auto"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>
      <Categories showTitle={false} />
    </>
  )
}

export default Collections
