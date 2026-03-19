import { AppError } from "../utils/AppError.js";

export function validateRequest(validator) {
  return function validationMiddleware(req, res, next) {
    const result = validator(req);
    if (result?.errors?.length) {
      return next(
        new AppError(422, "Validation failed", "VALIDATION_ERROR", result.errors)
      );
    }

    if (result?.body) {
      req.body = result.body;
    }
    if (result?.query) {
      req.query = result.query;
    }
    if (result?.params) {
      req.params = result.params;
    }

    return next();
  };
}
