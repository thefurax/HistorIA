export const generateJoinCode = (prefix: string = 'HIA'): string => {
  const randomChars = Math.random().toString(36).substring(2, 6).toUpperCase();
  const timestampPart = Date.now().toString(36).substring(2, 4).toUpperCase();
  return `${prefix}-${randomChars}${timestampPart}`;
};
