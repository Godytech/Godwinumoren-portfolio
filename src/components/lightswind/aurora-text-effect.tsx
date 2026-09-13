import { cn } from "../../lib/utils";

export interface AuroraTextEffectProps {
  text: string;
  className?: string;
  textClassName?: string;
  fontSize?: string;
}

export function AuroraTextEffect({
  text,
  className,
  textClassName,
  fontSize = "clamp(3rem, 6.5vw, 5.5rem)",
}: AuroraTextEffectProps) {
  return (
    <div className={cn("relative flex items-center justify-start overflow-hidden", className)}>
      <h2
        className={cn(
          "font-extrabold tracking-tight relative text-foreground pb-2",
          textClassName
        )}
        style={{ fontSize }}
      >
        {text}
      </h2>
    </div>
  );
}

export default AuroraTextEffect;
