import { Router } from "express";
import { authenticate } from "../middleware/authenticate.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
  getFoods,
  getPagedFoods,
  searchFoodList,
} from "../controllers/nutritionController.js";
import {
  validateFoodsPage,
  validateSearch,
} from "../validators/nutritionValidators.js";

const router = Router();

router.use(authenticate);
router.get("/", asyncHandler(getFoods));
router.get("/search", validateRequest(validateSearch), asyncHandler(searchFoodList));
router.get("/paged", validateRequest(validateFoodsPage), asyncHandler(getPagedFoods));

export default router;
