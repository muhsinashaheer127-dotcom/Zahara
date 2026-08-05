import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectFade, Pagination } from 'swiper/modules'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { HERO_SLIDES } from '../../data/products'
import LazyImage from '../LazyImage'
import 'swiper/css'
import 'swiper/css/effect-fade'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

const Hero = () => (
  <section className="relative h-[100dvh] min-h-[500px] sm:min-h-[600px] w-full overflow-hidden">
    <Swiper
      modules={[Autoplay, EffectFade, Pagination]}
      effect="fade"
      speed={1200}
      autoplay={{
        delay: 30000, // Video duration
        disableOnInteraction: false,
        pauseOnMouseEnter: true,
      }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="h-full w-full"
    >
      {HERO_SLIDES.map((slide, i) => (
        <SwiperSlide key={i}>
          <div className="relative h-full w-full overflow-hidden">

            {slide.type === "video" ? (
              <div className="absolute inset-0">

                {/* Desktop Video - Intact desktop orientation & scaling */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-auto h-full object-cover md:min-w-full md:min-h-full md:h-auto md:w-auto md:rotate-[270deg]"
                >
                  <source src="/videos/hero-desktop.mp4" type="video/mp4" />
                </video>

                {/* Mobile Video - Full cover background for <768px */}
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="block md:hidden absolute inset-0 w-full h-full object-cover"
                >
                  <source src="/videos/hero-mobile.mp4" type="video/mp4" />
                </video>

              </div>
            ) : (
              <LazyImage
                src={slide.image}
                alt={slide.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/40" />

          </div>
        </SwiperSlide>
      ))}
    </Swiper>

    {/* Content Overlay Container:
        - Mobile (<768px): Uses `pt-16 md:pt-0` to offset fixed top navbar and lift text higher for optimal vertical centering.
        - Desktop (md+): Preserves exact `items-center` vertical alignment.
    */}
    <div className="absolute inset-0 flex items-center z-10 pointer-events-none pt-16 md:pt-0">
      {/* Horizontal Container Padding:
          - Mobile (<768px): `px-5` provides generous breathing room from left edge.
          - Desktop (sm+): Retains `sm:px-6 lg:px-8`.
      */}
      <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 w-full pointer-events-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl"
        >
          {/* Collection Label:
              - Mobile (<768px): `text-[11px]` with `mb-2` for crisp, compact spacing above headline.
              - Desktop (sm+): Retains `sm:text-sm mb-4`.
          */}
          <p className="text-gold tracking-[0.3em] uppercase text-[11px] sm:text-sm mb-2 sm:mb-4">
            ZAHARA Collections
          </p>

          {/* Headline Typography:
              - Mobile (<768px): `text-[1.85rem]` (29.6px) with `leading-[1.2]` and `mb-3` to prevent awkward line breaks and keep total lines under 3.
              - Line break is hidden on mobile (`hidden sm:block`) so words flow naturally on small screens while maintaining exact desktop line break.
              - Desktop (sm+): Retains `sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-6`.
          */}
          <h1 className="text-[1.85rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.2] sm:leading-tight mb-3 sm:mb-6">
            Luxury Jewellery{' '}
            <br className="hidden sm:block" />
            <span className="gold-text-gradient">For Every Occasion</span>
          </h1>

          {/* Paragraph Text:
              - Mobile (<768px): `max-w-[88%]` (88% width) prevents edge-to-edge overflow; `text-xs sm:text-base` with `leading-relaxed` and `mb-5` ensures supreme readability.
              - Desktop (md+): Retains `md:text-lg mb-8 max-w-lg`.
          */}
          <p className="text-white/80 text-xs sm:text-base md:text-lg leading-relaxed mb-5 sm:mb-8 max-w-[88%] sm:max-w-lg">
            Premium jewellery rentals for weddings, engagements, parties, festivals, and photoshoots.
          </p>

          {/* CTA Button:
              - Mobile (<768px): `px-5 py-3 text-xs` with `min-h-[44px]` touch target, slightly narrower and refined for mobile while remaining prominent.
              - Desktop (sm+): Retains `sm:px-8 sm:py-4 sm:text-base`.
          */}
          <div className="flex flex-wrap gap-4">
            <Link
              to="/collections"
              className="px-5 py-3 sm:px-8 sm:py-4 text-xs sm:text-base min-h-[44px] inline-flex items-center justify-center gold-gradient text-black font-semibold rounded-full hover:scale-105 transition-transform luxury-shadow"
            >
              Explore Collection
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  </section>
)

export default Hero