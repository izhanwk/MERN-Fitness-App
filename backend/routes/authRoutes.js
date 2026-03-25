import { Router } from "express";
import {
  googleSignIn,
  refreshToken,
  register,
  signIn,
  verifyEmail,
} from "../controllers/authController.js";

const router = Router();

router.post("/refresh-token", refreshToken);
router.post("/signin", signIn);
router.post("/signin/google", googleSignIn);
router.post("/register", register);
router.get("/verify/:token", verifyEmail);

export default router;
