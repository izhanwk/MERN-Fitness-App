import mongoose from "mongoose";
const { Schema } = mongoose;

const portionSchema = new Schema({
  label: { type: String, required: true }, // e.g. "1 gram", "100 grams"
  grams: { type: Number, required: true }, // e.g. 1, 100, 200

  calories: { type: Number, required: true },
  proteins: { type: Number, required: true },
  fats: { type: Number, required: true },
  carbohydrates: { type: Number, required: true },

  vA: { type: Number, required: true },
  vB: { type: Number, required: true },
  vC: { type: Number, required: true },
  vE: { type: Number, required: true },
  vK: { type: Number, required: true },

  iron: { type: Number, required: true },
  calcium: { type: Number, required: true },
  magnesium: { type: Number, required: true },
});

const foodSchema = new Schema({
  name: { type: String, required: true, unique: true }, // "Biryani"
  portions: [portionSchema],
});

const Foods = mongoose.model("Foods", foodSchema, "Food items");
export default Foods;
