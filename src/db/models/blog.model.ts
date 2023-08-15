import mongoose, { Schema, model, Document, ObjectId } from "mongoose";

interface BlogSchema extends Document {
  title: string;
  description: string;
  content: string;
  banner: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  tags: ObjectId[];
  category: ObjectId[];
  comment: ObjectId[];
  author: ObjectId;
  isTitleUnique: (title: string) => Promise<boolean>;
}

const blogSchema = new Schema<BlogSchema>(
  {
    title: {
      type: String,
      unique: true,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    content: {
      type: String,
      required: true,
    },

    banner: {
      type: String,
      required: true,
    },

    slug: {
      type: String,
    },

    meta_title: {
      type: String,
      required: true,
    },

    meta_description: {
      type: String,
      required: true,
    },

    tags: [
      {
        type: Schema.Types.ObjectId,
        ref: "Tag",
      },
    ],

    category: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
      },
    ],

    comment: [
      {
        type: Schema.Types.ObjectId,
        ref: "Comment",
      },
    ],

    author: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },

  { timestamps: true }
);

blogSchema.methods.isTitleUnique = async (title: string) => {
  try {
    return await mongoose.model("Blog").findOne({ title });
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!");
  }
};

blogSchema.pre("save", function (next) {
  this.slug = this.title
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();
  next();
});

blogSchema.pre(
  ["findOneAndUpdate", "updateOne"],
  function (next) {
    this.set(
      "slug",
      this.get("title")
        .replace(/[^\w\s]/g, "")
        .replace(/\s+/g, "-")
        .toLowerCase()
    );
    next();
  }
);

const Blog = model("Blog", blogSchema);

export default Blog;
