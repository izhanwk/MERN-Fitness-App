import mongoose from "mongoose";

export function requiredString(value, field, { min = 1, max, lowercase = false } = {}) {
  if (typeof value !== "string") {
    return { error: `${field} must be a string` };
  }

  const normalized = lowercase ? value.trim().toLowerCase() : value.trim();
  if (normalized.length < min) {
    return { error: `${field} is required` };
  }

  if (max && normalized.length > max) {
    return { error: `${field} must be at most ${max} characters` };
  }

  return { value: normalized };
}

export function requiredEmail(value, field = "email") {
  const result = requiredString(value, field, { min: 3, max: 254, lowercase: true });
  if (result.error) {
    return result;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(result.value)) {
    return { error: `${field} must be a valid email` };
  }

  return { value: result.value };
}

export function requiredNumber(value, field, { min, max } = {}) {
  const normalized = Number(value);
  if (!Number.isFinite(normalized)) {
    return { error: `${field} must be a number` };
  }
  if (min != null && normalized < min) {
    return { error: `${field} must be at least ${min}` };
  }
  if (max != null && normalized > max) {
    return { error: `${field} must be at most ${max}` };
  }
  return { value: normalized };
}

export function optionalDate(value, field) {
  if (!value) {
    return { value: null };
  }
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return { error: `${field} must be a valid date` };
  }
  return { value: parsed };
}

export function enumValue(value, field, allowedValues) {
  if (!allowedValues.includes(value)) {
    return { error: `${field} must be one of: ${allowedValues.join(", ")}` };
  }
  return { value };
}

export function optionalArray(value, field) {
  if (!Array.isArray(value)) {
    return { error: `${field} must be an array` };
  }
  return { value };
}

export function objectIdParam(value, field = "id") {
  if (!mongoose.Types.ObjectId.isValid(value)) {
    return { error: `${field} must be a valid identifier` };
  }
  return { value };
}
