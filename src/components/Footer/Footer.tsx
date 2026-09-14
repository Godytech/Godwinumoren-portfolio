import { Github, Linkedin, Twitter, Mail } from "lucide-react";
import { MorphingText } from "../lightswind/morphing-text";
import { useFirestoreDoc } from "../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../data/initialData";
import { ContactContent, FooterContent } from "../../types";

export const Footer = () => {
  const { data: footer } = useFirestoreDoc<FooterContent>(
    "content",
    "footer",
    initialPortfolioData.footer
  );
  const { data: contact } = useFirestoreDoc<ContactContent>(
    "content",
    "contact",
    initialPortfolioData.contact
  );
  const morphingTexts = footer.animatedTexts?.filter((text) => text.trim()) || [];

  const socialLinks = [
    { icon: Twitter, href: contact.twitter || "https://twitter.com", label: "Twitter" },
    { icon: Github, href: contact.github || "https://github.com", label: "GitHub" },
    { icon: Linkedin, href: contact.linkedin || "https://linkedin.com", label: "LinkedIn" },
    { icon: Mail, href: `mailto:${contact.email || "hello@scarlettrose.dev"}`, label: "Email" },
  ];

  return (
    <footer className="w-full relative z-10 pt-16 pb-28 md:pb-36 bg-card/60 backdrop-blur-2xl border-t border-black/5 dark:border-white/10 shadow-2xl rounded-t-[3rem] overflow-hidden">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-primary/10 blur-[140px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-12 relative z-10 flex flex-col gap-10">
        {/* Center Banner: Morphing Text */}
        <div className="py-12 px-6 rounded-3xl bg-black/[0.015] dark:bg-white/[0.02] border border-black/5 dark:border-white/10 text-center flex flex-col items-center justify-center my-2 shadow-xs">
          <span className="text-xs font-extrabold uppercase tracking-widest text-primary mb-3 bg-primary/10 px-4 py-1.5 rounded-full border border-primary/20 shadow-xs">
            {footer.bannerLabel}
          </span>

          <MorphingText
            texts={morphingTexts.length > 0 ? morphingTexts : initialPortfolioData.footer.animatedTexts}
            morphTime={1.6}
            cooldownTime={0.8}
            className="text-3xl md:text-5xl lg:text-6xl text-foreground font-extrabold min-h-[70px] text-center"
          />
        </div>

        {/* Social Media Links */}
        <div className="py-6 border-t border-black/5 dark:border-white/10 flex items-center justify-center gap-4">
          {socialLinks.map((social, i) => {
            const Icon = social.icon;
            return (
            <a
              key={i}
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.label}
              className="w-11 h-11 rounded-full glass-panel border border-black/5 dark:border-white/10 flex items-center justify-center text-foreground hover:text-primary hover:border-primary/40 hover:scale-110 transition-all shadow-xs"
            >
              <Icon className="w-5 h-5" />
            </a>
            );
          })}
        </div>

        {/* Bottom Row */}
        <div className="pt-6 border-t border-black/5 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5 font-medium text-center md:text-right">
            <span>© 2026 Godwin Umoren. Built by Godytech</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
