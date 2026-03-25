import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  getFood,
  getFoodPage,
  getStore,
  saveStore,
  searchFood,
} from "../controllers/foodController.js";

const router = Router();

router.get("/store", verifyToken, getStore);
router.post("/store", verifyToken, saveStore);
router.get("/getfood", verifyToken, getFood);
router.get("/search", verifyToken, searchFood);
router.get("/getfood2", verifyToken, getFoodPage);

export default router;
