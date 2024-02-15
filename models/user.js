import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    urls: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Url",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = function () {
  try {
    const payload = {
      _id: this._id,
      email: this.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });
    return token;
  } catch (err) {
    console.log("Error in token generation", err);
  }
};

userSchema.methods.encryptPassword = async function () {
  try {
    const hashPass = await bcrypt.hash(this.password, 10);
    return hashPass;
  } catch (err) {
    console.log("Error in password encryption", err.message);
  }
};

userSchema.methods.verifyPassword = async function (
  userPassword,
  hashPassword
) {
  try {
    const success = await bcrypt.compare(userPassword, hashPassword);
    return success;
  } catch (err) {
    console.log("Error in password encryption", err.message);
  }
};

export default mongoose.model("User", userSchema);
