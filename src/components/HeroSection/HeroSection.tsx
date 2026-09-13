import { motion } from "framer-motion";
import type { CSSProperties } from "react";
import { ArrowRight, Download, Github, Linkedin, Mail, Twitter } from "lucide-react";
import TechStackSection from "../TechStackSection/TechStackSection";
import { Button } from "../lightswind/button";
import { Badge } from "../lightswind/badge";
import { HangingIdCard } from "../lightswind/HangingIdCard";
import { AuroraTextEffect } from "../lightswind/aurora-text-effect";
import { DotPattern } from "../lightswind/dot-pattern";
import { useFirestoreDoc } from "../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../data/initialData";
import { HeroContent } from "../../types";

export const HeroSection = () => {
  const { data: hero } = useFirestoreDoc<HeroContent>("content", "hero", initialPortfolioData.hero);

  return (
    <section
      id="hero"
      className="relative min-h-[100vh] flex flex-col pt-24 md:pt-28 overflow-hidden bg-background"
      style={{
        backgroundImage: `radial-gradient(circle at 18% 42%, color-mix(in srgb, ${hero.cardAccentColor || "#8b5cf6"} 14%, transparent) 0%, transparent 42%)`,
      }}
    >
      <DotPattern width={18} height={18} cx={1} cy={1} cr={1} glow />

      <div className="relative z-10 max-w-7xl mx-auto px-6 w-full flex-1 flex flex-col md:flex-row items-center justify-center gap-12 md:gap-20 pb-12">
        {/* Left Content */}
        <motion.div
          className="flex-1 flex flex-col items-center md:items-start text-center md:text-left pt-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {hero.availableForWork && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="mb-6"
            >
              <Badge variant="outline" size="lg" className="gap-2.5 py-1.5 px-4 glass-panel border-foreground/10">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                <span className="text-xs font-medium text-muted-foreground">Available for work</span>
              </Badge>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="mb-4 text-center md:text-left"
          >
            <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight mb-2">
              {hero.headline}
            </h1>

            {/* Dynamic Two-Color Animated Name (Admin Configurable) */}
            <div className="relative inline-block">
              <span
                className="animated-two-color-name font-extrabold text-[clamp(2.8rem,6.5vw,5.5rem)] leading-none tracking-tight block pb-2 select-none"
                style={{
                  "--name-accent": hero.cardAccentColor || "#8b5cf6",
                } as CSSProperties}
              >
                {hero.name}
              </span>
            </div>
          </motion.div>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-xl mb-8 leading-relaxed w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            {hero.subheadline}
          </motion.p>

          <motion.div
            className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-10 w-full md:w-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <a href={hero.ctaLink}>
              <Button size="lg" className="rounded-full px-7 h-12 bg-primary text-primary-foreground dark:text-black font-semibold flex items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_color-mix(in_srgb,var(--primary)_30%,transparent)] hover:shadow-[0_0_30px_color-mix(in_srgb,var(--primary)_50%,transparent)] hover:-translate-y-1">
                {hero.ctaText} <ArrowRight className="w-4 h-4" />
              </Button>
            </a>
            {hero.resumeUrl && (
              <a href={hero.resumeUrl} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="rounded-full px-7 h-12 glass-panel text-foreground font-semibold flex items-center gap-2 hover:bg-foreground/10 transition-all hover:-translate-y-1 border-foreground/10">
                  Resume <Download className="w-4 h-4" />
                </Button>
              </a>
            )}
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex items-center gap-5 justify-center md:justify-start w-full md:w-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors hover:-translate-y-1 transform duration-200" aria-label="Twitter">
              <Twitter className="w-5 h-5" />
            </a>
            <a href="https://github.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors hover:-translate-y-1 transform duration-200" aria-label="GitHub">
              <Github className="w-5 h-5" />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="text-muted-foreground hover:text-foreground transition-colors hover:-translate-y-1 transform duration-200" aria-label="LinkedIn">
              <Linkedin className="w-5 h-5" />
            </a>
            <a href="mailto:hello@scarlettrose.dev" className="text-muted-foreground hover:text-foreground transition-colors hover:-translate-y-1 transform duration-200" aria-label="Email">
              <Mail className="w-5 h-5" />
            </a>
          </motion.div>
        </motion.div>

        {/* Right Content: Hanging ID Card with Animated Reactive Aura */}
        <motion.div
          className="flex-1 w-full max-w-md relative flex justify-center items-center py-2"
          initial={{ opacity: 0, y: -20, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ delay: 0.4, duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Animated Background Aura Behind Hanging Card */}
          <div
            className="absolute -inset-10 -z-10 rounded-[45%] blur-3xl opacity-35 dark:opacity-40 ambient-aura-glow pointer-events-none transition-all duration-700 ease-out"
            style={{
              background: `radial-gradient(circle at 50% 50%, ${hero.cardAccentColor || "#8b5cf6"} 0%, ${hero.cardHeaderGradientStart || "#6b21a8"} 45%, ${hero.cardAvatarGlowColor || "#38bdf8"} 70%, transparent 85%)`,
            }}
          />
          {/* Secondary rotating accent ring */}
          <div
            className="absolute -inset-4 -z-10 rounded-full blur-2xl opacity-25 dark:opacity-30 pointer-events-none transition-all duration-700 ease-out animate-pulse"
            style={{
              background: `radial-gradient(circle at 60% 40%, ${hero.cardAvatarGlowColor || "#38bdf8"} 0%, ${hero.cardAccentColor || "#8b5cf6"} 50%, transparent 75%)`,
            }}
          />

          <HangingIdCard
            name={hero.cardName || hero.name}
            role={hero.role}
            badgeId={hero.badgeId}
            accentColor={hero.cardAccentColor || "#8b5cf6"}
            ropeLength={75}
            ropeColor={hero.cardRopeColor || "#27272a"}
            cardWidth="w-72 sm:w-80 md:w-84"
          >
            <div className="flex flex-col h-full bg-card w-full">
              <div
                className="relative px-5 pt-7 pb-6 flex flex-col items-center text-white overflow-hidden transition-all duration-300"
                style={{
                  background: `linear-gradient(135deg, ${hero.cardHeaderGradientStart || "#6b21a8"}, ${hero.cardHeaderGradientVia || "#7c3aed"}, ${hero.cardHeaderGradientEnd || "#1e1b4b"})`,
                }}
              >
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:12px_12px] pointer-events-none" />

                <div
                  className="mt-1 relative w-28 h-28 rounded-full p-1 backdrop-blur-md shadow-2xl border border-white/50 overflow-hidden group transition-all duration-300"
                  style={{
                    background: `linear-gradient(135deg, ${hero.cardAvatarGlowColor || "#38bdf8"}, ${hero.cardAccentColor || "#8b5cf6"}, ${hero.cardHeaderGradientStart || "#6b21a8"})`,
                  }}
                >
                  <img
                    src={hero.avatarUrl}
                    alt={hero.cardName || hero.name}
                    className="w-full h-full object-cover rounded-full filter contrast-105"
                    loading="eager"
                  />
                  <div className="absolute bottom-1 right-2 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white shadow-md" />
                </div>
              </div>

              <div className="p-5 flex flex-col items-center text-center bg-card text-card-foreground flex-1 gap-3">
                <div>
                  <h3 className="text-xl font-extrabold tracking-tight text-foreground">
                    {hero.cardName || hero.name}
                  </h3>
                  <div
                    className="inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full text-xs font-semibold transition-colors duration-300"
                    style={{
                      backgroundColor: hero.cardBadgeBgColor || "rgba(139, 92, 246, 0.12)",
                      borderColor: hero.cardAccentColor ? `${hero.cardAccentColor}40` : "rgba(139, 92, 246, 0.3)",
                      borderWidth: "1px",
                      color: hero.cardAccentColor || "#8b5cf6",
                    }}
                  >
                    <span>{hero.role}</span>
                  </div>
                </div>

                <div className="w-full border-t border-border/60 my-0.5" />

                <div className="grid grid-cols-2 gap-2.5 w-full text-left bg-muted/40 p-3 rounded-xl border border-border/50">
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-widest font-bold">Specialty</span>
                    <span className="font-bold text-foreground text-xs">{hero.specialty}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-widest font-bold">Location</span>
                    <span className="font-bold text-foreground text-xs">{hero.location}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-widest font-bold">Experience</span>
                    <span className="font-bold text-foreground text-xs">{hero.experienceYears}</span>
                  </div>
                  <div>
                    <span className="text-muted-foreground block text-[9px] uppercase tracking-widest font-bold">Status</span>
                    <span className="font-bold text-emerald-500 text-xs flex items-center gap-1">
                      ● Active
                    </span>
                  </div>
                </div>

                <div className="flex flex-col items-center mt-1 w-full gap-1">
                  <div className="flex gap-[2.5px] items-end h-7 px-3 py-0.5 bg-white/90 dark:bg-black/40 rounded-lg border border-border/40 w-full justify-center">
                    {Array.from({ length: 36 }).map((_, i) => (
                      <div
                        key={i}
                        className="bg-foreground rounded-[1px]"
                        style={{
                          width: i % 4 === 0 ? "3.5px" : i % 2 === 0 ? "2px" : "1px",
                          height: `${50 + Math.sin(i * 1.4) * 45}%`,
                        }}
                      />
                    ))}
                  </div>
                  <div className="flex items-center justify-between w-full px-1 text-[10px]">
                    <span
                      className="font-mono font-bold tracking-widest transition-colors duration-300"
                      style={{ color: hero.cardAccentColor || "#8b5cf6" }}
                    >
                      {hero.badgeId}
                    </span>
                    <span className="text-muted-foreground font-semibold text-[9px] uppercase tracking-wider">
                      ACTIVE VERIFIED
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </HangingIdCard>
        </motion.div>
      </div>

      <div className="w-full relative z-10 mt-auto">
        <TechStackSection />
      </div>
    </section>
  );
};

export default HeroSection;
