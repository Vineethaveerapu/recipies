"use client";

import Link from "next/link";
import { navItems } from "@/data/navItems";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="mt-4 w-full rounded-2xl border border-slate-200 bg-white/90 px-4 py-3 shadow-sm backdrop-blur dark:border-slate-800 dark:bg-slate-900/80">
      <ul className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
        {navItems.map((item) => {
          const isActive = pathname === item.link;

          return (
            <li key={item.link}>
              <Link
                href={item.link}
                className={`relative inline-flex items-center justify-center rounded-full px-4 py-2 text-xs font-semibold transition focus:outline-none focus:ring-2 focus:ring-red-700/50 sm:px-5 sm:text-sm ${
                  isActive
                    ? "bg-red-700 text-white shadow-md shadow-red-700/20"
                    : "text-slate-700 hover:bg-red-50/80 hover:text-red-700 dark:text-slate-200 dark:hover:bg-red-700/10 dark:hover:text-red-300"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
