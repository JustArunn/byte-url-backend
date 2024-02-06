import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose
      .connect(process.env.MONGO_URL)
      .then(({ connection: { host } }) => {
        console.log("MongoDB connected HOST ->", host);
      });
  } catch (err) {
    console.log("Error in DB connection", err);
    process.exit(1);
  }
};

export { connectDB };
