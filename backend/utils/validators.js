export const normalizeEmail = (value) =>
  typeof value === "string" ? value.trim().toLowerCase() : "";

export const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

export const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmail(value));

export const isStrongEnoughPassword = (value) =>
  typeof value === "string" &&
  value.length >= 8 &&
  /[A-Z]/.test(value) &&
  /[a-z]/.test(value) &&
  /\d/.test(value);

export const passwordPolicyMessage =
  "Password must be at least 8 characters and include uppercase, lowercase, and a number";

export const parseFiniteNumber = (value) => {
  if (value === null || value === undefined || value === "") {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
