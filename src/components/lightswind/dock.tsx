import React, { useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";
import { cn } from "../../lib/utils";

export interface DockItemData {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}

export interface DockProps {
  items?: DockItemData[];
  children?: React.ReactNode;
  className?: string;
  panelHeight?: number;
  baseItemSize?: number;
  magnification?: number;
  distance?: number;
}

interface DockIconItemProps {
  item: DockItemData;
  mouseX: MotionValue<number>;
  baseItemSize: number;
  magnification: number;
  distance: number;
}

const DockIconItem: React.FC<DockIconItemProps> = ({
  item,
  mouseX,
  baseItemSize,
  magnification,
  distance,
}) => {
  const ref = useRef<HTMLButtonElement>(null);

  const distanceCalc = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: baseItemSize };
    return val - bounds.x - baseItemSize / 2;
  });

  const widthSync = useTransform(distanceCalc, [-distance, 0, distance], [baseItemSize, magnification, baseItemSize]);
  const width = useSpring(widthSync, { mass: 0.1, stiffness: 150, damping: 12 });

  return (
    <motion.button
      ref={ref}
      style={{ width, height: width }}
      onClick={item.onClick}
      title={item.label}
      aria-label={item.label}
      className="relative flex items-center justify-center rounded-full bg-foreground/5 hover:bg-primary/20 text-foreground hover:text-primary transition-colors cursor-pointer p-2 shadow-xs active:scale-95"
    >
      {item.icon}
    </motion.button>
  );
};

export function Dock({
  items,
  children,
  className = "",
  panelHeight = 56,
  baseItemSize = 44,
  magnification = 60,
  distance = 150,
}: DockProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn(
        "mx-auto flex items-center justify-center px-4 py-2 rounded-full glass-panel border border-foreground/15 shadow-2xl backdrop-blur-2xl w-fit gap-2 sm:gap-3",
        className
      )}
      style={{ height: panelHeight }}
    >
      {items
        ? items.map((item, index) => (
            <DockIconItem
              key={index}
              item={item}
              mouseX={mouseX}
              baseItemSize={baseItemSize}
              magnification={magnification}
              distance={distance}
            />
          ))
        : children}
    </div>
  );
}

export function DockIcon({
  children,
  className = "",
  onClick,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        "relative flex items-center justify-center w-10 h-10 rounded-full bg-foreground/5 hover:bg-primary/20 text-foreground hover:text-primary transition-all cursor-pointer p-2 shadow-xs active:scale-90",
        className
      )}
    >
      {children}
    </button>
  );
}

export default Dock;
