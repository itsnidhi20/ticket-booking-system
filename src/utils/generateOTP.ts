import { randomInt } from "crypto";

export const generateOTP = (digits = 6): string => {
  const min = 10 ** (digits - 1);
  const max = 10 ** digits;

  return randomInt(min, max).toString();
};