import urlModel from "../models/url.js";
import userModel from "../models/user.js";
import shortId from "shortid";

const redirect = async (req, res) => {
  try {
    const { id } = req.params;
    const url = await urlModel.findOne({ shortId: id });
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "url not found",
      });
    }
    url.clicks += 1;
    await url.save();
    const redirectUrl = url.originUrl;
    return res.redirect(redirectUrl);
  } catch (err) {
    console.log("Error", err.message);
  }
};

const create = async (req, res) => {
  try {
    const { email } = req.user;
    const { url } = req.body;
    if (!url) {
      return res.status(404).json({
        success: false,
        message: "url is required",
      });
    }
    const user = await userModel.findOne({ email: email });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    const id = shortId.generate();
    const newUrl = await urlModel({ shortId: id, originUrl: url }).save();
    // await newUrl.save();
    user.urls.push(newUrl._id);
    await user.save();

    return res.status(200).json({
      success: true,
      message: "url created",
      url: newUrl,
    });
  } catch (err) {
    console.log("Error", err.message);
  }
};

const getAllUrls = async (req, res) => {
  try {
    const { email } = req.user;
    const { urls } = await userModel
      .findOne({ email: email })
      .select("urls -_id")
      .populate("urls");

    return res.status(200).json({
      success: true,
      urls,
    });
  } catch (err) {
    console.log("Error in getAllUrls ->", err.message);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const _delete = async (req, res) => {
  try {
    const { _id } = req.body;
    const { email } = req.user;

    await userModel.findOneAndUpdate(
      { email: email },
      { $pull: { urls: _id } },
      { new: true }
    );
    const deletedUrl = await urlModel.findOneAndDelete(
      { _id: _id },
      { new: true }
    );
    if (!deletedUrl) {
      return res.status(404).json({
        success: false,
        message: "url not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "deleted",
    });
  } catch (err) {
    console.log("Error in _delete", err.message);
  }
};

export { redirect, create, _delete, getAllUrls };
