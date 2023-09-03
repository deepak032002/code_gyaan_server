import mongoose, { Schema, model, ObjectId, Model } from "mongoose";

interface BlogSchema {
  title: string;
  description: string;
  content: string;
  banner: string;
  slug: string;
  meta_title: string;
  meta_description: string;
  tags: ObjectId[];
  category: ObjectId;
  comment: ObjectId[];
  author: ObjectId;
  is_deleted: boolean;
  is_published: boolean;
  // isTitleUnique: (title: string) => Promise<boolean>;
}

interface BlogModel extends Model<BlogSchema> {
  isTitleUnique: (title: string) => Promise<boolean>;
}

const blogSchema = new Schema<BlogSchema, BlogModel>(
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

    category: {
      type: Schema.Types.ObjectId,
      ref: "Category",
    },

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

    is_deleted: {
      type: Boolean,
      default: false,
    },

    is_published: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true },
);

blogSchema.static('isTitleUnique', async function (title: string) {
  try {
    return await this.findOne({ title: { $regex: new RegExp(title, 'i') } })
  } catch (error) {
    console.log(error);
    throw new Error("Something went wrong!")
  }
})

blogSchema.pre("save", function (next) {
  if (!this.title) return next();
  this.slug = this.title
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .toLowerCase();

  next();
});

blogSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {

  if (!this.get('title')) return next()
  this.set(
    "slug",
    this.get("title")
      .replace(/[^\w\s]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase(),
  );
  next();
});

blogSchema.index({ title: 'text', _id: 'text' })

const Blog = model<BlogSchema, BlogModel>("Blog", blogSchema);

export default Blog;
