import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { userModel } from "../models/user.model.js";
import getDataUriParser from "../utils/data.uri.js";
import { imageUpload } from "../utils/cloudinary.js";

// register account
const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;    

    if (!username || !email || !password) {
      return res.status(404).json({
        message: "all fields are required!",
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (user) {
      return res.status(401).json({
        message: "Email already exists!",
        success: false,
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await userModel.create({
      username,
      email,
      password: hashedPassword,
    });

    const tokenData = {
      userId: newUser._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(201)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "strict",
      })
      .json({
        message: "account created successfully!",
        success: true,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(404).json({
        message: "all fields are required!",
        success: false,
      });
    }

    const user = await userModel.findOne({ email });

    if (!user) {
      return res.status(401).json({
        message: "Invalid credentials!",
        success: false,
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password!",
        success: false,
      });
    }

    const tokenData = {
      userId: user._id,
    };

    const token = jwt.sign(tokenData, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    const greeting = user.fullName ? user.fullName : user.username;

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 1 * 24 * 60 * 60 * 1000,
        secure: true,
        sameSite: "strict",
      })
      .json({
        message: `${greeting}`,
        success: true,
      });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// logout
const logout = async (_, res) => {
  try {
    res.status(200).cookie("token", "", { maxAge: 0 }).json({
      message: "Logged out successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

// update profile
const updateProfile = async (req, res) => {
  try {
    const userId = req.id;
    const { username, email, fullName } = req.body;
    const file = req.file;

    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    const dataUrl = await getDataUriParser(file);
    const cloudResponse = await imageUpload(dataUrl.content);

    if (fullName) user.fullName = fullName;
    if (username) user.username = username;
    if (email) user.email = email;
    if (cloudResponse.secure_url) user.avatar = cloudResponse.secure_url;

    await user.save();

    return res.status(200).json({
      message: "Profile updated successfully!",
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};
// get profile
const getProfile = async (req, res) => {
  try {
    const userId = req.id;
    const user = await userModel.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found!",
        success: false,
      });
    }

    res.status(200).json({
      user,
      success: true,
    });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({
      message: `Server Error : ${error.message}`,
      success: false,
    });
  }
};

export { register, login, logout, updateProfile, getProfile };
