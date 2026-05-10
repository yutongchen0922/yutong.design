/**
 * Tiny utility — merges class names, filtering out falsy values.
 * Lets you write: cn("base", isActive && "active", className)
 *
 * If you want full Tailwind class conflict resolution later, replace
 * this with `tailwind-merge` + `clsx`.
 */
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
