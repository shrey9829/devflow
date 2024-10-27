import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import qs from "query-string";
import { BADGE_CRITERIA } from "@/constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getTimeStamp = (createdAt: Date): string => {
  const currentDate = new Date();
  const timeDiff = Math.abs(currentDate.getTime() - createdAt.getTime());

  const seconds = Math.floor(timeDiff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(months / 12);

  if (years > 0) {
    return `${years === 1 ? "1 year" : `${years} years`} ago`;
  } else if (months > 0) {
    return `${months === 1 ? "1 month" : `${months} months`} ago`;
  } else if (days > 0) {
    return `${days === 1 ? "1 day" : `${days} days`} ago`;
  } else if (hours > 0) {
    return `${hours === 1 ? "1 hour" : `${hours} hours`} ago`;
  } else if (minutes > 0) {
    return `${minutes === 1 ? "1 minute" : `${minutes} minutes`} ago`;
  } else {
    return "few seconds ago";
  }
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    console.log((num / 1000000).toFixed(1) + "M");
    return (num / 1000000).toFixed(1) + "M";
  } else if (num >= 1000) {
    return (num / 1000).toFixed(1) + "K";
  } else {
    return num.toString();
  }
};

export function getJoinedDate(date: Date): string {
  // Get month and year from the Date object
  const month = date.toLocaleString("en-us", { month: "short" }); // Get short month name (e.g., Jan, Feb, etc.)
  const year = date.getFullYear(); // Get full year (e.g., 2022)

  // Join month and year
  const joinedDate = `${month} ${year}`;

  return joinedDate;
}

export function formUrlQuery({ params, key, value }: any) {
  const currentUrl = qs.parse(params);

  currentUrl[key] = value;

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

export function removeKeysFromQuery({ params, keys }: any) {
  const currentUrl = qs.parse(params);

  keys.forEach((key: any) => {
    delete currentUrl[key];
  });

  return qs.stringifyUrl(
    {
      url: window.location.pathname,
      query: currentUrl,
    },
    { skipNull: true }
  );
}

interface BadgeParam {
  criteria: {
    type: string;
    count: number;
  }[];
}

export const assignBadges = (params: BadgeParam) => {
  const badgeCounts = {
    GOLD: 0,
    SILVER: 0,
    BRONZE: 0,
  };

  const { criteria } = params;

  criteria.forEach((item) => {
    const { type, count } = item;
    //@ts-ignore
    const badgeLevels: any = BADGE_CRITERIA[type];

    Object.keys(badgeLevels).forEach((level: any) => {
      if (count >= badgeLevels[level]) {
        //@ts-ignore
        badgeCounts[level] += 1;
      }
    });
  });

  return badgeCounts;
};
