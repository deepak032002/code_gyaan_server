import { Router } from "express";
import multer from "multer";
import { userGet, signup, login } from "../controllers/user.controllers";
import { uploadImage, validate } from "../middlewares";
import verifyToken from "../middlewares/verifyToken";
import { userValidateSchema } from "../utils/joi.schema";
const router = Router();

router.use(multer({}).single("avtar"));


router.route("/").get(verifyToken, userGet);
router.route("/signup").post(validate(userValidateSchema), uploadImage, signup);
router.route("/login").post(login);

export default router;
