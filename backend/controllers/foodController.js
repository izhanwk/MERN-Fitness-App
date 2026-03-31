import User from "../../Model/User.js";
import Foods from "../../Model/Foods.js";

export const getStore = async (req, res) => {
  try {
    const email = req.email;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(200).json(user.array);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error storing data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const saveStore = async (req, res) => {
  try {
    const email = req.email;
    const array = req.body.array;
    const user = await User.findOne({ email });

    if (user) {
      user.array = array;
      await user.save();
      return res.status(200).json(array);
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Error storing data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getFood = async (req, res) => {
  try {
    const foodItems = await Foods.find();
    return res.status(200).json(foodItems);
  } catch (err) {
    return res.status(500).json({ message: "Error occured: ", err });
  }
};

export const searchFood = async (req, res) => {
  try {
    const search = req.query.text || "";
    const filter = search ? { name: { $regex: search, $options: "i" } } : {};
    const foods = await Foods.find(filter).lean();
    res.status(200).json(foods);
  } catch (err) {
    console.error("Error in /search:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPortions = async (req, res) => {
  try {
    const name = (req.query.name || "").trim();

    if (!name) {
      return res.status(400).json({ message: "Food name is required" });
    }

    const escapedName = name.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const food = await Foods.findOne({
      name: { $regex: `^${escapedName}$`, $options: "i" },
    }).lean();

    if (!food) {
      return res.status(404).json({ message: "Food not found" });
    }

    const portions = (food.portions || []).map((portion) => portion.label);
    return res.status(200).json(portions);
  } catch (err) {
    console.error("Error in /getportion:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getFoodPage = async (req, res) => {
  const page = parseInt(req.query.page) || 0;
  try {
    const totalLength = await Foods.countDocuments({});
    const limit = 15;
    const skip = limit * page;
    const products = await Foods.find({}).skip(skip).limit(limit);
    const response = products.map((product) => ({
      ...product.toObject(),
      showMore: totalLength > skip + products.length,
    }));
    return res.status(200).json(response);
  } catch {
    return res.status(200).json({ message: "An error occured" });
  }
};
