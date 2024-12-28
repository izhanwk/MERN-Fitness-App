import mongoose from "mongoose";
const { Schema } = mongoose;

const blogSchema = new Schema({
  name: { type: String, required: true },
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

const Foods = mongoose.model("Foods", blogSchema, "Food items");
export default Foods;
