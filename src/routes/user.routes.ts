import { Router } from "express";
import { userGet, signup, login } from "../controllers/user.controllers";
import { upload, validate } from "../middlewares";
import verifyToken from "../middlewares/verifyToken";
import { userValidateSchema } from "../utils/joi.schema";
import multer from "multer";
const router = Router();

router.use(multer().single('avtar'))

router.route("/").get(verifyToken, userGet);
router.route("/signup").post(validate(userValidateSchema), signup);
router.route("/login").post(login);

export default router;
