import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  editProfile,
  getCurrentUser,
  getTracker,
  profileStatus,
  saveActivity,
  saveGoal,
  saveMode,
  saveOnboardingProfile,
  saveTracker,
} from "../controllers/profileController.js";
import {
  validateActivity,
  validateEditProfile,
  validateGoal,
  validateMode,
  validateOnboardingProfile,
  validateTrackedFoods,
} from "../validators/profileValidators.js";

const router = Router();

router.use(authenticate);
router.get("/me", asyncHandler(getCurrentUser));
router.patch("/me", validateRequest(validateEditProfile), asyncHandler(editProfile));
router.get("/me/profile-status", asyncHandler(profileStatus));
router.put(
  "/me/onboarding/profile",
  validateRequest(validateOnboardingProfile),
  asyncHandler(saveOnboardingProfile)
);
router.put("/me/onboarding/goal", validateRequest(validateGoal), asyncHandler(saveGoal));
router.put("/me/onboarding/mode", validateRequest(validateMode), asyncHandler(saveMode));
router.put(
  "/me/onboarding/activity",
  validateRequest(validateActivity),
  asyncHandler(saveActivity)
);
router.get("/me/tracker", asyncHandler(getTracker));
router.put("/me/tracker", validateRequest(validateTrackedFoods), asyncHandler(saveTracker));

export default router;
