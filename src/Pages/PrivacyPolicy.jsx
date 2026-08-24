import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#030014] text-white py-16 px-6 relative">
      <SEO
        title="Privacy Policy | Xpensive Films"
        description="Privacy Policy for Xpensive Films detailing our information collection practices, data usage, and user rights."
      />

      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <ShieldCheck className="w-10 h-10 text-purple-500" />
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            Privacy Policy
          </h1>
        </div>

        <p className="text-gray-400 text-sm mb-10">Last updated: August 24, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed text-sm sm:text-base border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Information We Collect</h2>
            <p>
              At <strong>Xpensive Films</strong>, we collect personal information that you voluntarily provide to us when submitting inquiries through our contact forms or communicating with our team. This may include your name, email address, phone number, and project details.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. How We Use Your Information</h2>
            <p>
              We use the collected information solely to:
            </p>
            <ul className="list-disc pl-6 space-y-1 text-gray-400">
              <li>Respond to inquiries and process client requests.</li>
              <li>Provide, manage, and improve our video production & digital marketing services.</li>
              <li>Communicate updates, project proposals, and service announcements.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Data Protection & Security</h2>
            <p>
              We implement industry-standard administrative and technical security measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Third-Party Services & Cookies</h2>
            <p>
              Our website may utilize essential cookies and third-party analytics services to analyze website traffic and optimize performance. We do not sell, rent, or trade user data to third parties.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Contact Us</h2>
            <p>
              If you have any questions or concerns regarding this Privacy Policy, please contact us at:
            </p>
            <p className="text-purple-400 font-medium">xpensivefilms.co@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
