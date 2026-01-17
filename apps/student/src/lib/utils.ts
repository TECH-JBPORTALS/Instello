import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hrs > 0) {
    return `${hrs}h ${mins}m`;
  }
  if (mins > 0) {
    return `${mins}m`;
  }
  return `${secs}s`;
}

export function formatNumber(number: number): string {
  const num = Number(number);

  if (num < 1000) {
    return num.toString();
  }

  if (num < 1_000_000) {
    const value = num / 1000;
    return value % 1 === 0 ? `${Math.floor(value)}K` : `${value.toFixed(1)}K`;
  }

  if (num < 1_000_000_000) {
    const value = num / 1_000_000;
    return value % 1 === 0 ? `${Math.floor(value)}M` : `${value.toFixed(1)}M`;
  }

  const value = num / 1_000_000_000;
  return value % 1 === 0 ? `${Math.floor(value)}B` : `${value.toFixed(1)}B`;
}
