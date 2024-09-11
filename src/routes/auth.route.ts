import express from "express";
import { login, logout, signup, getMe } from "../controllers/auth.controller";
import protectRoute from "../middleware/protect.route";

const router = express.Router();

router.get("/me", protectRoute, getMe);
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);

export default router;
