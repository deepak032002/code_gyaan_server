import { Router } from "express";
import verifyToken from "../middlewares/verifyToken";
import { addTag, getTag, getTagbyId } from "../controllers/tag.controller";
import { verifyRole } from "../middlewares";

const router = Router();

router
  .route("/")
  .post(verifyToken, verifyRole("admin", "writer"), addTag)
  .get(getTag);
router.route("/:id").get(getTagbyId);

export default router;
