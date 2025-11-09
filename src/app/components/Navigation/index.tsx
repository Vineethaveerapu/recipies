"use client";

import Link from "next/link";
import { navItems } from "@/data/navItems";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <>
      <nav className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between p-6 bg-gray-200 shadow-lg">
        <ul className="flex flex-wrap items-center gap-4 lg:gap-10">
          {navItems.map((item) => {
            return (
              <li key={item.link}>
                <Link
                  href={item.link}
                  className={`relative inline-block text-black font-medium text-lg tracking-wide transition-colors duration-200 hover:text-red-500 focus:text-red-500
    after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-0 after:h-0.5 after:bg-red-500
    after:transition-all after:duration-400 after:ease-out
    hover:after:w-full
    focus:after:w-full
    ${pathname === item.link ? "after:w-full" : ""}`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
