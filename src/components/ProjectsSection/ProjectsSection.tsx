import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { initialPortfolioData } from "../../data/initialData";
import { ProjectItem } from "../../types";

export const ProjectsSection = () => {
  const { items: projects } = useFirestoreCollection<ProjectItem>("projects", initialPortfolioData.projects);

  return (
    <section id="projects" className="w-full max-w-7xl mx-auto px-6 py-24">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.8 }}
        className="mb-12 md:mb-16"
      >
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4 text-center md:text-left">
          Selected <span className="text-gradient-primary">Works</span>
        </h2>
        <p className="text-muted-foreground text-center md:text-left max-w-2xl text-lg">
          A showcase of complex systems, elegant interfaces, and scalable applications I've engineered.
        </p>
      </motion.div>

      {/* Responsive Compact Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 w-full">
        {projects.map((project, i) => {
          const hasLink = Boolean(project.link && project.link.trim());
          const CardElement = hasLink ? motion.a : motion.div;
          const linkProps = hasLink
            ? {
                href: project.link,
                target: "_blank",
                rel: "noopener noreferrer",
              }
            : {};

          return (
            <CardElement
              key={project.id || i}
              {...linkProps}
              className={`group relative overflow-hidden rounded-3xl block shadow-lg border border-foreground/10 h-[290px] sm:h-[310px] md:h-[330px] hover:border-primary/40 transition-all duration-300 ${
                hasLink ? "cursor-pointer" : "cursor-default"
              }`}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: (i % 6) * 0.08, duration: 0.5 }}
              viewport={{ once: true, amount: 0.1 }}
            >
              {/* Background Image Container */}
              <div className="absolute inset-0 bg-neutral-950">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-80 group-hover:opacity-95 transform-gpu"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none" />
              </div>

              {/* Content Overlay */}
              <div className="absolute inset-0 p-5 sm:p-6 flex flex-col justify-end pointer-events-none">
                <div className="flex items-end justify-between gap-3 translate-y-1 group-hover:translate-y-0 transition-transform duration-300 transform-gpu">
                  <div className="z-10 min-w-0 pr-2">
                    <h3 className="text-lg sm:text-xl font-extrabold text-white mb-1.5 tracking-tight drop-shadow-md line-clamp-1 group-hover:text-primary-foreground">
                      {project.title}
                    </h3>
                    <p className="text-xs sm:text-sm font-medium text-white/80 line-clamp-2 leading-relaxed opacity-90 group-hover:opacity-100 transition-opacity duration-300">
                      {project.subtitle}
                    </p>
                  </div>

                  {/* Action Icon (Only when link is present) */}
                  {hasLink && (
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 group-hover:bg-primary group-hover:border-primary group-hover:text-white transition-all duration-300 rotate-45 group-hover:rotate-0 z-10 shadow-lg">
                      <ArrowUpRight className="w-5 h-5 text-white transition-colors" />
                    </div>
                  )}
                </div>
              </div>
            </CardElement>
          );
        })}
      </div>
    </section>
  );
};

export default ProjectsSection;
