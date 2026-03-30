import "dotenv/config";
import mongoose from "mongoose";
import Foods from "../../Model/Foods.js";
import { buildServingProfile } from "../utils/foodServingOptions.js";

if (!process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

const run = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log("Connected to Database");

  const foods = await Foods.find({});
  let updated = 0;

  for (const food of foods) {
    const profile = buildServingProfile(food.toObject());
    const needsUpdate =
      food.baseServingLabel !== profile.baseServingLabel ||
      food.gramsPerServing !== profile.gramsPerServing ||
      JSON.stringify(food.servingOptions || []) !==
        JSON.stringify(profile.servingOptions);

    if (!needsUpdate) {
      continue;
    }

    food.baseServingLabel = profile.baseServingLabel;
    food.gramsPerServing = profile.gramsPerServing;
    food.servingOptions = profile.servingOptions;
    await food.save();
    updated += 1;
  }

  console.log(`Updated ${updated} of ${foods.length} food items.`);
  await mongoose.disconnect();
};

run().catch(async (error) => {
  console.error("Failed to backfill food servings:", error);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
