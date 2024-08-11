import { auth } from "../middleware/auth.js";
import { create, _delete, getAllUrls,_deleteMany } from "../controllers/url.js";
import express from "express";
const router = new express.Router();

// router.get("/r/:id", redirect);
router.get("/urls", auth, getAllUrls);
router.post("/create", auth, create);
router.delete("/delete", auth, _delete);
router.delete("/delete/many", auth, _deleteMany);

export default router;

// http://localhost:4000/url/redirect/:id -GET
// http://localhost:4000/url/urls-GET
// http://localhost:4000/url/create -POST
// http://localhost:4000/url/delete/ - DELETE
// http://localhost:4000/url/delete/many - DELETE
