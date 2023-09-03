import { Router } from "express";
import {
  getBlogs,
  postBlog,
  patchBlog,
  deleteBlog,
  getBlogBySlug,
  comment,
  uploadImageController,
  publishBlog,
  getAllPublishBlog,
} from "../controllers/blog.controller";
import { validate, verifyRole, verifyToken } from "../middlewares";
import { blogValidateSchema } from "../utils/joi.schema";
import multer from "multer";

const router = Router();

router
  .route("/")
  .get(
    verifyToken,
    verifyRole("writer", "admin"),
    getBlogs
  )
  .post(
    verifyToken,
    verifyRole("writer", "admin"),
    multer().single("banner"),
    validate(blogValidateSchema),
    postBlog,
  );

router.route('/getPublishBlog').get(getAllPublishBlog)

router
  .route("/:slug")
  .patch(
    verifyToken,
    verifyRole("writer", "admin"),
    multer().single("banner"),
    patchBlog,
  )
  .put(
    verifyToken,
    verifyRole("writer", "admin"),
    multer().single("banner"),
    validate(blogValidateSchema),
    patchBlog,
  )
  .delete(verifyToken, verifyRole("writer", "admin"), deleteBlog)
  .get(getBlogBySlug);

router.route('/publish-blog/:id').patch(verifyToken, verifyRole('writer', 'admin'), publishBlog)

router
  .route("/upload-image")
  .post(verifyToken, multer().single("upload"), uploadImageController);

router.route("/comment").post(verifyToken, comment);

export default router;
