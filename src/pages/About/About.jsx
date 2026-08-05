import SEO from '../../components/SEO'
import AnimateOnScroll from '../../components/AnimateOnScroll'
import Newsletter from '../../components/Newsletter/Newsletter'

const About = () => (
  <>
    <SEO title="About Us" description="Learn about Zahara - premium luxury jewellery rentals." />
    <div className="section-padding">
      <div className="max-w-4xl mx-auto">
        <AnimateOnScroll className="text-center mb-10 md:mb-16">
          <p className="text-gold tracking-[0.3em] uppercase text-xs md:text-sm mb-3">Our Story</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-6">About Zahara</h1>
          <p className="text-white/60 leading-relaxed text-base md:text-lg">
            Zahara was born from a simple belief: every woman deserves to shine in exquisite jewellery, without the burden of ownership.
          </p>
        </AnimateOnScroll>

        <AnimateOnScroll>
          <div className="relative rounded-2xl overflow-hidden mb-12 luxury-shadow">
            <img
              src="https://res.cloudinary.com/nmrxsjhh/image/upload/f_auto,q_auto/681698900_17869412355611841_1763960844887710419_n_i9ibsp"
              alt="About Zahara"
              className="w-full h-80 object-cover"
              loading="lazy"
            />
          </div>
        </AnimateOnScroll>

        <div className="space-y-8 text-white/70 leading-relaxed">
          <AnimateOnScroll>
            <h2 className="text-2xl font-bold text-gold mb-4">Our Mission</h2>
            <p>
              We curate the finest bridal, temple, and contemporary jewellery collections, making luxury accessible through flexible rental plans. From weddings to festivals, photoshoots to parties — Zahara is your partner in every luminous moment.
            </p>
          </AnimateOnScroll>
          <AnimateOnScroll delay={0.1}>
            <h2 className="text-2xl font-bold text-gold mb-4">What Sets Us Apart</h2>
            <p>
              Every piece is professionally cleaned, fully insured, and quality-checked before delivery. Our concierge team ensures a white-glove experience from browse to return, because you deserve nothing less than perfection.
            </p>
          </AnimateOnScroll>
        </div>
      </div>
    </div>
    <Newsletter />
  </>
)

export default About
