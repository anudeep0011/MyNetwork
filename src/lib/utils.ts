import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function generateBatchId(college: string, year: number) {
  const slug = college.toLowerCase().replace(/[^a-z0-9]/g, '_');
  return `${slug}_${year}`;
}
