"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { Mail, Users, Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  {
    href: "/admin/dashboard/contact-leads",
    label: "Contact Leads",
    icon: Mail,
  },
  {
    href: "/admin/dashboard/buyers-data",
    label: "Buyers Data",
    icon: Users,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname]);

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileOpen(!isMobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-white border border-slate-200 shadow-sm text-slate-700 hover:bg-slate-50"
        aria-label="Toggle menu"
      >
        {isMobileOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Menu className="h-6 w-6" />
        )}
      </button>

      {/* Mobile overlay */}
      {isMobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-40 w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm transform transition-transform duration-300 ease-in-out lg:transform-none",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-16 items-center border-b border-slate-200 px-6">
          <span className="text-lg font-semibold tracking-wide text-slate-900">
            Impexdoor Admin
          </span>
        </div>

        <nav className="mt-6 space-y-1 px-4">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname?.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-slate-900 text-white shadow-sm"
                    : "text-slate-600 hover:bg-slate-100"
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 text-slate-400 transition group-hover:text-slate-700",
                    isActive && "text-white"
                  )}
                />
                {label}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}


