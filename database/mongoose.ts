import mongoose from "mongoose";
let isConnected: boolean = false;

export const connectToDatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.DATABASE_URL) {
    return console.log("Missing DATABASE_URL");
  }

  if (isConnected) {
    return console.log("MongoDB is already connected");
  }

  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      dbName: "DevFlow",
    });

    isConnected = true;
    console.log("MongoDB is connected");
  } catch (error) {
    console.log("Error while connecting to MongoDB", error);
  }
};
