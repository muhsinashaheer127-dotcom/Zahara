import { FiCheck } from 'react-icons/fi'
import { WHY_CHOOSE } from '../../data/products'
import AnimateOnScroll from '../AnimateOnScroll'

const WhyChoose = () => (
  <section className="section-padding bg-charcoal">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <AnimateOnScroll variant="slideLeft">
          <p className="text-gold tracking-[0.3em] uppercase text-sm mb-3">Our Promise</p>
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Choose Zahara</h2>
          <p className="text-white/60 leading-relaxed mb-8">
            We bring the finest jewellery collections to your doorstep, making luxury accessible for every celebration without the commitment of purchase.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WHY_CHOOSE.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full border border-gold/40 flex items-center justify-center shrink-0">
                  <FiCheck className="text-gold" size={14} />
                </div>
                <span className="text-white/80 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </AnimateOnScroll>

        <AnimateOnScroll variant="slideRight">
          <div className="relative rounded-2xl overflow-hidden luxury-shadow">
            <img
              src="https://res.cloudinary.com/nmrxsjhh/image/upload/f_auto,q_auto/681698900_17869412355611841_1763960844887710419_n_i9ibsp"
              alt="Luxury jewellery"
              className="w-full h-[280px] sm:h-[400px] md:h-[500px] object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 sm:bottom-8 sm:left-8 sm:right-8">
              <p className="text-gold text-xs sm:text-sm tracking-widest uppercase mb-1.5 sm:mb-2">Since 2025</p>
              <p className="text-lg sm:text-2xl font-[family-name:var(--font-heading)] font-bold">Trusted by 500+ Happy Clients</p>
            </div>
          </div>
        </AnimateOnScroll>
      </div>
    </div>
  </section>
)

export default WhyChoose