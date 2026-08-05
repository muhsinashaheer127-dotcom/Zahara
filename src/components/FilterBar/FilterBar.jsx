import { FiSearch, FiSliders } from 'react-icons/fi'
import { CATEGORIES, OCCASIONS } from '../../data/products'

const FilterBar = ({ filters, onChange, showMobileToggle, mobileOpen, onToggleMobile }) => (
  <div className="mb-8">
    <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center">
      <div className="relative flex-1">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gold/60" size={18} />
        <input
          type="text"
          placeholder="Search jewellery..."
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          className="w-full pl-12 pr-4 py-3 bg-charcoal border border-white/10 rounded-2xl text-white text-base placeholder:text-white/40 focus:outline-none focus:border-gold/50 transition-colors min-h-[44px]"
        />
      </div>

      <button
        type="button"
        onClick={onToggleMobile}
        className="lg:hidden flex items-center justify-center gap-2 px-4 py-3 min-h-[44px] border border-gold/30 rounded-2xl text-gold text-base font-medium"
      >
        <FiSliders size={18} /> Filters
      </button>

      <div className={`${mobileOpen ? 'flex' : 'hidden'} lg:flex flex-col lg:flex-row gap-3 flex-wrap`}>
        <select
          value={filters.category}
          onChange={(e) => onChange({ ...filters, category: e.target.value })}
          className="px-4 py-3 bg-charcoal border border-white/10 rounded-2xl text-white text-base focus:outline-none focus:border-gold/50 min-h-[44px] w-full lg:w-auto"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>

        <select
          value={filters.occasion}
          onChange={(e) => onChange({ ...filters, occasion: e.target.value })}
          className="px-4 py-3 bg-charcoal border border-white/10 rounded-2xl text-white text-base focus:outline-none focus:border-gold/50 min-h-[44px] w-full lg:w-auto"
        >
          <option value="all">All Occasions</option>
          {OCCASIONS.map((o) => (
            <option key={o} value={o}>{o}</option>
          ))}
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => onChange({ ...filters, sortBy: e.target.value })}
          className="px-4 py-3 bg-charcoal border border-white/10 rounded-2xl text-white text-base focus:outline-none focus:border-gold/50 min-h-[44px] w-full lg:w-auto"
        >
          <option value="newest">Newest</option>
          <option value="price-low">Price: Low to High</option>
          <option value="price-high">Price: High to Low</option>
          <option value="popularity">Popularity</option>
        </select>

        <select
          value={filters.priceRange}
          onChange={(e) => onChange({ ...filters, priceRange: e.target.value })}
          className="px-4 py-3 bg-charcoal border border-white/10 rounded-2xl text-white text-base focus:outline-none focus:border-gold/50 min-h-[44px] w-full lg:w-auto"
        >
          <option value="all">All Prices</option>
          <option value="0-500">₹0 - ₹500</option>
          <option value="500-1000">₹500 - ₹1,000</option>
          <option value="1000-2000">₹1,000 - ₹2,000</option>
          <option value="2000-3000">₹2,000 - ₹3,000</option>
          <option value="3000-5000">₹3,000 - ₹5,000</option>
          <option value="5000+">₹5,000+</option>
        </select>
      </div>
    </div>
  </div>
)

export default FilterBar
