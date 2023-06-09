import { Router } from "express";
import { login } from "../controllers/admin.controller";
import verifyToken from "../middlewares/verifyToken";

const router = Router();

router.route("/login").post(login);


router.route('/upload')
router.route('getResource/:type')

export default router;
