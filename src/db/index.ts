import mongoose from "mongoose";
import Blog from "./models/blog.model";
import User from "./models/user.model";
import Tag from "./models/tag.model";
import Comment from "./models/comment.model";

const connectToDb = async () => {
  try {
    const res = await mongoose.connect(process.env.DB || "");

    if (res) {
      Blog.find();
      User.find();
      Tag.find();
      Comment.find();
      return console.log("Connected to DB");
    }
  } catch (error) {
    console.log(error);
  }
};

export default connectToDb;
