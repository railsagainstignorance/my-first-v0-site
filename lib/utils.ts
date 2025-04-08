import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date string with options for including time
 * @param dateString ISO date string
 * @param includeTime Whether to include time in the formatted output
 * @returns Formatted date string
 */
export function formatDate(dateString: string, includeTime = false) {
  const date = new Date(dateString)

  if (includeTime) {
    return date.toLocaleString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    })
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  })
}

/**
 * Parse a date string from frontmatter
 * Supports various date formats including ISO dates and dates with time
 * @param dateString Date string from frontmatter
 * @returns ISO date string with time
 */
export function parseDate(dateString: string | Date): string {
  if (!dateString) {
    return new Date().toISOString()
  }

  // If it's already a Date object
  if (dateString instanceof Date) {
    return dateString.toISOString()
  }

  // Try to parse the date string
  const date = new Date(dateString)

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.warn(`Invalid date: ${dateString}, using current date instead`)
    return new Date().toISOString()
  }

  return date.toISOString()
}
