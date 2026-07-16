export const generateOTP = (digits = 6): string => {
  return Math.floor(10 ** (digits - 1) + Math.random() * 9 * 10 ** (digits - 1)).toString();
};
