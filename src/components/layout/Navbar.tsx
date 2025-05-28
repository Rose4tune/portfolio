"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const handleNameClick = () => {
    if (pathname === "/") {
      router.push("/about");
    } else {
      router.push("/");
    }
  };

  const isActive = (path: string) => {
    if (path === "/" && pathname === "/about") return true;
    return pathname === path;
  };

  return (
    <nav className="w-full flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="font-bold text-xl">
        {pathname !== "/" && (
          <button
            onClick={handleNameClick}
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Portfolio
          </button>
        )}
      </div>
      <div className="flex gap-4">
        <Link
          href="/"
          className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
            isActive("/") ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          About
        </Link>
        <Link
          href="/blog"
          className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
            isActive("/blog") ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          Blog
        </Link>
        <Link
          href="/projects"
          className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
            isActive("/projects") ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          Projects
        </Link>
        <Link
          href="/repositories"
          className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
            isActive("/repositories") ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          Repositories
        </Link>
        <Link
          href="/cv"
          className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
            isActive("/cv") ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          CV
        </Link>
        <Link
          href="/bookshelf"
          className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
            isActive("/bookshelf") ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          Bookshelf
        </Link>
        <Link
          href="/login"
          className={`hover:text-blue-600 dark:hover:text-blue-400 transition-colors ${
            isActive("/login") ? "text-blue-600 dark:text-blue-400" : ""
          }`}
        >
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
