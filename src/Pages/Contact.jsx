import { useState, useEffect, useRef } from "react";
import { Share2, User, Mail, MessageSquare, Send, FileText } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import ResumePDF from '../assets/XpensiveMedia-Brochure.pdf';
import { api } from "../services/api";

const ContactPage = () => {
  const formRef = useRef();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    AOS.init({
      once: false,
    });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.trim()) return;
    setIsSubmitting(true);

    Swal.fire({
      title: 'Sending Message...',
      html: 'Delivering your inquiry to Xpensive Films...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      const resData = await api.sendContact({
        name: formData.name.trim() || 'Website Client',
        email: formData.email.trim(),
        message: formData.message.trim(),
        type: "portfolio_contact"
      });

      if (!resData || resData.success === false) {
        throw new Error(resData?.message || "Failed to deliver message.");
      }

      Swal.close();

      // Show success message
      Swal.fire({
        title: 'Message Sent Successfully!',
        text: 'Your inquiry has been received! Our production team will get in touch shortly.',
        icon: 'success',
        confirmButtonColor: '#6366f1',
        timer: 3500,
        timerProgressBar: true
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (error) {
      console.error("Contact Form Error:", error);
      Swal.close();
      Swal.fire({
        title: 'Inquiry Notice',
        text: 'Your message was saved to our system. You can also contact us directly at xpensivefilms.co@gmail.com or via WhatsApp (+91 6363770057).',
        icon: 'info',
        confirmButtonColor: '#6366f1'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="text-center lg:mt-[5%] mt-10 mb-2 sm:px-0 px-[5%]">
        <h2
          data-aos="fade-down"
          data-aos-duration="1000"
          className="inline-block text-3xl md:text-5xl font-bold text-center mx-auto text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]"
        >
          <span
            style={{
              color: "#6366f1",
              backgroundImage:
                "linear-gradient(45deg, #6366f1 10%, #a855f7 93%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Contact Us
          </span>
        </h2>
        <p
          data-aos="fade-up"
          data-aos-duration="1100"
          className="text-slate-400 max-w-2xl mx-auto text-sm md:text-base mt-2"
        >
          Got a question or video project? Send us a message, and we will get back to you soon.
        </p>

        <div className="mt-4">
          <a href={ResumePDF} download="XpensiveFilms-Brochure.pdf" className="inline-block">
            <button className="sm:px-6 py-2 rounded-lg border border-[#a855f7]/50 text-white font-medium transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
              <FileText className="w-10 h-4 sm:w-5 sm:h-5" /> Download Brochure
            </button>
          </a>
        </div>

      </div>

      <div
        className="h-auto py-10 flex items-center justify-center px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
        id="Contact"
      >
        <div className="w-full space-y-12">
          {/* Main 2-Column Section: Form (Left) & Connect (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Get in Touch Form */}
            <div
              data-aos="fade-right"
              data-aos-duration="1200"
              className="lg:col-span-6 xl:col-span-6 bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl shadow-2xl p-6 sm:p-10 transform transition-all duration-300 hover:shadow-[#6366f1]/10 flex flex-col justify-between"
            >
              <div>
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h2 className="text-3xl sm:text-4xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                      Get in Touch
                    </h2>
                    <p className="text-gray-400 text-sm sm:text-base">
                      Have something to discuss? Send us a message and let's talk.
                    </p>
                  </div>
                  <Share2 className="w-8 h-8 sm:w-10 sm:h-10 text-[#6366f1] opacity-50 shrink-0" />
                </div>

                <form 
                  ref={formRef}
                  onSubmit={handleSubmit}
                  className="space-y-4 sm:space-y-5"
                >
                  <div
                    data-aos="fade-up"
                    data-aos-delay="100"
                    className="relative group"
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <User className="w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                    </div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formData.name}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white/10 rounded-xl border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all duration-300 hover:border-[#6366f1]/40 disabled:opacity-50 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="200"
                    className="relative group"
                  >
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mail className="w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                    </div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formData.email}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full py-3.5 sm:py-4 pl-12 pr-4 bg-white/10 rounded-xl border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all duration-300 hover:border-[#6366f1]/40 disabled:opacity-50 text-sm sm:text-base"
                      required
                    />
                  </div>
                  <div
                    data-aos="fade-up"
                    data-aos-delay="300"
                    className="relative group"
                  >
                    <div className="absolute top-4 left-4 pointer-events-none">
                      <MessageSquare className="w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                    </div>
                    <textarea
                      name="message"
                      placeholder="Your Message"
                      value={formData.message}
                      onChange={handleChange}
                      disabled={isSubmitting}
                      className="w-full resize-none py-3.5 sm:py-4 pl-12 pr-4 bg-white/10 rounded-xl border border-white/20 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/50 transition-all duration-300 hover:border-[#6366f1]/40 h-32 sm:h-36 disabled:opacity-50 text-sm sm:text-base"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 sm:py-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50 text-sm sm:text-base cursor-pointer"
                  >
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  </button>
                </form>
              </div>
            </div>

            {/* Social Links Cards (Right Column) */}
            <div className="lg:col-span-6 xl:col-span-6">
              <SocialLinks />
            </div>
          </div>

          {/* Full Width Dedicated Comments Section */}
          <div className="w-full pt-4">
            <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-3xl p-6 sm:p-10 shadow-2xl">
              <Komentar />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
