import React, { useEffect, useRef, useState } from "react";
import { motion, useSpring } from "framer-motion";
import { cn } from "../../lib/utils";

export interface SmoothCursorProps {
  size?: number;
  color?: string;
  glowEffect?: boolean;
  showTrail?: boolean;
  trailLength?: number;
  className?: string;
}

export function SmoothCursor({
  size = 18,
  className,
}: SmoothCursorProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cursorX = useSpring(0, { damping: 28, stiffness: 350, mass: 0.6 });
  const cursorY = useSpring(0, { damping: 28, stiffness: 350, mass: 0.6 });

  useEffect(() => {
    // Only on pointer-fine devices
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const moveCursor = (e: MouseEvent) => {
      setIsVisible(true);
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    };

    const leave = () => setIsVisible(false);

    window.addEventListener("mousemove", moveCursor);
    document.addEventListener("mouseleave", leave);

    return () => {
      window.removeEventListener("mousemove", moveCursor);
      document.removeEventListener("mouseleave", leave);
    };
  }, [cursorX, cursorY]);

  if (!isVisible) return null;

  return (
    <motion.div
      style={{
        position: "fixed",
        left: cursorX,
        top: cursorY,
        translateX: "-50%",
        translateY: "-50%",
        pointerEvents: "none",
        zIndex: 99999,
      }}
      className={cn(
        "hidden md:block rounded-full bg-primary/30 border border-primary/50 backdrop-blur-[1px] shadow-[0_0_12px_var(--primary)]",
        className
      )}
      style-width={size}
    >
      <div style={{ width: size, height: size }} className="rounded-full bg-primary/20" />
    </motion.div>
  );
}

export default SmoothCursor;
