import { Link } from 'react-router-dom'
import { CATEGORIES } from '../../data/products'
import AnimateOnScroll from '../AnimateOnScroll'
import LazyImage from '../LazyImage'

const Categories = ({ showTitle = true }) => (
  <section id="categories" className="section-padding">
    <div className="max-w-7xl mx-auto">
      {showTitle && (
        <AnimateOnScroll className="text-center mb-14">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-3">Browse By Style</p>
          <h2 className="text-3xl md:text-4xl font-bold">Shop By Category</h2>
        </AnimateOnScroll>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
        {CATEGORIES.map((cat, i) => (
          <AnimateOnScroll key={cat.id} delay={i * 0.05}>
            <Link
              to={`/collections?category=${cat.slug}`}
              className="group flex flex-col items-center text-center"
            >
              <div className="relative w-24 h-24 xs:w-28 xs:h-28 sm:w-36 sm:h-36 md:w-40 md:h-40 rounded-full overflow-hidden border-2 border-gold/30 group-hover:border-gold transition-all duration-500 group-hover:scale-105 luxury-shadow">
                <LazyImage
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
              </div>
              <h3 className="mt-3 sm:mt-4 text-xs sm:text-sm md:text-base font-medium text-white/90 group-hover:text-gold transition-colors">
                {cat.name}
              </h3>
            </Link>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  </section>
)

export default Categories
