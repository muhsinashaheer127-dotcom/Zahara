import SEO from '../../components/SEO'
import Hero from '../../components/Hero/Hero'
import Features from '../../components/Features/Features'
import Categories from '../../components/Categories/Categories'
import ProductSection from '../../components/ProductSection/ProductSection'
import HowItWorks from '../../components/HowItWorks/HowItWorks'
import WhyChoose from '../../components/WhyChoose/WhyChoose'
import Testimonials from '../../components/Testimonials/Testimonials'
import Gallery from '../../components/Gallery/Gallery'
import FAQ from '../../components/FAQ/FAQ'
import Newsletter from '../../components/Newsletter/Newsletter'
import { useProducts } from '../../context/ProductContext'

const Home = () => {
  const { products } = useProducts()
  const safeProducts = Array.isArray(products) ? products : []

  const featured    = safeProducts.filter((p) => p.isFeatured).slice(0, 4)
  const newArrivals = safeProducts.filter((p) => p.isNewItem || p.isNew).slice(0, 4)
  const bestSellers = safeProducts.filter((p) => p.isBestSeller).slice(0, 4)

  return (
    <>
      <SEO title="Home" description="ZAHARA - Premium luxury jewellery rentals. Rent. Wear. Shine." />
      <Hero />
      <Features />
      <Categories />
      <ProductSection
        title="Featured Collection"
        subtitle="Curated For You"
        products={featured.length ? featured : safeProducts.slice(0, 4)}
        viewAllLink="/collections"
      />
      <ProductSection
        title="New Arrivals"
        subtitle="Latest Jewellery"
        products={newArrivals.length ? newArrivals : safeProducts.slice(0, 4)}
        viewAllLink="/collections?sort=newest"
      />
      <div className="bg-charcoal">
        <ProductSection
          title="Best Sellers"
          subtitle="Most Loved"
          products={bestSellers.length ? bestSellers : safeProducts.slice(0, 4)}
          viewAllLink="/collections?sort=popularity"
        />
      </div>
      <HowItWorks />
      <WhyChoose />
      <Testimonials />
      <Gallery />
      <FAQ limit={4} />
      <Newsletter />
    </>
  )
}

export default Home
