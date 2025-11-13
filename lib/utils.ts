/*
* lib/utils.ts
* Utility functions for class name merging and extracting initials from names.
*/

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/*
* Merge class names using clsx and tailwind-merge
*/
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/*
* Get initials from a full name
* Example: "John Doe" -> "JD"
*/
export const getInitials = (name: string): string => name
  .split(" ")
  .map((word) => word.charAt(0).toUpperCase()) // get the first letter of each word and capitalize it
  .join("")
  .slice(0, 2); // limit to first two initials