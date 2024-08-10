import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimestamp = (
  createdAt: Date
): string => {
  const diff = Date.now() - createdAt.getTime();
  const years = Math.floor(
    diff / (1000 * 60 * 60 * 24 * 365)
  );
  const weeks = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 365)) /
      (1000 * 60 * 60 * 24 * 7)
  );
  const days = Math.floor(
    (diff % (1000 * 60 * 60 * 24 * 7)) /
      (1000 * 60 * 60 * 24)
  );
  const hours = Math.floor(
    (diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor(
    (diff % (1000 * 60 * 60)) / (1000 * 60)
  );
  if (years > 0) return `${years} years ago`;
  if (weeks > 0) return `${weeks} weeks ago`;
  if (days > 0) return `${days} days ago`;
  if (hours > 0) return `${hours} hours ago`;
  if (minutes > 0) return `${minutes} minutes ago`;
  return 'just now';
};

export const formatNumber = (
  number: number
): string => {
  if (number >= 1e9) {
    return (number / 1e9).toFixed(1) + 'B';
  } else if (number >= 1e6) {
    return (number / 1e6).toFixed(1) + 'M';
  } else if (number >= 1e3) {
    return (number / 1e3).toFixed(1) + 'K';
  } else {
    return number.toString();
  }
};

export function formatDate(date: Date): string {
  const month = date.toLocaleString('default', {
    month: 'long'
  }); // Get full month name
  const year = date.getFullYear(); // Get year
  return `Joined ${month} ${year}`; // Join month and year
}
