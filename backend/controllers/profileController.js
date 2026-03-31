import User from "../../Model/User.js";
import { applyProfileComplete } from "../utils/profileComplete.js";
import { safeUserFields } from "../utils/safeUserFields.js";
import { isNonEmptyString, parseFiniteNumber } from "../utils/validators.js";

export const getData = async (req, res) => {
  try {
    const email = req.email;
    const user = await User.findOne({ email: email }).select(safeUserFields);
    if (user) {
      return res.status(200).json(user);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Erro while fetching data ERROR: ", err });
  }
};

export const saveData = async (req, res) => {
  const email = req.user.email;
  const { name, date, gender, weight, weightScale, height, lengthScale } =
    req.body;

  try {
    const user = await User.findOne({ email: email });

    if (user) {
      user.name = isNonEmptyString(name) ? name.trim() : user.name;
      user.date = date ? new Date(date) : user.date;
      user.gender = isNonEmptyString(gender) ? gender.trim() : user.gender;
      user.weight = parseFiniteNumber(weight) ?? user.weight;
      user.weightScale = isNonEmptyString(weightScale)
        ? weightScale.trim()
        : user.weightScale;
      user.height = parseFiniteNumber(height) ?? user.height;
      user.lengthScale = isNonEmptyString(lengthScale)
        ? lengthScale.trim()
        : user.lengthScale;
      applyProfileComplete(user);
      await user.save();
      return res.status(200).json({ message: "Data saved in DB collection" });
    } else {
      return res.status(400).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Unexpected error occurred:", err);
    return res.status(500).json({ message: "Unexpected error occurred", err });
  }
};

export const saveMode = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email: email });
    if (user) {
      user.mode = req.body.mode;
      applyProfileComplete(user);
      await user.save();
      return res.status(200).json({ message: "Saved in DB" });
    } else {
      return res.status(400).json({ message: "Could not save in DB" });
    }
  } catch (err) {
    return res.status(402).json({ message: "Error occurred: ", err });
  }
};

export const saveActivity = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email: email });
    if (user) {
      user.activity = req.body.activity;
      applyProfileComplete(user);
      await user.save();
      return res.status(200).json({ message: "Saved in DB" });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (err) {
    console.error("Error updating activity:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const saveGoal = async (req, res) => {
  try {
    const email = req.user.email;
    const user = await User.findOne({ email: email });
    if (user) {
      user.goal = req.body.goal;
      applyProfileComplete(user);
      await user.save();
      return res.status(200).json({ message: "Saved in DB" });
    } else {
      return res.status(400).json({ message: "Could not save in DB" });
    }
  } catch (err) {
    return res.status(402).json({ message: "Error occurred: ", err });
  }
};

export const checkData = async (req, res) => {
  const email = req.email;
  try {
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileComplete === "Complete") {
      return res.status(200).json({ message: "Completed" });
    } else {
      return res.status(210).json({ message: "Not completed" });
    }
  } catch {
    return res.status(500).json({ message: "Not Completed" });
  }
};

export const getEditData = async (req, res) => {
  const email = req.email;
  const user = await User.findOne({ email: email }).select(safeUserFields);
  if (user) {
    return res.status(200).json(user);
  }

  return res.status(404).json({ message: "User not found" });
};

export const updateEditData = async (req, res) => {
  try {
    const allowed = [
      "name",
      "date",
      "gender",
      "weight",
      "weightScale",
      "height",
      "lengthScale",
      "goal",
      "mode",
      "activity",
    ];

    const updates = {};
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }

    if (updates.date) updates.date = new Date(updates.date);
    if (updates.weight != null) {
      updates.weight = parseFiniteNumber(updates.weight);
    }
    if (updates.height != null) {
      updates.height = parseFiniteNumber(updates.height);
    }
    if (updates.activity != null) {
      updates.activity = parseFiniteNumber(updates.activity);
    }

    if (
      (updates.weight !== undefined && updates.weight === null) ||
      (updates.height !== undefined && updates.height === null) ||
      (updates.activity !== undefined && updates.activity === null)
    ) {
      return res.status(400).json({ message: "Invalid numeric input" });
    }

    const user = await User.findOneAndUpdate(
      { email: req.email },
      { $set: updates },
      { new: true },
    );

    if (!user) return res.status(404).json({ message: "User not found" });
    return res.status(200).json(user);
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Server error" });
  }
};
