import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-padded chapter/index numerals used throughout the editorial furniture. */
export function ordinal(n: number) {
  return String(n + 1).padStart(2, "0");
}
