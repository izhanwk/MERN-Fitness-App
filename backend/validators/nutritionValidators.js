import { requiredNumber } from "./commonValidators.js";

export function validateFoodsPage(req) {
  const page = requiredNumber(req.query.page ?? 0, "page", { min: 0, max: 10000 });
  return {
    errors: page.error ? [{ field: "page", message: page.error }] : [],
    query: page.error ? undefined : { page: page.value },
  };
}

export function validateSearch(req) {
  const value = typeof req.query.text === "string" ? req.query.text.trim() : "";
  return {
    errors: [],
    query: { text: value.slice(0, 100) },
  };
}
