import { motion } from "framer-motion";
import { Code2, Palette, Cpu, Layers } from "lucide-react";
import { MagicCard } from "../lightswind/magic-card";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { useFirestoreDoc } from "../../hooks/useFirestoreDoc";
import { initialPortfolioData } from "../../data/initialData";
import { HeroContent, ServiceItem } from "../../types";

const getServiceIcon = (icon: string) => {
  switch (icon?.toLowerCase()) {
    case "palette":
      return Palette;
    case "cpu":
      return Cpu;
    case "layers":
      return Layers;
    case "code2":
    default:
      return Code2;
  }
};

export const ServicesSection = () => {
  const { items: services } = useFirestoreCollection<ServiceItem>("services", initialPortfolioData.services);
  const { data: hero } = useFirestoreDoc<HeroContent>("content", "hero", initialPortfolioData.hero);
  const accentColor = hero.cardAccentColor || initialPortfolioData.hero.cardAccentColor || "#8b5cf6";

  return (
    <section id="services" className="max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="mb-16 text-center"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-gradient-primary">
          What I Do
        </h2>
        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
          Delivering comprehensive digital solutions that cover the entire lifecycle of professional product engineering.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, i) => {
          const Icon = getServiceIcon(service.icon);
          return (
            <motion.div
              key={service.id || i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              <MagicCard
                className="h-full p-8 rounded-[2rem] border border-border/80 bg-card/80"
                gradientSize={280}
                gradientColor="color-mix(in srgb, var(--primary) 12%, transparent)"
                gradientFrom="var(--primary)"
                gradientTo="var(--primary)"
              >
                <div className="flex flex-col h-full justify-between gap-6">
                  <div>
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-xs group-hover:scale-110 transition-all duration-300"
                      style={{
                        backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                        border: `1px solid color-mix(in srgb, ${accentColor} 25%, transparent)`,
                        color: accentColor,
                      }}
                    >
                      <Icon className="w-7 h-7" style={{ color: accentColor }} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-foreground tracking-tight">
                      {service.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {service.description}
                    </p>
                  </div>
                </div>
              </MagicCard>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default ServicesSection;
