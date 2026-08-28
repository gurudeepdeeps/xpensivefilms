import { useState, useEffect, useRef } from "react";
import { Share2, User, Mail, MessageSquare, Send, FileText } from "lucide-react";
import SocialLinks from "../components/SocialLinks";
import Komentar from "../components/Commentar";
import Swal from "sweetalert2";
import AOS from "aos";
import "aos/dist/aos.css";
import ResumePDF from '../assets/XpensiveMedia-Brochure.pdf';

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
    setIsSubmitting(true);

    Swal.fire({
      title: 'Sending Message...',
      html: 'Connecting to Xpensive Films Direct Nodemailer SMTP Server...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    try {
      // Call Direct Nodemailer Serverless API Endpoint (/api/contact)
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: formData.message,
          type: "portfolio_contact"
        }),
      });

      let resData = {};
      try { resData = await res.json(); } catch(e) {}

      if (!res.ok || (resData.success === false)) {
        throw new Error(resData.message || "SMTP handler error while attempting to send email.");
      }

      // Show success message
      Swal.fire({
        title: 'Message Sent Successfully!',
        text: 'Your inquiry has been delivered via Nodemailer SMTP to xpensivefilms.co@gmail.com. We will get back to you shortly!',
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
      console.error("Direct Nodemailer SMTP Error:", error);
      Swal.fire({
        title: 'SMTP Delivery Note',
        text: 'Your message could not be dispatched automatically. Please contact us directly at xpensivefilms.co@gmail.com or via WhatsApp (+91 6363770057).',
        icon: 'warning',
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
        className="h-auto py-10 flex items-center justify-center px-[5%] md:px-0"
        id="Contact"
      >
        <div className="container px-[1%] grid grid-cols-1 sm:grid-cols-1 md:grid-cols-1 lg:grid-cols-[45%_55%] 2xl:grid-cols-[35%_65%] gap-12">
          <div
            data-aos="fade-right"
            data-aos-duration="1200"
            className="bg-white/5 backdrop-blur-xl rounded-3xl shadow-2xl p-5 py-10 sm:p-10 transform transition-all duration-300 hover:shadow-[#6366f1]/10"
          >
            <div className="flex justify-between items-start mb-8">
              <div>
                <h2 className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-[#6366f1] to-[#a855f7]">
                  Get in Touch
                </h2>
                <p className="text-gray-400">
                  Have something to discuss? Send us a message and let's talk.
                </p>
              </div>
              <Share2 className="w-10 h-10 text-[#6366f1] opacity-50" />
            </div>

            <form 
              ref={formRef}
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              <div
                data-aos="fade-up"
                data-aos-delay="100"
                className="relative group"
              >
                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="200"
                className="relative group"
              >
                <Mail className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 disabled:opacity-50"
                  required
                />
              </div>
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="relative group"
              >
                <MessageSquare className="absolute left-4 top-4 w-5 h-5 text-gray-400 group-focus-within:text-[#6366f1] transition-colors" />
                <textarea
                  name="message"
                  placeholder="Your Message"
                  value={formData.message}
                  onChange={handleChange}
                  disabled={isSubmitting}
                  className="w-full resize-none p-4 pl-12 bg-white/10 rounded-xl border border-white/20 placeholder-gray-500 text-white focus:outline-none focus:ring-2 focus:ring-[#6366f1]/30 transition-all duration-300 hover:border-[#6366f1]/30 h-[9.9rem] disabled:opacity-50"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#6366f1] to-[#a855f7] text-white font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg shadow-purple-600/30 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
                <span>{isSubmitting ? "Sending via Nodemailer SMTP..." : "Send Message"}</span>
              </button>
            </form>
          </div>

          <div className="space-y-6">
            <SocialLinks />
            <Komentar />
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactPage;
