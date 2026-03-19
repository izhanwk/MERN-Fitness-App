import { objectIdParam, requiredEmail, requiredString } from "./commonValidators.js";

export function validateRegister(req) {
  const errors = [];
  const email = requiredEmail(req.body.email);
  const password = requiredString(req.body.password, "password", { min: 8, max: 128 });

  if (email.error) errors.push({ field: "email", message: email.error });
  if (password.error) errors.push({ field: "password", message: password.error });

  return {
    errors,
    body: errors.length ? undefined : { email: email.value, password: password.value },
  };
}

export function validateSignIn(req) {
  const errors = [];
  const email = requiredEmail(req.body.email);
  const password = requiredString(req.body.password, "password", { min: 1, max: 128 });

  if (email.error) errors.push({ field: "email", message: email.error });
  if (password.error) errors.push({ field: "password", message: password.error });

  return {
    errors,
    body: errors.length ? undefined : { email: email.value, password: password.value },
  };
}

export function validateGoogleSignIn(req) {
  const credential = requiredString(req.body.credential, "credential", { min: 1 });
  return {
    errors: credential.error ? [{ field: "credential", message: credential.error }] : [],
    body: credential.error ? undefined : { credential: credential.value },
  };
}

export function validateRefreshToken(req) {
  const sessionId = objectIdParam(req.body.sessionId, "sessionId");
  return {
    errors: sessionId.error ? [{ field: "sessionId", message: sessionId.error }] : [],
    body: sessionId.error ? undefined : { sessionId: sessionId.value },
  };
}

export function validateForgotPassword(req) {
  const email = requiredEmail(req.body.email);
  return {
    errors: email.error ? [{ field: "email", message: email.error }] : [],
    body: email.error ? undefined : { email: email.value },
  };
}

export function validateChangePassword(req) {
  const errors = [];
  const email = requiredEmail(req.body.email);
  const otp = requiredString(req.body.otp, "otp", { min: 6, max: 6 });
  const password = requiredString(req.body.password, "password", { min: 8, max: 128 });

  if (email.error) errors.push({ field: "email", message: email.error });
  if (otp.error) errors.push({ field: "otp", message: otp.error });
  if (password.error) errors.push({ field: "password", message: password.error });

  return {
    errors,
    body: errors.length
      ? undefined
      : { email: email.value, otp: otp.value, password: password.value },
  };
}
