import {
  enumValue,
  optionalArray,
  optionalDate,
  requiredNumber,
  requiredString,
} from "./commonValidators.js";

const genders = ["male", "female", "other"];
const weightScales = ["kg", "lb", "Kgs", "LBs", "Lbs"];
const lengthScales = ["cm", "ft", "in"];
const goals = ["musclegain", "fatloss"];
const modes = [
  "lean bulk",
  "aggressive bulk",
  "maintain",
  "mild loss",
  "fast loss",
  "Moderate Musclegain",
  "Fast Musclegain",
  "Moderate fatloss",
  "Fast fatloss",
];
const activities = [1.2, 1.375, 1.55, 1.725, 1.9];

export function validateOnboardingProfile(req) {
  const errors = [];
  const name = requiredString(req.body.name, "name", { min: 2, max: 120 });
  const date = optionalDate(req.body.date, "date");
  const gender = enumValue(req.body.gender, "gender", genders);
  const weight = requiredNumber(req.body.weight, "weight", { min: 1, max: 1000 });
  const weightScale = enumValue(req.body.weightScale, "weightScale", weightScales);
  const height = requiredNumber(req.body.height, "height", { min: 1, max: 400 });
  const lengthScale = enumValue(req.body.lengthScale, "lengthScale", lengthScales);

  for (const [field, result] of Object.entries({
    name,
    date,
    gender,
    weight,
    weightScale,
    height,
    lengthScale,
  })) {
    if (result.error) {
      errors.push({ field, message: result.error });
    }
  }

  return {
    errors,
    body: errors.length
      ? undefined
      : {
          name: name.value,
          date: date.value,
          gender: gender.value,
          weight: weight.value,
          weightScale: weightScale.value,
          height: height.value,
          lengthScale: lengthScale.value,
        },
  };
}

export function validateGoal(req) {
  const goal = enumValue(req.body.goal, "goal", goals);
  return {
    errors: goal.error ? [{ field: "goal", message: goal.error }] : [],
    body: goal.error ? undefined : { goal: goal.value },
  };
}

export function validateMode(req) {
  const mode = enumValue(req.body.mode, "mode", modes);
  return {
    errors: mode.error ? [{ field: "mode", message: mode.error }] : [],
    body: mode.error ? undefined : { mode: mode.value },
  };
}

export function validateActivity(req) {
  const activity = requiredNumber(req.body.activity, "activity", { min: 1, max: 2.5 });
  const errors = [];
  if (activity.error) {
    errors.push({ field: "activity", message: activity.error });
  } else if (!activities.includes(activity.value)) {
    errors.push({
      field: "activity",
      message: `activity must be one of: ${activities.join(", ")}`,
    });
  }

  return {
    errors,
    body: errors.length ? undefined : { activity: activity.value },
  };
}

export function validateEditProfile(req) {
  const errors = [];
  const updates = {};

  if (req.body.name !== undefined) {
    const result = requiredString(req.body.name, "name", { min: 2, max: 120 });
    if (result.error) errors.push({ field: "name", message: result.error });
    else updates.name = result.value;
  }

  if (req.body.date !== undefined) {
    const result = optionalDate(req.body.date, "date");
    if (result.error) errors.push({ field: "date", message: result.error });
    else updates.date = result.value;
  }

  if (req.body.gender !== undefined) {
    const result = enumValue(req.body.gender, "gender", genders);
    if (result.error) errors.push({ field: "gender", message: result.error });
    else updates.gender = result.value;
  }

  if (req.body.weight !== undefined) {
    const result = requiredNumber(req.body.weight, "weight", { min: 1, max: 1000 });
    if (result.error) errors.push({ field: "weight", message: result.error });
    else updates.weight = result.value;
  }

  if (req.body.weightScale !== undefined) {
    const result = enumValue(req.body.weightScale, "weightScale", weightScales);
    if (result.error) errors.push({ field: "weightScale", message: result.error });
    else updates.weightScale = result.value;
  }

  if (req.body.height !== undefined) {
    const result = requiredNumber(req.body.height, "height", { min: 1, max: 400 });
    if (result.error) errors.push({ field: "height", message: result.error });
    else updates.height = result.value;
  }

  if (req.body.lengthScale !== undefined) {
    const result = enumValue(req.body.lengthScale, "lengthScale", lengthScales);
    if (result.error) errors.push({ field: "lengthScale", message: result.error });
    else updates.lengthScale = result.value;
  }

  if (req.body.goal !== undefined) {
    const result = enumValue(req.body.goal, "goal", goals);
    if (result.error) errors.push({ field: "goal", message: result.error });
    else updates.goal = result.value;
  }

  if (req.body.mode !== undefined) {
    const result = enumValue(req.body.mode, "mode", modes);
    if (result.error) errors.push({ field: "mode", message: result.error });
    else updates.mode = result.value;
  }

  if (req.body.activity !== undefined) {
    const result = requiredNumber(req.body.activity, "activity", { min: 1, max: 2.5 });
    if (result.error) errors.push({ field: "activity", message: result.error });
    else updates.activity = result.value;
  }

  return { errors, body: errors.length ? undefined : updates };
}

export function validateTrackedFoods(req) {
  const array = optionalArray(req.body.array, "array");
  return {
    errors: array.error ? [{ field: "array", message: array.error }] : [],
    body: array.error ? undefined : { array: array.value },
  };
}
