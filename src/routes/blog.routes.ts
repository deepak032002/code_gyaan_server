import { Router } from "express";
import multer from "multer";
import {
  getBlogs,
  postBlog,
  patchBlog,
  deleteBlog,
  getBlogBySlug,
  comment,
} from "../controllers/blog.controller";
import { uploadImage, validate, verifyRole, verifyToken } from "../middlewares";
import { blogValidateSchema } from "../utils/joi.schema";

const router = Router();

router.use(multer().single("banner"));

router
  .route("/")
  .get(getBlogs)
  .post(
    verifyToken,
    verifyRole("writer", "admin"),
    validate(blogValidateSchema),
    uploadImage,
    postBlog
  );

router
  .route("/:slug")
  .patch(verifyToken, verifyRole("writer", "admin"), patchBlog)
  .put(
    verifyToken,
    verifyRole("writer", "admin"),
    validate(blogValidateSchema),
    patchBlog
  )
  .delete(verifyToken, verifyRole("writer", "admin"), deleteBlog)
  .get(getBlogBySlug);

router.route("/comment").post(verifyToken, comment);

export default router;
