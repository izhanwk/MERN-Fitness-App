import {
  getProfileStatus,
  getUserByEmail,
  patchUserProfile,
  updateUserProfile,
} from "../services/profileService.js";
import { getTrackedFoods, saveTrackedFoods } from "../services/nutritionService.js";
import { sendSuccess } from "../utils/apiResponse.js";
import { sanitizeUser } from "../utils/userProfile.js";

export async function getCurrentUser(req, res) {
  const user = await getUserByEmail(req.email);
  return sendSuccess(res, { statusCode: 200, data: sanitizeUser(user) });
}

export async function saveOnboardingProfile(req, res) {
  await updateUserProfile(req.email, req.body);
  return sendSuccess(res, { statusCode: 200, message: "Profile data saved" });
}

export async function saveGoal(req, res) {
  await updateUserProfile(req.email, req.body);
  return sendSuccess(res, { statusCode: 200, message: "Goal saved" });
}

export async function saveMode(req, res) {
  await updateUserProfile(req.email, req.body);
  return sendSuccess(res, { statusCode: 200, message: "Mode saved" });
}

export async function saveActivity(req, res) {
  await updateUserProfile(req.email, req.body);
  return sendSuccess(res, { statusCode: 200, message: "Activity saved" });
}

export async function profileStatus(req, res) {
  const data = await getProfileStatus(req.email);
  return sendSuccess(res, {
    statusCode: 200,
    data,
    message: data.complete ? "Completed" : "Incomplete",
  });
}

export async function editProfile(req, res) {
  const user = await patchUserProfile(req.email, req.body);
  return sendSuccess(res, { statusCode: 200, data: sanitizeUser(user) });
}

export async function getTracker(req, res) {
  const data = await getTrackedFoods(req.email);
  return sendSuccess(res, { statusCode: 200, data });
}

export async function saveTracker(req, res) {
  const data = await saveTrackedFoods(req.email, req.body.array);
  return sendSuccess(res, { statusCode: 200, data });
}
