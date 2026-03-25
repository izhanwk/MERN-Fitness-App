import { Router } from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  checkData,
  getData,
  getEditData,
  saveActivity,
  saveData,
  saveGoal,
  saveMode,
  updateEditData,
} from "../controllers/profileController.js";

const router = Router();

router.get("/getdata", verifyToken, getData);
router.post("/data", verifyToken, saveData);
router.post("/mode", verifyToken, saveMode);
router.post("/activity", verifyToken, saveActivity);
router.post("/goals", verifyToken, saveGoal);
router.get("/checkData", verifyToken, checkData);
router.get("/editdata", verifyToken, getEditData);
router.put("/editdata", verifyToken, updateEditData);

export default router;
