import { Link } from 'react-router-dom'
import { FiMail, FiPhone, FiInstagram, FiFacebook, FiLinkedin, FiMap } from 'react-icons/fi'
import { CATEGORIES } from '../../data/products'

const Footer = () => (
  <footer className="bg-charcoal border-t border-white/5">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        <div>
          <Link to="/" className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Zahara" className="h-12 w-12 rounded-full object-cover" />
            <div>
              <span className="font-[family-name:var(--font-heading)] text-2xl font-bold gold-text-gradient tracking-widest">ZAHARA</span>
              <p className="text-[10px] text-gold/70 tracking-[0.3em] uppercase">Rent. Wear. Shine.</p>
            </div>
          </Link>
          <p className="text-white/50 text-sm leading-relaxed">
            Premium luxury jewellery rentals for every special moment. Experience elegance without compromise.
          </p>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-6 tracking-wider uppercase text-sm">Quick Links</h4>
          <ul className="space-y-3">
            {['Home', 'Collections', 'About', 'Contact', 'FAQ'].map((item) => (
              <li key={item}>
                <Link
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  className="text-white/60 hover:text-gold transition-colors text-sm"
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-6 tracking-wider uppercase text-sm">Categories</h4>
          <ul className="space-y-3">
            {CATEGORIES.slice(0, 6).map((cat) => (
              <li key={cat.id}>
                <Link
                  to={`/collections?category=${cat.slug}`}
                  className="text-white/60 hover:text-gold transition-colors text-sm"
                >
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="text-gold font-semibold mb-6 tracking-wider uppercase text-sm">Contact</h4>
          <ul className="space-y-4">
            <li className="flex items-center gap-3 text-white/60 text-sm">
              <FiMail className="text-gold shrink-0" />
              <span className="break-all">zahararentaljewellery@gmail.com</span>
            </li>
            <li className="flex items-center gap-3 text-white/60 text-sm">
              <FiPhone className="text-gold shrink-0" />
              <span>+91 9747133559</span>
            </li>
          </ul>
          <div className="flex gap-3 sm:gap-4 mt-6">
            {[
              { Icon: FiInstagram, href: 'https://www.instagram.com/zahara_rental_jewellery?igsh=MThqY3Z5cjRxZTMybQ==', label: 'Instagram', target: '_blank', rel: 'noopener noreferrer' },
              { Icon: FiMail, href: 'mailto:zahararentaljewellery@gmail.com', label: 'Email' },
              { Icon: FiPhone, href: 'tel:+919747133559', label: 'Phone' },
              { Icon: FiMap, href: 'https://maps.app.goo.gl/KcXzPHceRU8oFJxSA', label: 'Location', target: '_blank', rel: 'noopener noreferrer' }
            ].map(({ Icon, href, label, target, rel }, i) => (
              <a
                key={i}
                href={href}
                target={target}
                rel={rel}
                className="p-3 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full border border-gold/30 text-gold hover:bg-gold hover:text-black transition-all"
                aria-label={label}
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-white/5 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-white/40 text-sm">&copy; {new Date().getFullYear()} Zahara Rental Jewellery. All Rights Reserved.
          Designed & Developed by PromptLogix.</p>
        <div className="flex gap-6">
        </div>
      </div>
    </div>
  </footer>
)

export default Footer
