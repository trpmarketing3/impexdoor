"use client";

import Image from "next/image";
import Header from "../components/Header";
import Navigation from "../components/Navigation";
import { contactConfig } from "../../config/contact";
import Footer from "../components/Footer";
import { FormEvent, useState } from "react";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      contact: String(formData.get("contact") ?? "").trim(),
      subject: String(formData.get("subject") ?? "").trim(),
      message: String(formData.get("message") ?? "").trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setError("Please fill in your name, email, and message.");
      setSuccess(null);
      return;
    }

    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/contact-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result?.message ?? "Something went wrong. Please try again.");
        return;
      }

      setSuccess(result?.message ?? "Thanks for reaching out!");
      form.reset();
    } catch (submitError) {
      setError("Network error. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Navigation />

      {/* Hero Section with Image */}
      <section className="relative h-64 md:h-96 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=1600&q=80"
          alt="Contact Us"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-purple-900/80"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
              Contact Us
            </h1>
            <p className="text-lg md:text-xl">
              Get in touch with IMPEX DOOR LLP
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12">
            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-xl p-6 md:p-8 border border-gray-200">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                Request a Call Back
              </h2>
              <div className="w-20 h-1 bg-[#00bcd4] mb-8"></div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="grid gap-4">
                  <div>
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] border border-gray-300"
                    />
                  </div>
                  <div>
                    <input
                      type="email"
                      name="email"
                      placeholder="Email"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] border border-gray-300"
                    />
                  </div>
                </div>
                <div className="grid gap-4">
                  <div>
                    <input
                      type="tel"
                      name="contact"
                      placeholder="Phone"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] border border-gray-300"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] border border-gray-300"
                    />
                  </div>
                </div>
                {/* <div>
                  <textarea
                    placeholder="Message"
                    name="message"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#00bcd4] resize-none border border-gray-300"
                  ></textarea>
                </div> */}
                {error ? (
                  <p className="rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-sm font-medium text-red-600">
                    {error}
                  </p>
                ) : null}
                {success ? (
                  <p className="rounded-lg border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-600">
                    {success}
                  </p>
                ) : null}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Submitting..." : "Submit Now"}
                </button>
              </form>
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 md:p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">
                  Get in Touch
                </h3>
                <div className="space-y-6">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Address
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {contactConfig.address.street},<br />
                        {contactConfig.address.city},{" "}
                        {contactConfig.address.state}{" "}
                        {contactConfig.address.zip},<br />
                        {contactConfig.address.country}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Phone
                      </h4>
                      <a
                        href={`tel:${contactConfig.phone.formatted}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {contactConfig.phone.display}
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <div className="ml-4">
                      <h4 className="font-semibold text-gray-800 mb-1">
                        Email
                      </h4>
                      <a
                        href={`mailto:${contactConfig.email.primary}`}
                        className="text-blue-600 hover:underline text-sm block"
                      >
                        {contactConfig.email.primary}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Image */}
              <div className="relative h-48 md:h-64 rounded-xl overflow-hidden shadow-xl">
                <Image
                  src="https://images.unsplash.com/photo-1556761175-4b46a572b786?w=800&q=80"
                  alt="Contact"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-12 md:mt-16">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Find Us
            </h2>
            <div className="rounded-xl overflow-hidden shadow-xl border border-gray-200">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3749.7679207294373!2d73.7772481737637!3d19.976260023097282!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bddeb53e40e0789%3A0xdc33a8caa97b74ec!2sIMPEX%20DOOR!5e0!3m2!1sen!2sin!4v1773738901682!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
