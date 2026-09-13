import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { cn } from "../../lib/utils";
import { Card, CardContent } from "./card";
import { Calendar } from "lucide-react";

export interface TimelineEvent {
  id?: string;
  year: string;
  title: string;
  subtitle?: string;
  description: string;
  icon?: React.ReactNode;
  order?: number;
}

export interface ScrollTimelineProps {
  events: TimelineEvent[];
  title?: string;
  subtitle?: string;
  animationOrder?: "sequential" | "staggered" | "simultaneous";
  cardAlignment?: "alternating" | "left" | "right";
  lineColor?: string;
  accentColor?: string;
  activeColor?: string;
  progressIndicator?: boolean;
  cardVariant?: "default" | "elevated" | "outlined" | "filled";
  parallaxIntensity?: number;
  progressLineWidth?: number;
  progressLineCap?: "round" | "square";
  revealAnimation?: "fade" | "slide" | "scale";
  className?: string;
}

export const ScrollTimeline = ({
  events,
  title = "Timeline",
  subtitle = "Scroll to explore the journey",
  lineColor = "bg-primary/30",
  accentColor = "var(--primary)",
  progressIndicator = true,
  progressLineWidth = 3,
  className = "",
}: ScrollTimelineProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: scrollRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const progressHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  return (
    <div ref={scrollRef} className={cn("relative w-full overflow-hidden py-16", className)}>
      <div className="text-center mb-16 px-4">
        <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">{title}</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{subtitle}</p>
      </div>

      <div className="relative max-w-6xl mx-auto px-6">
        <div className="relative">
          {/* Base track line */}
          <div
            className={cn("absolute left-6 md:left-1/2 -translate-x-1/2 h-full z-10", lineColor)}
            style={{ width: `${progressLineWidth}px` }}
          />

          {/* Glowing progress line */}
          {progressIndicator && (
            <motion.div
              className="absolute left-6 md:left-1/2 -translate-x-1/2 top-0 z-10 rounded-full"
              style={{
                height: progressHeight,
                width: progressLineWidth,
                background: accentColor,
                boxShadow: `0 0 15px color-mix(in srgb, ${accentColor} 60%, transparent)`,
              }}
            />
          )}

          <div className="relative z-20 space-y-12">
            {events.map((event, index) => {
              const isEven = index % 2 === 0;
              return (
                <motion.div
                  key={event.id || index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className={cn(
                    "relative flex items-center flex-col md:flex-row gap-6",
                    isEven ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  {/* Center Node Indicator */}
                  <div
                    className="absolute left-6 md:left-1/2 -translate-x-1/2 w-8 h-8 rounded-full border-4 border-background z-30 shadow-md flex items-center justify-center"
                    style={{ backgroundColor: accentColor }}
                  >
                    <div className="w-2 h-2 rounded-full bg-white shadow-xs" />
                  </div>

                  {/* Card container */}
                  <div className={cn("w-full pl-14 md:pl-0 md:w-[calc(50%-32px)]", isEven ? "md:mr-auto" : "md:ml-auto")}>
                    <Card className="glass-panel p-6 rounded-3xl border border-foreground/10 hover:border-primary/40 transition-all duration-300 shadow-md">
                      <CardContent className="p-0">
                        <div
                          className="flex items-center gap-2 mb-3 text-xs font-bold w-max px-3 py-1 rounded-full"
                          style={{
                            color: accentColor,
                            backgroundColor: `color-mix(in srgb, ${accentColor} 10%, transparent)`,
                            border: `1px solid color-mix(in srgb, ${accentColor} 20%, transparent)`,
                          }}
                        >
                          {event.icon || <Calendar className="w-3.5 h-3.5" />}
                          <span>{event.year}</span>
                        </div>
                        <h3 className="text-xl font-bold text-foreground mb-1 tracking-tight">{event.title}</h3>
                        {event.subtitle && (
                          <h4 className="text-sm font-semibold text-muted-foreground mb-3">{event.subtitle}</h4>
                        )}
                        <p className="text-sm text-muted-foreground leading-relaxed">{event.description}</p>
                      </CardContent>
                    </Card>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScrollTimeline;
