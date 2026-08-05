import { GALLERY_IMAGES } from '../../data/products'
import AnimateOnScroll from '../AnimateOnScroll'
import LazyImage from '../LazyImage'

const Gallery = () => (
  <section className="section-padding">
    <div className="max-w-7xl mx-auto">
      <AnimateOnScroll className="text-center mb-14">
        <p className="text-gold tracking-[0.3em] uppercase text-sm mb-3">Gallery</p>
        <h2 className="text-3xl md:text-4xl font-bold">Moments of Brilliance</h2>
      </AnimateOnScroll>

      <div className="columns-1 xs:columns-2 md:columns-3 lg:columns-4 gap-3 sm:gap-4 space-y-3 sm:space-y-4">
        {GALLERY_IMAGES.map((img, i) => (
          <AnimateOnScroll key={i} delay={i * 0.05}>
            <div className="break-inside-avoid group relative rounded-2xl overflow-hidden">
              <LazyImage
                src={img}
                alt="Gallery "
                className={`w-full object-cover group-hover:scale-105 transition-transform duration-700 ${i % 3 === 0 ? 'h-52 sm:h-72' : i % 3 === 1 ? 'h-40 sm:h-56' : 'h-48 sm:h-64'
                  }`}
              />
              <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/10 transition-colors duration-500" />
            </div>
          </AnimateOnScroll>
        ))}
      </div>
    </div>
  </section>
)

export default Gallery