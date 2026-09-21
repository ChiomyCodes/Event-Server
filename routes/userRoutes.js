import express from "express";
const router = express.Router();
import {
  createUser,
  loginUser,
  getProfile,
  logout,
  updateProfile,
  requestOrganizerRole,
} from "../controller/userController.js";
import { authenticate } from "../middleware/authenticate.js";

router.post("/register", createUser);
router.post("/login", loginUser);
router.get("/profile", authenticate, getProfile);
router.patch("/update-profile", updateProfile);
router.post("/request-organizer", authenticate, requestOrganizerRole);
router.post("/logout", logout);
export default router;
