import express from "express";
import protectRoute from "../middleware/protect.route";
import {
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../controllers/message.controller";
const router = express.Router();

router.get("/conversations", protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post("/send/:id", protectRoute, sendMessage);

export default router;
