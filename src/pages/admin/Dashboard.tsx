import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Shield,
  Layout,
  User,
  Briefcase,
  Layers,
  GraduationCap,
  Sparkles,
  MessageSquare,
  Mail,
  ExternalLink,
  LogOut,
  FolderGit2,
  CheckCircle2,
  Database,
  FileCode,
  Megaphone,
} from "lucide-react";
import { ThemeToggle } from "../../components/lightswind/theme-toggle";
import { useFirestoreDoc } from "../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../data/initialData";
import { HeroContent } from "../../types";

// Section Admin Editors
import { HeroAdmin } from "./sections/HeroAdmin";
import { AboutAdmin } from "./sections/AboutAdmin";
import { ServicesAdmin } from "./sections/ServicesAdmin";
import { ProjectsAdmin } from "./sections/ProjectsAdmin";
import { CareerAdmin } from "./sections/CareerAdmin";
import { EducationAdmin } from "./sections/EducationAdmin";
import { SkillsAdmin } from "./sections/SkillsAdmin";
import { TestimonialsAdmin } from "./sections/TestimonialsAdmin";
import { ContactAdmin } from "./sections/ContactAdmin";
import { PortfolioSourceAdmin } from "./sections/PortfolioSourceAdmin";
import { FooterAdmin } from "./sections/FooterAdmin";

type SectionTab =
  | "hero"
  | "about"
  | "services"
  | "projects"
  | "career"
  | "education"
  | "skills"
  | "testimonials"
  | "contact"
  | "source"
  | "footer";

const navigationTabs = [
  { id: "hero" as SectionTab, label: "Hero & ID Card", icon: User },
  { id: "about" as SectionTab, label: "About & Stats", icon: Layout },
  { id: "services" as SectionTab, label: "Services", icon: Layers },
  { id: "projects" as SectionTab, label: "Projects Grid", icon: FolderGit2 },
  { id: "career" as SectionTab, label: "Career Journey", icon: Briefcase },
  { id: "education" as SectionTab, label: "Education", icon: GraduationCap },
  { id: "skills" as SectionTab, label: "Skills Arsenal", icon: Sparkles },
  { id: "testimonials" as SectionTab, label: "Testimonials", icon: MessageSquare },
  { id: "contact" as SectionTab, label: "Contact Info", icon: Mail },
  { id: "source" as SectionTab, label: "Portfolio Source", icon: FileCode },
  { id: "footer" as SectionTab, label: "Footer Banner", icon: Megaphone },
];

export default function Dashboard() {
  const { currentUser, isFirebaseReady, logout } = useAuth();
  const { data: hero } = useFirestoreDoc<HeroContent>(
    "content",
    "hero",
    initialPortfolioData.hero
  );
  const [activeTab, setActiveTab] = useState<SectionTab>("hero");
  const navigate = useNavigate();
  const displayName = hero.name || initialPortfolioData.hero.name;
  const avatarUrl = hero.avatarUrl || initialPortfolioData.hero.avatarUrl;

  const handleLogout = async () => {
    await logout();
    navigate("/admin/login");
  };

  return (
    <div
      className="min-h-screen bg-background text-foreground flex flex-col"
      style={{
        "--icon-accent": hero.cardAccentColor || initialPortfolioData.hero.cardAccentColor,
      } as React.CSSProperties}
    >
      {/* Top Admin Header */}
      <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl overflow-hidden shadow-sm">
              <img
                src={avatarUrl}
                alt={displayName}
                className="w-full h-full rounded-xl object-cover"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold tracking-tight text-sm text-foreground">
                  Portfolio CMS
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                  Admin
                </span>
              </div>
              <span className="text-[10px] text-muted-foreground hidden sm:block">
                {displayName} Portfolio Studio
              </span>
            </div>
          </div>

          {/* Connection Status & Profile & Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Status indicator badge */}
            <div className="hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-foreground/5 border border-foreground/10 text-muted-foreground">
              <Database className="w-3.5 h-3.5 text-primary" />
              {isFirebaseReady ? (
                <span className="flex items-center gap-1 text-emerald-500 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Firestore Live
                </span>
              ) : (
                <span className="flex items-center gap-1 text-amber-500 font-bold">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  Firebase Authentication Unavailable
                </span>
              )}
            </div>

            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-foreground/15 hover:bg-muted text-xs font-semibold text-foreground transition-colors shadow-xs"
            >
              <span>View Portfolio</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-500 text-xs font-bold transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 flex flex-col md:flex-row gap-6">
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="glass-panel p-3 rounded-2xl border border-foreground/10 sticky top-24 shadow-sm">
            <div className="px-3 py-2 text-xs font-bold text-muted-foreground uppercase tracking-wider">
              Sections
            </div>
            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto pb-1 md:pb-0">
              {navigationTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer text-left ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm shadow-primary/30"
                        : "text-muted-foreground hover:text-foreground hover:bg-foreground/5"
                    }`}
                  >
                    <Icon className="w-4 h-4 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* Quick Admin Helper Box */}
            <div className="hidden md:block mt-6 p-4 rounded-xl bg-foreground/[0.03] border border-border/60 text-xs space-y-2">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <CheckCircle2 className="w-3.5 h-3.5 text-primary" />
                <span>Instant Reactivity</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                Changes saved here reflect immediately on the public portfolio without rebuilding.
              </p>
            </div>
          </div>
        </aside>

        {/* Content Workspace */}
        <main className="flex-1 min-w-0">
          <div className="glass-panel p-6 sm:p-8 rounded-[2rem] border border-foreground/10 shadow-xl bg-card">
            {activeTab === "hero" && <HeroAdmin />}
            {activeTab === "about" && <AboutAdmin />}
            {activeTab === "services" && <ServicesAdmin />}
            {activeTab === "projects" && <ProjectsAdmin />}
            {activeTab === "career" && <CareerAdmin />}
            {activeTab === "education" && <EducationAdmin />}
            {activeTab === "skills" && <SkillsAdmin />}
            {activeTab === "testimonials" && <TestimonialsAdmin />}
            {activeTab === "contact" && <ContactAdmin />}
            {activeTab === "source" && <PortfolioSourceAdmin />}
            {activeTab === "footer" && <FooterAdmin />}
          </div>
        </main>
      </div>
    </div>
  );
}
