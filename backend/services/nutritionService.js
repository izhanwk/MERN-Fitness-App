import Food from "../models/Food.js";
import { getUserByEmail, updateUserProfile } from "./profileService.js";

export async function listFoods() {
  return Food.find().lean();
}

export async function searchFoods(searchText) {
  const filter = searchText
    ? { name: { $regex: searchText, $options: "i" } }
    : {};
  return Food.find(filter).lean();
}

export async function getFoodsPage(page = 0, limit = 15) {
  const total = await Food.countDocuments({});
  const skip = limit * page;
  const foods = await Food.find({}).skip(skip).limit(limit).lean();

  return {
    items: foods.map((food) => ({
      ...food,
      showMore: total > skip + foods.length,
    })),
    meta: {
      page,
      limit,
      total,
      hasMore: total > skip + foods.length,
    },
  };
}

export async function getTrackedFoods(email) {
  const user = await getUserByEmail(email);
  return user.array || [];
}

export async function saveTrackedFoods(email, trackedFoods) {
  const user = await updateUserProfile(email, { array: trackedFoods });
  return user.array || [];
}
