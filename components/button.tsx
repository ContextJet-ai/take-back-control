import Link from "next/link";
import type { ComponentProps } from "react";

type Variant = "primary" | "secondary";
const base = "inline-flex items-center justify-center rounded-full px-6 py-3 text-base font-medium transition-transform active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent whitespace-nowrap";
const styles: Record<Variant, string> = {
  primary: "bg-accent text-accent-fg hover:opacity-90",
  secondary: "border border-border text-fg hover:bg-surface",
};

export function Button({ href, variant = "primary", className = "", ...rest }: { href?: string; variant?: Variant } & ComponentProps<"button">) {
  const cls = `${base} ${styles[variant]} ${className}`;
  if (href) return <Link href={href} className={cls}>{rest.children}</Link>;
  return <button type="button" className={cls} {...rest} />;
}
