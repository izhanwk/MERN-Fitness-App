import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getSessions,
  logout,
  logoutSession,
} from "../controllers/sessionController.js";

const router = Router();

router.get("/sessions", verifyToken, getSessions);
router.get("/logout", verifyToken, logout);
router.delete("/logoutsession", verifyToken, logoutSession);

export default router;
