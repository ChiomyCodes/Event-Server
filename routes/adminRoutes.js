import express from "express";
const adminRoutes = express.Router();
import {
  deleteUser,
  getAllUsers,
  loginAdmin,
  promoteToOrganizer,
  getAllRequests,
} from "../controller/adminController.js";
import { authenticate } from "../middleware/authenticate.js";
import { authorize } from "../middleware/authorize.js";

adminRoutes.post(
  "/login-admin",

  loginAdmin,
);
adminRoutes.get("/all-users", authenticate, authorize("admin"), getAllUsers);
adminRoutes.delete(
  "/delete-user/:userId",

  authenticate,
  authorize("admin"),
  deleteUser,
);
adminRoutes.get("/all-requests", getAllRequests);

adminRoutes.patch(
  "/:requestId/approve",
  authenticate,
  authorize("admin"),
  promoteToOrganizer,
);

export default adminRoutes;
