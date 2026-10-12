import mongoose from "mongoose";

export async function connectDB() {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Successfully connected to MongoDB");
    });
    await mongoose.connect(process.env.MONGODB_URI);
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
}
