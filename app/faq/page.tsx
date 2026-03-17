import Header from "../components/Header";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";
import { contactConfig } from "../../config/contact";

export default function FAQ() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Navigation />

      {/* Content */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 md:py-20 max-w-4xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Frequently Asked Questions
        </h1>
        
        <div className="space-y-6 md:space-y-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
              What services does IMPEX DOOR LLP provide?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We provide comprehensive export and import solutions including trade facilitation, documentation, logistics coordination, and market connection services. We help suppliers, manufacturers, and traders expand their business globally.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
              How can I contact your support team?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You can reach us via phone at {contactConfig.phone.display}, email at {contactConfig.email.primary}, or use our contact form. Our team is available to assist you 24/7.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
              Where is your head office located?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Our head office is located at: IMPEX DOOR LLP, 4/803, Velachery - Tambaram Main Rd, Medavakkam, Chennai, Tamil Nadu 600100, India.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
              What countries do you operate in?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We have a global network spanning multiple continents. We facilitate trade with countries across Asia, Middle East, Africa, Europe, and the Americas. Check our latest buyers section to see our current international partnerships.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
              How long does the export process typically take?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              The timeline depends on various factors including product type, destination country, and documentation requirements. Generally, we aim to complete the process within 7-14 business days, but this can vary based on specific circumstances.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-800">
              Do you provide custom solutions for specific business needs?
            </h2>
            <p className="text-gray-600 leading-relaxed">
              Yes, we offer customized trade solutions tailored to your specific business requirements. Our experienced team works closely with clients to understand their needs and provide personalized service packages.
            </p>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

