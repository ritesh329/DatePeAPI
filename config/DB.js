import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config(); 

let isConnected = false;

const db = async () => {
  try {
    if (isConnected) {
      console.log("Database already connected");
      return;
    }

    
    const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/DatePe";

    await mongoose.connect(MONGO_URI);

    console.log(` Database connected successfully`);
    isConnected = true;
  } catch (err) {
    console.error(" Database connection error:", err.message);
    process.exit(1); 
  }
};

export default db;
