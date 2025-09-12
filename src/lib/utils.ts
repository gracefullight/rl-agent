/**
 * Utility function to concatenate class names, filtering out falsy values.
 * @param args List of class name strings or falsy values
 * @returns {string} Concatenated class names
 */
export function cn(...args: any[]): string {
  return args.filter(Boolean).join(" ");
}
