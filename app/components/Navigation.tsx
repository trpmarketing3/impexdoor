'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  const navLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About' },
    { href: '/plans', label: 'Our Plans' },
    { href: '/channel', label: 'Videos' },
    { href: '/contact', label: 'Contact' }
  ];

  const solutionsLinks = [
    { href: '/services', label: 'Fruits and Vegetables' },
    { href: '/services', label: 'Readymade Garments' },
    { href: '/services', label: 'Gems and Jewellery' },
    { href: '/services', label: 'Chemical Products' },
    { href: '/services', label: 'Pharmaceutical Products' },
    { href: '/services', label: 'Organic Products' },
    { href: '/services', label: 'Engineering Products' },
    { href: '/services', label: 'Plastic Products' },
    { href: '/services', label: 'Spices Products' },
    { href: '/services', label: 'Textile Products' }
  ];

  // Listen for menu state changes from Header
  useEffect(() => {
    const handleMenuStateChange = (e: Event) => {
      const customEvent = e as CustomEvent;
      setIsOpen(customEvent.detail);
    };

    window.addEventListener('menuStateChange', handleMenuStateChange);
    return () => window.removeEventListener('menuStateChange', handleMenuStateChange);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsOpen(false);
    setSolutionsOpen(false);
    // Notify Header to update its state
    const event = new CustomEvent('menuStateChange', { detail: false });
    window.dispatchEvent(event);
  }, [pathname]);

  // Dispatch menu state changes to Header
  useEffect(() => {
    const event = new CustomEvent('menuStateChange', { detail: isOpen });
    window.dispatchEvent(event);
  }, [isOpen]);

  return (
    <>
      {/* Mobile Side Navigation Overlay */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setIsOpen(false);
          const event = new CustomEvent('menuStateChange', { detail: false });
          window.dispatchEvent(event);
        }}
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/50"></div>
        
        {/* Side Menu */}
        <div
          className={`absolute right-0 top-0 h-full w-64 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${
            isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <span className="text-gray-900 font-bold text-lg">Menu</span>
            <button
              onClick={() => {
                setIsOpen(false);
                const event = new CustomEvent('menuStateChange', { detail: false });
                window.dispatchEvent(event);
              }}
              className="text-gray-900 hover:text-blue-600 transition-colors p-2"
              aria-label="Close menu"
            >
              <svg 
                className="w-6 h-6" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Navigation Links */}
          <div className="p-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setIsOpen(false);
                  const event = new CustomEvent('menuStateChange', { detail: false });
                  window.dispatchEvent(event);
                }}
                className={`block font-semibold transition-all duration-200 text-sm py-3 px-4 rounded-lg ${
                  isActive(link.href)
                    ? 'text-blue-600 bg-blue-50 border-l-4 border-blue-600'
                    : 'text-black hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                {link.label}
              </Link>
            ))}
            
            {/* Solutions Dropdown Mobile */}
            <div>
              <button
                onClick={() => setSolutionsOpen(!solutionsOpen)}
                className={`w-full flex items-center justify-between font-semibold transition-all duration-200 text-sm py-3 px-4 rounded-lg ${
                  solutionsOpen || solutionsLinks.some(link => isActive(link.href))
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-black hover:text-blue-600 hover:bg-gray-50'
                }`}
              >
                Solutions
                <svg 
                  className={`w-4 h-4 transition-transform ${solutionsOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {solutionsOpen && (
                <div className="pl-4 mt-2 space-y-1">
                  {solutionsLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      onClick={() => {
                        setIsOpen(false);
                        setSolutionsOpen(false);
                        const event = new CustomEvent('menuStateChange', { detail: false });
                        window.dispatchEvent(event);
                      }}
                      className="block py-2 px-4 text-sm text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
