import urlModel from "../models/url.js";
import userModel from "../models/user.js";

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await userModel.findOne({ email: email });
    if (user) {
      return res.status(402).json({
        success: false,
        message: "User already exits",
      });
    }
    const newUser = userModel({ name, email, password });
    await newUser.save();
    const hashPassword = await newUser.encryptPassword();
    newUser.password = hashPassword;
    await newUser.save();

    const token = newUser.generateAuthToken();

    return res.status(200).json({
      success: true,
      message: "User created",
      token: token,
    });
  } catch (err) {
    console.log("Error in signup", err.message);
    return res.json({
      error: err.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(401).json({
        success: false,
        message: "All fields are required",
      });
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User does not exists",
      });
    }
    const hashPassword = user.password;
    const success = await user.verifyPassword(password, hashPassword);
    if (!success) {
      return res.status(402).json({
        success: false,
        message: "Password incorrect",
      });
    }
    const token = user.generateAuthToken();
    user.password = undefined;
    user.__v = undefined;
    return res.status(200).json({
      success: true,
      message: "Logged in",
      user: user,
      token: token,
    });
  } catch (err) {
    console.log("Error in login", err.message);
    return res.json({
      error: err.message,
    });
  }
};

const profile = async (req, res) => {
  const { email } = req.user;
  if (!email) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  const user = await userModel
    .findOne({ email: email })
    .select("-password")
    .populate("urls");
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }
  return res.status(200).json({
    success: true,
    user,
  });
};

const logout = async (req, res) => {
  try {
    const { email } = req.user;
    if (!email) {
      return res.status(404).json({
        success: false,
        message: "Please login",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Logged out",
    });
  } catch (err) {
    console.log("Error in logout", err.message);
  }
};

const _delete = async (req, res) => {
  try {
    const { email } = req.user;
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    await urlModel.deleteMany({ _id: user.urls });
    await user.deleteOne();
    return res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.log("Error in _delete", err.message);
    return res.json({
      error: err.message,
    });
  }
};

export { signup, login, logout, _delete, profile };
