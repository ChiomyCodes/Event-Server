import User from "../model/usersModel.js";
import { findByEmail, findById } from "../utils/query.js";
import bcrypt from "bcrypt";
import { signToken } from "../utils/jwt.js";
import { blacklistToken } from "../utils/tokenBlacklist.js";
import organizerRequest from "../model/requestModel.js";

export const createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Email and Password is required" });
    }
    const existingUser = await findByEmail(email);

    if (existingUser) {
      return res.status(409).json({ message: "User already exist" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      message: "Registration successful",
      user,
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await findByEmail(email).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = signToken({ id: user._id, role: user.role });

    return res.status(200).json({ message: "Successfully logged in", token });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getProfile = async (req, res) => {
  try {
    const { id } = req.user;
    const user = await findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res
      .status(200)
      .json({ message: "Profile retrieved successfully", user });
  } catch (error) {}
};

export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const update = await User.findByIdAndUpdate(id, { name }, { new: true });
    return res
      .status(200)
      .json({ message: "Profile successfully updated", update });
  } catch (error) {}
};

export const requestOrganizerRole = async (req, res) => {
  const userId = req.user.id;

  const request = await organizerRequest.create({
    user: userId,
    status: "pending",
  });

  res.status(201).json({
    message: "Organizer request submitted",
    request,
  });
};

export const logout = async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status().json({ message: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  blacklistToken(token);
  return res.status(200).json({ message: "Logged out successfully" });
};
