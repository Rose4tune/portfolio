"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";

const navItems = [
  { name: "Blog", path: "/blog" },
<<<<<<< HEAD
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/" },
  // { name: "Repositories", path: "/repositories" },
  // { name: "Memoir", path: "/memoir" },
=======
  // { name: "Projects", path: "/projects" },
  // { name: "Resume", path: "/resume" },
  // { name: "Repositories", path: "/repositories" },
>>>>>>> 2f3e534 (refactor: nav)
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-sm z-50 fixed top-0 left-0 w-full">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between py-3 sm:py-1">
          <div className="flex items-center">
            {pathname !== "/" && (
              <Link
                href="/"
                className="text-xl font-bold text-gray-900 dark:text-white transition-colors duration-200 hover:text-purple-600"
              >
                YeSeo LEE
              </Link>
            )}
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {navItems.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                  (item.path === "/blog" && pathname.startsWith("/blog")) ||
                  (item.path === "/projects" &&
                    pathname.startsWith("/projects")) ||
                  pathname === item.path
                    ? "text-purple-400 dark:text-purple-300"
                    : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-300"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center rounded-md text-gray-700 dark:text-gray-300 hover:text-purple-400 dark:hover:text-purple-300 focus:outline-none transition-colors duration-200"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {isOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`${
          isOpen ? "block" : "hidden"
        } md:hidden fixed top-16 inset-x-0 bg-white dark:bg-gray-900 shadow-lg z-40`}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navItems.map((item) => (
            <Link
              key={item.path}
              href={item.path}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors duration-200 ${
                (item.path === "/blog" && pathname.startsWith("/blog")) ||
                (item.path === "/projects" &&
                  pathname.startsWith("/projects")) ||
                pathname === item.path
                  ? "text-purple-400 dark:text-purple-300 bg-gray-50 dark:bg-gray-800"
                  : "text-gray-700 dark:text-gray-300 hover:text-purple-400 dark:hover:text-purple-300 hover:bg-gray-50 dark:hover:bg-gray-800"
              }`}
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
}
