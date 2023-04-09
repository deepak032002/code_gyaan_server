import { Router } from "express";
import { login } from "../controllers/admin.controller";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.route("/login").post(login);

export default router;
