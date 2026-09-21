import dotenv from "dotenv";
dotenv.config();
console.log("SEED SCRIPT STARTED");
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import User from "./model/usersModel.js";

const seedAdmin = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const existingAdmin = await User.findOne({
      role: "admin",
    });

    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      return;
    }

    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);

    const admin = await User.create({
      name: "System Admin",
      email: process.env.ADMIN_URL,
      password: hashedPassword,
      role: "admin",
    });

    console.log("Admin created:", admin.email);
  } catch (error) {
    console.error("SEED ERROR:", error);
  } finally {
    await mongoose.disconnect();
    console.log("Seed script finished");
  }
};

seedAdmin();
