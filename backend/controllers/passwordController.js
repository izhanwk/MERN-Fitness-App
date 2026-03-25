import bcrypt from "bcrypt";
import Data from "../../Model/Registerdata.js";
import Otp from "../../Model/Otp.js";
import { sendGmail } from "../gmailSender.js";

export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Data.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await Otp.deleteMany({ email });
    await Otp.create({ email, otp });
    await sendGmail({
      to: email,
      subject: "Password reset OTP",
      html: `<p>Your OTP for password reset is <b>${otp}</b></p>`,
    });
    return res.status(200).json({ message: "OTP sent" });
  } catch (err) {
    console.error("OTP error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const changePassword = async (req, res) => {
  const { email, otp, password } = req.body;
  try {
    const record = await Otp.findOne({ email, otp });
    if (!record) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }
    const user = await Data.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    user.password = await bcrypt.hash(password, 10);
    await user.save();
    await Otp.deleteMany({ email });
    return res.status(200).json({ message: "Password updated" });
  } catch (err) {
    console.error("Change password error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
