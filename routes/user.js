import { auth } from "../middleware/auth.js";
import { signup, login, logout, _delete, profile } from "../controllers/user.js";
import express from "express";
const router = new express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.get("/profile", auth, profile);
router.delete("/delete", auth, _delete);
router.patch("/logout", auth, logout);

export default router;

// http://localhost:4000/user/signup -POST
// http://localhost:4000/user/login - POST
// http://localhost:4000/user/profile - GET
// http://localhost:4000/user/delete - DELETE
// http://localhost:4000/user/logout - PATCH
