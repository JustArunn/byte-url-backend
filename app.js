import cookieParser from "cookie-parser";
import express from "express";
import userRouter from "./routes/user.js";
import urlRouter from "./routes/url.js";
import cors from "cors";
import { redirect } from "./controllers/url.js";
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

app.get("/:id", redirect);
app.use("/user/", userRouter);
app.use("/url/", urlRouter);

export { app };
