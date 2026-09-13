import { motion, AnimatePresence } from "framer-motion";
import {
  Atom,
  Server,
  Code2,
  Database,
  Cloud,
  Crown,
  Brain,
  Workflow,
  HeartHandshake,
  Lightbulb,
  Users,
  Rocket,
} from "lucide-react";
import { useFirestoreCollection } from "../../hooks/useFirestoreCollection";
import { initialPortfolioData } from "../../data/initialData";
import { SkillItem } from "../../types";

const getSkillIcon = (name: string) => {
  switch (name?.toLowerCase()) {
    case "server":
      return Server;
    case "code2":
      return Code2;
    case "database":
      return Database;
    case "cloud":
      return Cloud;
    case "crown":
      return Crown;
    case "brain":
      return Brain;
    case "workflow":
      return Workflow;
    case "hearthandshake":
      return HeartHandshake;
    case "lightbulb":
      return Lightbulb;
    case "users":
      return Users;
    case "atom":
    default:
      return Atom;
  }
};

export default function ProfessionalProfile() {
  const { items: skills } = useFirestoreCollection<SkillItem>("skills", initialPortfolioData.skills);

  const technicalSkills = skills.filter((s) => s.category === "technical");
  const softSkills = skills.filter((s) => s.category === "soft");

  return (
    <motion.section
      id="skills"
      className="space-y-8"
      initial={{ opacity: 0 }}
      whileInView={{
        opacity: 1,
        transition: { staggerChildren: 0.2, delayChildren: 0.3 },
      }}
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
          <Code2 className="w-5 h-5" />
        </div>
        <h3 className="text-2xl md:text-3xl font-extrabold tracking-tight">Expertise & Skills</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Technical Skills */}
        <div className="glass-panel p-8 rounded-[2rem] border border-foreground/15 shadow-xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
            <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Server className="w-5 h-5 text-primary" /> Technical Arsenal
            </h4>
            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
              Proficiency
            </span>
          </div>

          <div className="space-y-6">
            {technicalSkills.map((skill, i) => {
              const Icon = getSkillIcon(skill.icon || "atom");
              return (
                <div key={skill.id || i} className="space-y-2.5">
                  <div className="flex justify-between items-center text-sm font-semibold">
                    <span className="text-foreground flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-foreground/5 border border-foreground/10 text-primary">
                        <Icon className="w-4 h-4" />
                      </div>
                      {skill.name}
                    </span>
                    <span className="font-mono font-bold text-primary bg-primary/10 px-2.5 py-0.5 rounded-full text-xs border border-primary/20">
                      {skill.level}%
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-muted/60 rounded-full overflow-hidden border border-border/40 p-[1px]">
                    <motion.div
                      className="h-full bg-gradient-to-r from-primary via-primary to-primary rounded-full relative shadow-[0_0_12px_var(--primary)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 + i * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <div className="absolute right-0 top-0 bottom-0 w-2 bg-white rounded-full shadow-[0_0_8px_#fff]" />
                    </motion.div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Soft Skills & Traits */}
        <div className="glass-panel p-8 rounded-[2rem] border border-foreground/15 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-border/60">
              <h4 className="text-xl font-bold text-foreground flex items-center gap-2">
                <Brain className="w-5 h-5 text-primary" /> Professional Traits
              </h4>
              <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground bg-muted/60 px-3 py-1 rounded-full border border-border/50">
                Core Competencies
              </span>
            </div>

            <div className="flex flex-wrap gap-3">
              <AnimatePresence>
                {softSkills.map((skill, i) => {
                  const Icon = getSkillIcon(skill.icon || "brain");
                  return (
                    <motion.div
                      key={skill.id || i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ type: "spring", stiffness: 200, damping: 15, delay: i * 0.08 }}
                      viewport={{ once: true }}
                      className="px-4 py-2.5 rounded-2xl border border-primary/20 bg-primary/10 text-primary text-sm font-semibold flex items-center gap-2 shadow-xs hover:scale-105 transition-transform cursor-default"
                    >
                      <Icon className="w-4 h-4" />
                      <span>{skill.name}</span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-border/60">
            <div className="p-4 rounded-2xl bg-gradient-to-r from-primary/10 via-primary/5 to-transparent border border-primary/20 flex items-start gap-3.5 shadow-xs">
              <div className="p-2 rounded-xl bg-primary/20 text-primary shrink-0 mt-0.5">
                <Rocket className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-foreground font-bold text-sm block mb-0.5">
                  Constant Learner & Tech Pioneer
                </strong>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Continuously evolving with cutting-edge AI frameworks, distributed architectures, and modern web design systems.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.section>
  );
}
