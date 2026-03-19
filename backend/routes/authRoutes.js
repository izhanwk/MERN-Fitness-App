import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  changePassword,
  forgotPassword,
  getSessions,
  googleSignIn,
  logoutCurrentSession,
  logoutOtherSession,
  refreshToken,
  register,
  signIn,
  verifyEmail,
} from "../controllers/authController.js";
import {
  validateChangePassword,
  validateForgotPassword,
  validateGoogleSignIn,
  validateRefreshToken,
  validateRegister,
  validateSignIn,
} from "../validators/authValidators.js";
import { objectIdParam } from "../validators/commonValidators.js";

const router = Router();

router.post("/register", validateRequest(validateRegister), asyncHandler(register));
router.get("/verify/:token", asyncHandler(verifyEmail));
router.post("/signin", validateRequest(validateSignIn), asyncHandler(signIn));
router.post(
  "/signin/google",
  validateRequest(validateGoogleSignIn),
  asyncHandler(googleSignIn)
);
router.post("/refresh", validateRequest(validateRefreshToken), asyncHandler(refreshToken));
router.post(
  "/forgot-password",
  validateRequest(validateForgotPassword),
  asyncHandler(forgotPassword)
);
router.post(
  "/change-password",
  validateRequest(validateChangePassword),
  asyncHandler(changePassword)
);
router.get("/sessions", authenticate, asyncHandler(getSessions));
router.delete("/sessions/current", authenticate, asyncHandler(logoutCurrentSession));
router.delete(
  "/sessions/:sessionId",
  authenticate,
  validateRequest((req) => {
    const sessionId = objectIdParam(req.params.sessionId, "sessionId");
    return {
      errors: sessionId.error ? [{ field: "sessionId", message: sessionId.error }] : [],
      params: sessionId.error ? undefined : { sessionId: sessionId.value },
    };
  }),
  asyncHandler(logoutOtherSession)
);

export default router;
