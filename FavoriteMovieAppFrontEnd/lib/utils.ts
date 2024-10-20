import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function minutesToHours(minutes?: number) {
  const mins = Number(minutes);

  if (isNaN(mins)) {
    return "Invalid input";
  }

  const hours = Math.floor(mins / 60);
  const remainingMinutes = mins % 60;

  let result = "";

  if (hours > 0) {
    result += `${hours}h `;
  }

  if (remainingMinutes > 0) {
    result += `${remainingMinutes}m`;
  }

  return result.trim();
}

export const usDollar = (price: number) => {
  let usPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  });

  return usPrice.format(price);
};

export const convertUTCToLocalTime = (utcDateString: string): Date => {
  return new Date(`${utcDateString}Z`);
};
export const timeAgo = (time: string) => {
  const date = convertUTCToLocalTime(time);
  const now = new Date();

  const diffInMs = now.getTime() - date.getTime();

  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);

  const diffInYears = Math.floor(diffInMonths / 12);

  let result = "";

  if (diffInYears > 0) {
    result += `${diffInYears} year${diffInYears > 1 ? "s" : ""}`;
  } else if (diffInMonths > 0) {
    result += `${diffInMonths} month${diffInMonths > 1 ? "s" : ""}`;
  } else if (diffInDays > 0) {
    result += `${diffInDays} day${diffInDays > 1 ? "s" : ""}`;
  } else if (diffInHours > 0) {
    result += `${diffInHours} hour${diffInHours > 1 ? "s" : ""}`;
  } else if (diffInMinutes > 0) {
    result += `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""}`;
  }

  if (result === "") {
    result = "just now";
  } else {
    result += " ago";
  }

  return result;
};
