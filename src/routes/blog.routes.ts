import { Router } from "express";
import {
  getBlogs,
  postBlog,
  patchBlog,
  deleteBlog,
  getBlogBySlug,
  comment,
  uploadImageController,
} from "../controllers/blog.controller";
import { upload, validate, verifyRole, verifyToken } from "../middlewares";
import { blogValidateSchema } from "../utils/joi.schema";

const router = Router();

router
  .route("/")
  .get(getBlogs)
  .post(
    upload.single("banner"),
    verifyToken,
    verifyRole("writer", "admin"),
    validate(blogValidateSchema),
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

router
  .route("/upload-image")
  .post(
    verifyToken,
    upload.single("upload"),
    uploadImageController
  );

router.route("/comment").post(verifyToken, comment);

export default router;
