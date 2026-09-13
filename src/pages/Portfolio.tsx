import { useState, useEffect } from "react";
import type { CSSProperties } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Header from "../components/Header/Header";
import HeroSection from "../components/HeroSection/HeroSection";
import AboutSection from "../components/AboutSection/AboutSection";
import ServicesSection from "../components/ServicesSection/ServicesSection";
import ProjectsSection from "../components/ProjectsSection/ProjectsSection";
import CareerTimeline from "../components/CareerSection/CareerTimeline";
import EducationSection from "../components/EducationSection/EducationSection";
import TechStackSection from "../components/TechStackSection/TechStackSection";
import TestimonialsSection from "../components/TestimonialsSection/TestimonialsSection";
import ContactSection from "../components/ContactSection/ContactSection";
import Footer from "../components/Footer/Footer";
import { Dock, DockIcon } from "../components/lightswind/dock";
import { SmoothCursor } from "../components/lightswind/smooth-cursor";
import {
  Home,
  User,
  Layers,
  FolderGit2,
  Briefcase,
  GraduationCap,
  Sparkles,
  Mail,
  Shield,
  ChevronUp,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useFirestoreDoc } from "../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../data/initialData";
import { HeroContent } from "../types";

export default function Portfolio() {
  const { data: hero } = useFirestoreDoc<HeroContent>(
    "content",
    "hero",
    initialPortfolioData.hero
  );
  const [showFloatingDock, setShowFloatingDock] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show floating navigation once scrolled down past initial view (~240px)
      if (window.scrollY > 240) {
        setShowFloatingDock(true);
      } else {
        setShowFloatingDock(false);
      }
    };

    // Check initial scroll position (e.g. if loaded mid-page)
    handleScroll();

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.querySelector(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground relative overflow-x-hidden selection:bg-primary/20 selection:text-primary"
      style={{
        "--primary": hero.cardAccentColor || initialPortfolioData.hero.cardAccentColor,
        "--ring": hero.cardAccentColor || initialPortfolioData.hero.cardAccentColor,
        "--icon-accent": hero.cardAccentColor || initialPortfolioData.hero.cardAccentColor,
      } as CSSProperties}
    >
      <SmoothCursor />

      {/* Persistent floating header */}
      <Header />

      {/* Main Content Sections */}
      <main>
        <HeroSection />
        <TechStackSection />
        <AboutSection />
        <ServicesSection />
        <ProjectsSection />
        <CareerTimeline />
        <EducationSection />
        <TestimonialsSection />
        <ContactSection />
      </main>

      <Footer />

      {/* Floating Bottom Quick Dock - Visible only when scrolling down */}
      <AnimatePresence>
        {showFloatingDock && (
          <motion.div
            initial={{ opacity: 0, y: 32, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 hidden sm:block"
          >
            <Dock className="bg-background/85 backdrop-blur-xl border border-foreground/15 px-4 py-2 rounded-full shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
              <DockIcon onClick={() => scrollTo("#hero")} className="hover:text-primary cursor-pointer" title="Home">
                <Home className="w-5 h-5" />
              </DockIcon>
              <DockIcon onClick={() => scrollTo("#about")} className="hover:text-primary cursor-pointer" title="About">
                <User className="w-5 h-5" />
              </DockIcon>
              <DockIcon onClick={() => scrollTo("#services")} className="hover:text-primary cursor-pointer" title="Services">
                <Layers className="w-5 h-5" />
              </DockIcon>
              <DockIcon onClick={() => scrollTo("#projects")} className="hover:text-primary cursor-pointer" title="Projects">
                <FolderGit2 className="w-5 h-5" />
              </DockIcon>
              <DockIcon onClick={() => scrollTo("#career")} className="hover:text-primary cursor-pointer" title="Career">
                <Briefcase className="w-5 h-5" />
              </DockIcon>
              <DockIcon onClick={() => scrollTo("#education")} className="hover:text-primary cursor-pointer" title="Education">
                <GraduationCap className="w-5 h-5" />
              </DockIcon>
              <DockIcon onClick={() => scrollTo("#skills")} className="hover:text-primary cursor-pointer" title="Skills">
                <Sparkles className="w-5 h-5" />
              </DockIcon>
              <DockIcon onClick={() => scrollTo("#contact")} className="hover:text-primary cursor-pointer" title="Contact">
                <Mail className="w-5 h-5" />
              </DockIcon>

              <div className="w-[1px] h-6 bg-border/80 mx-1" />

              {/* Admin CMS Direct Entry */}
              <Link to="/admin" title="Open Admin CMS">
                <DockIcon className="text-primary hover:scale-110 cursor-pointer bg-primary/10 rounded-full p-2">
                  <Shield className="w-5 h-5" />
                </DockIcon>
              </Link>
            </Dock>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Floating Back-to-Top / Quick Nav Button - Also visible only on scroll */}
      <AnimatePresence>
        {showFloatingDock && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 16 }}
            className="fixed bottom-5 right-5 z-40 sm:hidden"
          >
            <button
              onClick={() => scrollTo("#hero")}
              aria-label="Scroll to top"
              className="w-12 h-12 rounded-full bg-primary text-primary-foreground shadow-xl flex items-center justify-center border border-primary/20 active:scale-90 transition-transform"
            >
              <ChevronUp className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
