import { clsx, type ClassValue } from "clsx";
import * as _ from "lodash-es";
import { twMerge } from "tailwind-merge";

const utils = {
  isSSR() {
    return typeof window === "undefined";
  },
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default utils;
