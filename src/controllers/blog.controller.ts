import { Request, Response } from "express";
import Blog from "../db/models/blog.model";
import Comment from "../db/models/comment.model";

const getBlogs = async (req: Request, res: Response) => {
  try {
    const blogData = await Blog.find()
      .populate("author", "name email avtar")
      .populate("tags", "name")
      .populate("comment", "name email content");

    if (blogData.length === 0) {
      return res.status(200).send({ message: "No Blog Found", blogData });
    }

    return res.status(200).send({ message: "Success", blogs: blogData });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ message: "Something went wrong!", error, success: false });
  }
};

const postBlog = async (req: Request, res: Response) => {
  try {
    let tags: string[] = ["64310980a8aad559ca474641"];

    const { title, content, description, meta_title, meta_description } =
      req.body;

    if (content) {
    }

    const blog = new Blog({
      title,
      content,
      description,
      tags,
      meta_title,
      meta_description,
      banner: req.file?.path,
      author: req.user.id,
    });

    const isUnique = await blog.isTitleUnique(title);

    if (isUnique) {
      return res.status(400).send({ message: "Title already exists!" });
    }

    const isBlog = await blog.save();

    if (!isBlog) {
      return res.status(400).send({ message: "Something went wrong!" });
    }

    return res
      .status(200)
      .send({ message: "Successfully Created!", blog: isBlog });
  } catch (error: any) {
    console.log(error);

    return res.status(500).send({
      message: "Internal Server Error",
      error: error,
    });
  }
};

const patchBlog = async (req: Request, res: Response) => {
  try {
    const isUpdateBlog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true }
    ).exec();

    if (!isUpdateBlog) {
      return res.status(400).send({ message: "Something went wrong!" });
    }

    return res
      .status(200)
      .send({ message: "Successfully Updated!", blog: isUpdateBlog });
  } catch (error: any) {
    console.log(error);

    return res.status(500).send({
      message: "Internal Server Error",
      error: error.errors[0].message,
    });
  }
};

const deleteBlog = async (req: Request, res: Response) => {
  try {
    const isDeleteBlog: any = await Blog.findOneAndDelete({
      slug: req.params.slug,
    });

    if (!isDeleteBlog) {
      return res.status(400).send({ message: "Something went wrong!" });
    }

    return res.status(204).send({ message: "Successfully Deleted!" });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ message: "Internal Server Error", error, success: false });
  }
};

const getBlogBySlug = async (req: Request, res: Response) => {
  try {
    const blogData = await Blog.findOne({ slug: req.params.slug })
      .populate("author", "name email avtar")
      .populate("tags", "name")
      .populate("comment", "name email content");

    if (!blogData) {
      return res.status(500).send({ message: "Blog not found", blogData });
    }
    return res.status(200).send({ message: "Success", blogData });
  } catch (error) {
    return res
      .status(500)
      .send({ message: "Internal Server Error", error, success: false });
  }
};

const comment = async (req: Request, res: Response) => {
  try {
    const { content } = req.body;
    const blog = await Blog.findOne({ slug: req.params.slug });

    if (!blog) {
      return res.status(400).send({ message: "Blog not found" });
    }

    const comment = new Comment({
      content,
      user: req.user.id,
    });

    const isComment: any = await comment.save();

    blog.comment.push(isComment._id);

    await blog.save();

    return res.status(200).send({ message: "Comment added successfully" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Internal Server Error", error, success: false });
  }
};

const uploadImageController = async (req: Request, res: Response) => {
  try {
    return res.status(200).send({ message: "Success", url: req.file?.path });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};
export {
  getBlogs,
  postBlog,
  patchBlog,
  deleteBlog,
  getBlogBySlug,
  comment,
  uploadImageController,
};
