import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

// ...existing code...

const SocialFloat = () => (
  <div className="social-float" style={{position: 'fixed', right: 16, bottom: 24, display: 'flex', flexDirection: 'column', gap: 12, zIndex: 999}}>
    <a
      href="https://wa.me/916363770057?text=Hello%20Xpensive%20Films%2C%20I%20would%20like%20to%20make%20an%20enquiry."
      target="_blank"
      rel="noreferrer"
      className="float-btn whatsapp-btn inline-flex items-center justify-center text-white bg-green-600 hover:bg-green-700 w-11 h-11 rounded-full shadow-lg"
      title="Chat on WhatsApp"
      aria-label="Chat on WhatsApp"
    >
      <FaWhatsapp size={18} />
    </a>
    <a
      href="https://instagram.com/_x.films"
      target="_blank"
      rel="noreferrer"
      className="float-btn instagram-btn inline-flex items-center justify-center text-white bg-pink-600 hover:bg-pink-700 w-11 h-11 rounded-full shadow-lg"
      title="Follow on Instagram"
      aria-label="Follow on Instagram"
    >
      <FaInstagram size={18} />
    </a>
  </div>
);

export default SocialFloat;
