import { Request, Response } from "express";
import Blog from "../db/models/blog.model";
import Comment from "../db/models/comment.model";
import { AuthenticatedRequest } from "../types/express";
import uploadImage from "../middlewares/uploadImage";

const getBlogs = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const itemPerPage = parseInt(req.query.item_per_page as string) || 10;

    let condition = {
      is_deleted: false,
      $or: [
        { title: { $regex: req.query.search as string, $options: 'i' } }
        // Add additional conditions here if needed
      ]
    }

    const blogData = await Blog.find(condition)
      .select("-is_deleted")
      .populate("author", "name email avtar")
      .populate("tags", "name")
      .populate("comment", "name email content")
      .populate("category", "name")
      .skip((page - 1) * itemPerPage)
      .limit(itemPerPage)
      .sort({ createdAt: -1 })


    const totalItem = await Blog.countDocuments(condition)
    const totalPage = Math.ceil(totalItem / itemPerPage);

    if (blogData.length === 0) {
      return res
        .status(200)
        .send({
          message: "No Blogs Found",
          results: blogData,
          totalItem,
          page: page,
          totalPage,
        });
    }

    return res
      .status(200)
      .send({
        message: "Success",
        results: blogData,
        totalItem,
        page: page,
        totalPage,
      });
  } catch (error) {
    console.log(error);

    return res
      .status(500)
      .send({ message: "Something went wrong!", error, success: false });
  }
};

const postBlog = async (req: Request, res: Response) => {
  try {
    const {
      title,
      content,
      description,
      tags,
      category,
      meta_title,
      meta_description,
    } = req.body;

    let banner;

    if (req.file) {
      banner = await uploadImage(req.file as Express.Multer.File);
    }

    if (!banner?.secure_url) {
      return res
        .status(400)
        .send({ message: "Something went wrong with banner upload!" });
    }

    const isUnique = await Blog.isTitleUnique(title);

    if (isUnique) {
      return res.status(400).send({ message: "Title already exists!" });
    }

    const blog = new Blog({
      title,
      content,
      description,
      tags: typeof tags === "string" ? JSON.parse(tags) : tags,
      meta_title,
      category: category,
      meta_description,
      banner: banner.secure_url,
      author: (req as AuthenticatedRequest).user.id,
    });

    const isBlog = await blog.save();

    if (!isBlog) {
      return res.status(400).send({ message: "Something went wrong!" });
    }

    return res
      .status(201)
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
    let banner;

    if (req.file) {
      banner = await uploadImage(req.file as Express.Multer.File);
    }

    if (req.body.title) {
      const isUnique = await Blog.isTitleUnique(req.body.title);

      if (isUnique) {
        return res.status(400).send({ message: "Title already exists!" });
      }
    }

    const isUpdateBlog = await Blog.findOneAndUpdate(
      { slug: req.params.slug },
      { banner: banner?.secure_url, ...req.body },
      { new: true },
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
    const isDeleteBlog: any = await Blog.findOne({
      slug: req.params.slug,
    });

    if (!isDeleteBlog) {
      return res.status(400).send({ message: "Something went wrong!" });
    }
    isDeleteBlog.is_deleted = true;
    await isDeleteBlog.save();

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
    const blogData = await Blog.findOne({
      slug: req.params.slug,
      is_deleted: { $eq: false },
    })
      .select("-is_deleted -is_published")
      .populate("author", "name email avtar")
      .populate("tags", "name")
      .populate("comment", "name email content")
      .populate("category", "name")

    if (!blogData) {
      return res
        .status(500)
        .send({ message: "Blog not found", results: {} });
    }
    return res.status(200).send({ message: "Success", results: blogData });
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
      user: (req as AuthenticatedRequest).user.id,
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
    if (!req.file)
      return res
        .status(400)
        .send({ message: "[upload] is required field", success: false });

    const upload = await uploadImage(req.file as Express.Multer.File);

    return res.status(200).send({ message: "Success", url: upload.secure_url });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
};

const publishBlog = async (req: Request, res: Response) => {
  try {
    const blogById = await Blog.findById(req.params.id)
    if (!blogById) return res.status(404).send({ message: 'Blog Not found', success: false })
    const isPublish = !blogById?.is_published
    blogById.is_published = isPublish

    await blogById.save()
    return res.status(200).send({ message: `Successfully ${isPublish ? "published!" : "unpublished!"}`, success: true });
  } catch (error) {
    console.log(error);
    return res.status(500).send("Something went wrong!");
  }
}

export {
  getBlogs,
  postBlog,
  patchBlog,
  deleteBlog,
  getBlogBySlug,
  comment,
  uploadImageController,
  publishBlog
};
