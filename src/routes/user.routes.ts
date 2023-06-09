import { Router } from "express";
import { userGet, signup, login } from "../controllers/user.controllers";
import { upload, validate } from "../middlewares";
import verifyToken from "../middlewares/verifyToken";
import { userValidateSchema } from "../utils/joi.schema";
const router = Router();

router.route("/").get(verifyToken, userGet);
router
  .route("/signup")
  .post(upload.single("avtar"), validate(userValidateSchema), signup);
router.route("/login").post(login);

export default router;
