import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { connectDB } from "./config/db.js";
import router from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

const port = process.env.PORT;
const app = express();

app.use(express.json());

app.use("/users", router);
app.use("/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API is working");
});

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();
