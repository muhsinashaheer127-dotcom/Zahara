import { FaWhatsapp } from 'react-icons/fa'

const WhatsAppButton = () => (
  <a
    href="https://wa.me/919876543210?text=Hi%20Zahara,%20I%20need%20help%20with%20jewellery%20rental"
    target="_blank"
    rel="noopener noreferrer"
    className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-[#25D366] text-white shadow-xl hover:scale-110 transition-transform animate-bounce"
    aria-label="Chat on WhatsApp"
    style={{ animationDuration: '2s' }}
  >
    <FaWhatsapp size={16} />
  </a>
)

export default WhatsAppButton
