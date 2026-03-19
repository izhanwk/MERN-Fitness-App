import { AppError } from "../utils/AppError.js";

export function notFoundMiddleware(req, res, next) {
  next(new AppError(404, `Route not found: ${req.method} ${req.originalUrl}`, "ROUTE_NOT_FOUND"));
}
