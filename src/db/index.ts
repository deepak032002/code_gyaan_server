import mongoose from "mongoose";

const connectToDb = async () => {
  try {
    const res = await mongoose.connect(process.env.DB || "");
    if (res) {
      return console.log("Connected to DB");
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

export default connectToDb;
