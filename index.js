import dotenv from "dotenv";
dotenv.config();
import { app } from "./app.js";
import { connectDB } from "./config/db.js";

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on PORT ${process.env.PORT}`);
  });
});
