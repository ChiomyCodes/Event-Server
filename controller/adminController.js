import User from "../model/usersModel.js";
import Request from "../model/requestModel.js";
import { findByEmail } from "../utils/query.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";

export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findByEmail(email).select("+password");
    if (!user) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user._id, role: user.role });
    return res.status(200).json({ message: "Login successful", token, user });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return res
      .status(200)
      .json({ message: "User fetched successfully", data: users });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const promoteToOrganizer = async (req, res) => {
  try {
    const { requestId } = req.params;

    const request = await Request.findById(requestId);

    if (!request) {
      return res.status(404).json({
        message: "Request not found",
      });
    }

    if (request.status !== "pending") {
      return res.status(400).json({
        message: "Request has already been processed",
      });
    }

    const user = await User.findById(request.user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.role = "organizer";
    await user.save();

    request.status = "approved";
    request.reviewedBy = req.user.id;
    await request.save();

    res.json({
      message: "User has been made an organizer",
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRequests = async (req, res) => {
  try {
    const requests = await Request.find();
    if (!requests) {
      return res.status(404).json({ message: "No requests found" });
    }

    return res
      .status(200)
      .json({ message: "Requests fetched successfully", requests });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};
