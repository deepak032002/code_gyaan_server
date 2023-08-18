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
import { validate, verifyRole, verifyToken } from "../middlewares";
import { blogValidateSchema } from "../utils/joi.schema";
import multer from "multer";

const router = Router();
router.use(multer().single("banner"));
router
  .route("/")
  .get(getBlogs)
  .post(
    verifyToken,
    verifyRole("writer", "admin"),
    validate(blogValidateSchema),
    postBlog,
  );

router
  .route("/:slug")
  .patch(verifyToken, verifyRole("writer", "admin"), patchBlog)
  .put(
    verifyToken,
    verifyRole("writer", "admin"),
    validate(blogValidateSchema),
    patchBlog,
  )
  .delete(verifyToken, verifyRole("writer", "admin"), deleteBlog)
  .get(getBlogBySlug);

router.route("/upload-image").post(verifyToken, uploadImageController);

router.route("/comment").post(verifyToken, comment);

export default router;
