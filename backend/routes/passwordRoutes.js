import { Router } from "express";
import {
  changePassword,
  forgotPassword,
} from "../controllers/passwordController.js";

const router = Router();

router.post("/forgot-password", forgotPassword);
router.post("/change-password", changePassword);

export default router;
