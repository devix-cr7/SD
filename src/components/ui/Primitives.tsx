import { motion, type HTMLMotionProps } from "framer-motion";
import type { ReactNode } from "react";
import clsx from "clsx";

export function Card({
  children,
  className,
  hover = true,
  ...rest
}: HTMLMotionProps<"div"> & { children: ReactNode; hover?: boolean }) {
  return (
    <motion.div
      className={clsx(
        "rounded-xl border border-border bg-panel/80 p-4",
        hover && "transition-colors duration-200 hover:border-elevated-2 hover:bg-elevated/60",
        className
      )}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function Button({
  children,
  variant = "default",
  size = "md",
  className,
  ...rest
}: HTMLMotionProps<"button"> & {
  children: ReactNode;
  variant?: "default" | "primary" | "ghost" | "outline";
  size?: "sm" | "md";
}) {
  const variants: Record<string, string> = {
    default: "bg-elevated text-text-primary hover:bg-elevated-2 border border-border",
    primary: "bg-accent text-[#0a0a10] hover:brightness-110 shadow-[0_0_0_1px_rgba(108,142,255,0.4),0_8px_24px_-8px_rgba(108,142,255,0.55)]",
    ghost: "bg-transparent text-text-secondary hover:text-text-primary hover:bg-elevated/70",
    outline: "bg-transparent border border-border text-text-primary hover:border-elevated-2 hover:bg-elevated/40",
  };
  const sizes: Record<string, string> = {
    sm: "px-2.5 py-1.5 text-xs gap-1.5",
    md: "px-3.5 py-2 text-sm gap-2",
  };
  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
      className={clsx(
        "focus-ring inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200",
        variants[variant],
        sizes[size],
        className
      )}
      {...rest}
    >
      {children}
    </motion.button>
  );
}

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: ReactNode;
  tone?: "neutral" | "accent" | "teal" | "amber" | "rose";
  className?: string;
}) {
  const tones: Record<string, string> = {
    neutral: "bg-elevated text-text-secondary border-border",
    accent: "bg-accent-soft text-accent border-accent/25",
    teal: "bg-accent-2-soft text-accent-2 border-accent-2/25",
    amber: "bg-amber/10 text-amber border-amber/25",
    rose: "bg-rose/10 text-rose border-rose/25",
  };
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide",
        tones[tone],
        className
      )}
    >
      {children}
    </span>
  );
}

export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className={clsx(
        "focus-ring w-full rounded-lg border border-border bg-elevated/60 px-3 py-2 text-sm text-text-primary placeholder:text-text-tertiary transition-colors duration-200 focus:border-accent/50",
        props.className
      )}
    />
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <div className="mb-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-accent">
            {eyebrow}
          </div>
        )}
        <h1 className="text-xl font-semibold tracking-tight text-text-primary">{title}</h1>
        {description && <p className="mt-1 text-sm text-text-secondary">{description}</p>}
      </div>
      {action}
    </div>
  );
}
