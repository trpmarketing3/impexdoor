import Link from "next/link";
import Image from "next/image";
import { contactConfig } from "../../config/contact";

export default function Footer() {
  return (
    <footer className="bg-[#1a237e] text-white py-12 md:py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Section - Three Columns */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 mb-8 md:mb-12">
          {/* About Company */}
          <div>
            <Image
              src="/images/logo1.png"
              alt="IMPEX DOOR LLP"
              width={400}
              height={80}
              className="h-12 md:h-16 w-auto"
              priority
            />
            <p className="text-gray-300 text-sm leading-relaxed mb-6">
             Since 2005 for the last 20 year our buyers data platform has been working with companies small and large to grow their business worldwide
         We are one of the leading our buyers data platform providing trade solution to exports and imports worldwide we provide a trading platform to connect buyers with suppliers
            </p>
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors"
              >
                <span className="text-white font-bold text-lg">f</span>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-black rounded-full flex items-center justify-center hover:bg-cyan-600 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-white"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M18.244 2H21.5l-7.19 8.21L22 22h-6.828l-5.35-6.99L3.5 22H.244l7.68-8.77L2 2h6.828l4.86 6.38L18.244 2zm-1.2 18h1.885L7.03 4h-2L17.044 20z" />
                </svg>
              </a>

              <a
                href="#"
                className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors"
              >
                <svg
                  className="w-6 h-6 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-gradient-to-tr from-purple-600 via-pink-600 to-orange-400 rounded-full flex items-center justify-center hover:opacity-90 transition-opacity"
              >
                <svg
                  className="w-5 h-5 text-white"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h4 className="font-bold text-lg md:text-xl mb-6">Useful Links</h4>
            <ul className="space-y-3">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-[#00bcd4] transition-colors flex items-center text-sm"
                >
                  <span className="mr-2">&gt;</span> FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/testimonial"
                  className="text-gray-300 hover:text-[#00bcd4] transition-colors flex items-center text-sm"
                >
                  <span className="mr-2">&gt;</span> Testimonial
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-bold text-lg md:text-xl mb-6">Contact Info</h4>
            <div className="space-y-6">
              {/* Head Office */}
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#00bcd4] mr-3 mt-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                </svg>
                <div>
                  <p className="font-semibold text-[#00bcd4] mb-1">
                    HEAD OFFICE
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {contactConfig.address.street}, {contactConfig.address.city}
                    , {contactConfig.address.state} {contactConfig.address.zip},{" "}
                    {contactConfig.address.country}
                  </p>
                </div>
              </div>
              {/* Phone */}
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#00bcd4] mr-3 mt-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" />
                </svg>
                <div>
                  <p className="font-semibold text-[#00bcd4] mb-1">PHONE</p>
                  <p className="text-gray-300 text-sm">
                    <a
                      href={`tel:${contactConfig.phone.formatted}`}
                      className="hover:text-[#00bcd4] transition-colors"
                    >
                      {contactConfig.phone.display}
                    </a>
                  </p>
                </div>
              </div>
              {/* Email */}
              <div className="flex items-start">
                <svg
                  className="w-6 h-6 text-[#00bcd4] mr-3 mt-1 flex-shrink-0"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
                </svg>
                <div>
                  <p className="font-semibold text-[#00bcd4] mb-1">EMAIL</p>
                  <p className="text-gray-300 text-sm">
                    <a
                      href={`mailto:${contactConfig.email.primary}`}
                      className="hover:text-[#00bcd4] transition-colors"
                    >
                      {contactConfig.email.primary}
                    </a>
                  </p>
    
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Bar */}
        <div className="border-t border-gray-600 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs md:text-sm text-gray-400">
            <p className="text-center md:text-left">
              © ISO CERTIFIED COMPANY: IMPEX DOOR LLP IS ISO 9001-2015 CERTIFIED
            </p>
            <div className="flex gap-4">
              <Link
                href="/terms"
                className="hover:text-[#00bcd4] transition-colors"
              >
                Terms & Condition
              </Link>
              <span>/</span>
              <Link
                href="/privacy"
                className="hover:text-[#00bcd4] transition-colors"
              >
                Privacy Policy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

