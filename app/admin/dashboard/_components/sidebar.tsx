"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail, Users } from "lucide-react";
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

  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-white shadow-sm lg:block">
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
  );
}


