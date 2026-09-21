import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb Connected");
  } catch (error) {
    console.error("Connection Failed", error);
    throw error;
  }
};
