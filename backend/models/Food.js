import mongoose from "mongoose";

const foodSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, index: true },
    calories: { type: Number, required: true, min: 0 },
    proteins: { type: Number, required: true, min: 0 },
    fats: { type: Number, required: true, min: 0 },
    carbohydrates: { type: Number, required: true, min: 0 },
    vA: { type: Number, required: true, min: 0 },
    vB: { type: Number, required: true, min: 0 },
    vC: { type: Number, required: true, min: 0 },
    vE: { type: Number, required: true, min: 0 },
    vK: { type: Number, required: true, min: 0 },
    iron: { type: Number, required: true, min: 0 },
    calcium: { type: Number, required: true, min: 0 },
    magnesium: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

const Food = mongoose.models.Food || mongoose.model("Food", foodSchema, "Food items");

export default Food;
