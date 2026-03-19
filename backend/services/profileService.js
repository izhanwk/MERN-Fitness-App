import User from "../models/User.js";
import { AppError } from "../utils/AppError.js";
import { isProfileComplete } from "../utils/userProfile.js";

export async function getUserByEmail(email) {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }
  return user;
}

export async function updateUserProfile(email, updates) {
  const user = await getUserByEmail(email);
  Object.assign(user, updates);
  user.profileComplete = isProfileComplete(user) ? "Complete" : "Incomplete";
  await user.save();
  return user;
}

export async function patchUserProfile(email, updates) {
  const user = await User.findOneAndUpdate({ email }, { $set: updates }, { new: true });
  if (!user) {
    throw new AppError(404, "User not found", "USER_NOT_FOUND");
  }

  user.profileComplete = isProfileComplete(user) ? "Complete" : "Incomplete";
  await user.save();
  return user;
}

export async function getProfileStatus(email) {
  const user = await getUserByEmail(email);
  return {
    complete: user.profileComplete === "Complete",
    profileComplete: user.profileComplete,
  };
}
