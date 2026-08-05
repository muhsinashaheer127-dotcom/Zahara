import { useState } from 'react'
import toast from 'react-hot-toast'
import { FiMail, FiPhone, FiMapPin, FiSend, FiInstagram } from 'react-icons/fi'
import SEO from '../../components/SEO'
import AnimateOnScroll from '../../components/AnimateOnScroll'

const Contact = () => {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

  const handleSubmit = (e) => {
    e.preventDefault()
    toast.success('Message sent! We will get back to you soon.')
    setForm({ name: '', email: '', subject: '', message: '' })
  }

  return (
    <>
      <SEO title="Contact" />
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          <AnimateOnScroll className="text-center mb-10 md:mb-16">
            <p className="text-gold tracking-[0.3em] uppercase text-xs md:text-sm mb-3">Get In Touch</p>
            <h1 className="text-3xl md:text-5xl font-bold mb-4">Contact Us</h1>
            <p className="text-white/60 text-sm md:text-base max-w-xl mx-auto">Have questions? Our concierge team is here to help you find the perfect piece.</p>
          </AnimateOnScroll>

          <div className="grid lg:grid-cols-2 gap-12">
            <AnimateOnScroll variant="slideLeft">
              <div className="space-y-6">
                {[
                  { icon: FiInstagram, label: 'Instagram', value: '@zahara_rental_jewellery', href: 'https://www.instagram.com/zahara_rental_jewellery?igsh=MThqY3Z5cjRxZTMybQ==', external: true },
                  { icon: FiMail, label: 'Email', value: 'zahararentaljewellery@gmail.com', href: 'mailto:zahararentaljewellery@gmail.com' },
                  { icon: FiPhone, label: 'Phone', value: '+91 9747133559', href: 'tel:+919747133559' },
                  { icon: FiMapPin, label: 'Address', value: 'SR building Lalaji junction near H&J mall Karunagappally, Kollam, Kerala', href: 'https://maps.app.goo.gl/KcXzPHceRU8oFJxSA', external: true },
                ].map((item) => (
                  <a
                    key={item.label}
                    href={item.href || '#'}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className="flex items-start gap-4 glass-card rounded-2xl p-6 hover:border-gold/50 transition-all block"
                  >
                    <item.icon className="text-gold shrink-0 mt-1" size={24} />
                    <div>
                      <p className="text-gold text-sm uppercase tracking-wider mb-1">{item.label}</p>
                      <p className="text-white/80">{item.value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </AnimateOnScroll>

            <AnimateOnScroll variant="slideRight">
              <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-6 md:p-8 border border-gold/20 space-y-4">
                {['name', 'email', 'subject'].map((field) => (
                  <input
                    key={field}
                    type={field === 'email' ? 'email' : 'text'}
                    placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required
                    className="w-full px-5 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-gold/50 text-base"
                  />
                ))}
                <textarea
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  required
                  rows={5}
                  className="w-full px-5 py-3.5 bg-black/50 border border-white/10 rounded-xl focus:outline-none focus:border-gold/50 resize-none text-base"
                />
                <button type="submit" className="w-full py-4 gold-gradient text-black font-semibold rounded-xl flex items-center justify-center gap-2 hover:opacity-90">
                  Send Message <FiSend />
                </button>
              </form>
            </AnimateOnScroll>
          </div>
        </div>
      </div>
    </>
  )
}

export default Contact
