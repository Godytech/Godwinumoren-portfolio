

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Menu,
  X,
  Shield,
  Home,
  User,
  Sparkles,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Mail,
  ChevronRight,
  ExternalLink,
} from "lucide-react";
import { Link } from "react-router-dom";
import { ThemeToggle } from "../lightswind/theme-toggle";
import { useFirestoreDoc } from "../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../data/initialData";
import { HeroContent } from "../../types";

const navItems = [
  { name: "Home", href: "#hero", icon: Home, subtitle: "Intro & Overview" },
  { name: "About", href: "#about", icon: User, subtitle: "Bio & Background" },
  { name: "Services", href: "#services", icon: Sparkles, subtitle: "Expertise & Craft" },
  { name: "Projects", href: "#projects", icon: FolderGit2, subtitle: "Featured Work" },
  { name: "Career", href: "#career", icon: Briefcase, subtitle: "Experience Journey" },
  { name: "Education", href: "#education", icon: GraduationCap, subtitle: "Credentials & Skills" },
  { name: "Contact", href: "#contact", icon: Mail, subtitle: "Get in Touch" },
];

export default function Header() {
  const { data: hero } = useFirestoreDoc<HeroContent>(
    "content",
    "hero",
    initialPortfolioData.hero
  );
  const [showHeader, setShowHeader] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const displayName = hero.name || initialPortfolioData.hero.name;
  const avatarUrl = hero.avatarUrl || initialPortfolioData.hero.avatarUrl;

  useEffect(() => {
    let lastScrollY = window.scrollY;
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scrolling when mobile menu drawer is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsMobileMenuOpen(false);
      }
    };
    if (isMobileMenuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobileMenuOpen]);

  const handleScrollTo = (id: string) => {
    setIsMobileMenuOpen(false);
    // Slight delay to allow drawer closing animation before smooth scroll
    setTimeout(() => {
      const target = document.querySelector(id);
      if (target) {
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 200);
  };

  return (
    <>
      <AnimatePresence>
        {showHeader && (
          <motion.header
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0, transition: { duration: 0.3 } }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="fixed top-6 left-0 right-0 z-40 flex justify-center px-4"
          >
            <div className="glass-panel w-full max-w-7xl rounded-[2rem] flex items-center justify-between px-6 py-4 shadow-xl">
              {/* Logo */}
              <a
                onClick={() => handleScrollTo("#hero")}
                className="cursor-pointer font-extrabold text-lg flex items-center gap-3 group select-none"
              >
                <div className="relative w-9 h-9 rounded-xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform duration-300">
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    className="w-full h-full rounded-xl object-cover"
                  />
                </div>
                <div className="flex flex-col text-left">
                  <span className="font-extrabold tracking-tight text-foreground text-sm leading-none group-hover:text-primary transition-colors">
                    {displayName}
                  </span>
                  <span className="text-[9px] font-bold text-muted-foreground tracking-widest uppercase mt-0.5">
                    Portfolio
                  </span>
                </div>
              </a>

              {/* Desktop Navigation */}
              <nav className="hidden md:flex flex-1 justify-center">
                <ul className="flex space-x-7">
                  {navItems.map((item) => (
                    <li key={item.name} className="relative group text-sm font-medium text-muted-foreground transition-colors">
                      <button
                        onClick={() => handleScrollTo(item.href)}
                        className="cursor-pointer hover:text-foreground transition-colors bg-transparent border-none py-1"
                      >
                        {item.name}
                      </button>
                      <span className="absolute -bottom-1 left-1/2 w-0 h-0.5 bg-primary/80 rounded-full transition-all duration-300 group-hover:w-full group-hover:left-0" />
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Actions: Admin CMS & Theme Toggle */}
              <div className="flex items-center gap-3">
                <Link
                  to="/admin"
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-foreground/5 hover:bg-primary/15 text-foreground hover:text-primary border border-foreground/10 hover:border-primary/30 transition-all shadow-xs"
                  title="Open Admin CMS"
                >
                  <Shield className="w-3.5 h-3.5 text-primary" />
                  <span>Admin CMS</span>
                </Link>

                <ThemeToggle />

                {/* Mobile Menu Toggle Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(true)}
                  className="md:hidden p-2 rounded-xl text-foreground hover:text-primary hover:bg-foreground/5 transition-all cursor-pointer border border-foreground/10 active:scale-95"
                  aria-label="Open mobile menu"
                  title="Open Navigation"
                >
                  <Menu size={20} />
                </button>
              </div>
            </div>
          </motion.header>
        )}
      </AnimatePresence>

      {/* Mobile Navigation Left-Slide Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: "easeOut" }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 dark:bg-black/75 backdrop-blur-sm cursor-pointer"
              aria-hidden="true"
            />

            {/* Slide-In Drawer From the Left */}
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="relative z-10 w-[85vw] max-w-[340px] h-full bg-card/95 dark:bg-[#0c0c12]/95 backdrop-blur-2xl border-r border-foreground/15 dark:border-white/10 shadow-2xl flex flex-col justify-between overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation Menu"
            >
              {/* Drawer Top Header */}
              <div className="p-6 border-b border-foreground/10 dark:border-white/10 flex items-center justify-between">
                <a
                  onClick={() => handleScrollTo("#hero")}
                  className="cursor-pointer flex items-center gap-3 select-none"
                >
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shadow-md">
                    <img
                      src={avatarUrl}
                      alt={displayName}
                      className="w-full h-full rounded-xl object-cover"
                    />
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="font-extrabold tracking-tight text-foreground text-sm leading-tight">
                      {displayName}
                    </span>
                    <span className="text-[10px] font-semibold text-muted-foreground tracking-wider uppercase">
                      Portfolio & CMS
                    </span>
                  </div>
                </a>

                {/* Close Button */}
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-9 h-9 rounded-full border border-foreground/15 dark:border-white/10 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-foreground/10 dark:hover:bg-white/10 transition-all cursor-pointer group"
                  aria-label="Close menu"
                >
                  <X size={18} className="group-hover:rotate-90 transition-transform duration-200" />
                </button>
              </div>

              {/* Status Pill Badge */}
              <div className="px-6 pt-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 dark:text-emerald-400 text-xs font-semibold">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span>Available for new projects</span>
                </div>
              </div>

              {/* Navigation Items List */}
              <div className="px-4 py-4 flex-1 overflow-y-auto">
                <p className="px-3 text-[11px] font-bold text-muted-foreground uppercase tracking-widest mb-2">
                  Navigation
                </p>
                <ul className="space-y-1">
                  {navItems.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <motion.li
                        key={item.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.04 + 0.1 }}
                      >
                        <button
                          onClick={() => handleScrollTo(item.href)}
                          className="w-full flex items-center justify-between p-3 rounded-2xl text-left hover:bg-foreground/5 dark:hover:bg-white/5 border border-transparent hover:border-foreground/10 transition-all group cursor-pointer"
                        >
                          <div className="flex items-center gap-3.5">
                            <div className="w-9 h-9 rounded-xl bg-foreground/5 dark:bg-white/5 border border-foreground/10 dark:border-white/10 flex items-center justify-center text-muted-foreground group-hover:text-primary group-hover:border-primary/40 group-hover:bg-primary/10 transition-all">
                              <Icon size={18} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-foreground group-hover:text-primary transition-colors">
                                {item.name}
                              </div>
                              <div className="text-[11px] text-muted-foreground">
                                {item.subtitle}
                              </div>
                            </div>
                          </div>
                          <ChevronRight
                            size={16}
                            className="text-muted-foreground/60 group-hover:text-primary group-hover:translate-x-1 transition-all"
                          />
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>

              {/* Drawer Bottom Footer Actions */}
              <div className="p-5 border-t border-foreground/10 dark:border-white/10 space-y-3 bg-muted/30 dark:bg-white/[0.02]">
                {/* Theme Selector Row */}
                <div className="flex items-center justify-between px-2 py-1">
                  <div className="flex flex-col">
                    <span className="text-xs font-bold text-foreground">Appearance</span>
                    <span className="text-[11px] text-muted-foreground">Toggle Light / Dark theme</span>
                  </div>
                  <ThemeToggle />
                </div>

                {/* Admin CMS Access Button */}
                <Link
                  to="/admin"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-bold shadow-md hover:shadow-primary/20 transition-all active:scale-[0.98]"
                >
                  <Shield size={14} />
                  <span>Admin CMS Dashboard</span>
                  <ExternalLink size={12} className="opacity-80" />
                </Link>

                <div className="text-center pt-1">
                  <p className="text-[10px] text-muted-foreground">
                    © {new Date().getFullYear()} {displayName} · All Rights Reserved
                  </p>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
