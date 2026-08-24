import React from "react";
import { Link } from "react-router-dom";
import { FileText, ArrowLeft } from "lucide-react";
import SEO from "../components/SEO";

const Terms = () => {
  return (
    <div className="min-h-screen bg-[#030014] text-white py-16 px-6 relative">
      <SEO
        title="Terms & Conditions | Xpensive Films"
        description="Terms and Conditions governing the use of Xpensive Films website and production services."
      />

      <div className="max-w-4xl mx-auto">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="flex items-center gap-4 mb-6">
          <FileText className="w-10 h-10 text-purple-500" />
          <h1 className="text-3xl sm:text-5xl font-extrabold bg-gradient-to-r from-white via-purple-100 to-indigo-200 bg-clip-text text-transparent">
            Terms & Conditions
          </h1>
        </div>

        <p className="text-gray-400 text-sm mb-10">Last updated: August 24, 2026</p>

        <div className="space-y-8 text-gray-300 leading-relaxed text-sm sm:text-base border-t border-white/10 pt-8">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">1. Acceptance of Terms</h2>
            <p>
              By accessing and using the website of <strong>Xpensive Films</strong>, you agree to comply with and be bound by these Terms and Conditions. If you do not agree to these terms, please refrain from using our website.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">2. Intellectual Property Rights</h2>
            <p>
              All content on this website, including video reels, branding assets, logos, design elements, graphics, and text, are the intellectual property of Xpensive Films unless otherwise explicitly noted. Unauthorized reproduction, distribution, or copying is strictly prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">3. Services & Proposals</h2>
            <p>
              Services provided by Xpensive Films (including video production, editing, corporate event coverage, and digital marketing) are subject to individual client agreements and project proposals outlining deliverables, schedules, and fee structures.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">4. Limitation of Liability</h2>
            <p>
              Xpensive Films makes every effort to ensure website availability and content accuracy. However, we shall not be liable for any indirect, incidental, or consequential damages resulting from website use or temporary service disruptions.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-white">5. Governing Law & Contact</h2>
            <p>
              These Terms shall be governed by and construed in accordance with applicable laws. For questions regarding these terms, contact us at:
            </p>
            <p className="text-purple-400 font-medium">xpensivefilms.co@gmail.com</p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Terms;
