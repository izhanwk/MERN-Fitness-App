import Data from "../../Model/Registerdata.js";
import Foods from "../../Model/Foods.js";

export const getStore = async (req, res) => {
  try {
    const email = req.email;
    const user = await Data.findOne({ email });

    if (user) {
      return res.status(200).json(user.array);
    } else {
      console.log("User not found");
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
    console.log(array);
    const user = await Data.findOne({ email });

    if (user) {
      user.array = array;
      await user.save();
      return res.status(200).json(array);
    } else {
      console.log("User not found");
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

export const getFoodPage = async (req, res) => {
  console.log("Page from fontend : ", req.query.page);
  const page = parseInt(req.query.page) || 0;
  try {
    console.log("Page no : ", page);
    const totalLength = await Foods.countDocuments({});
    console.log("Length of document : ", totalLength);
    const limit = 15;
    const skip = limit * page;
    const products = await Foods.find({}).skip(skip).limit(limit);
    const response = products.map((product) => ({
      ...product.toObject(),
      showMore: totalLength > skip + products.length,
    }));
    console.log("Response length : ", response.length);
    return res.status(200).json(response);
  } catch (err) {
    return res.status(200).json({ message: "An error occured" });
  }
};
