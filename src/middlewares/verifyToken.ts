import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { AuthenticatedRequest } from "../types/express";
const SECRET_PHRASE = process.env.SECRET_PHRASE || "";

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token)
    return res.status(400).send({ message: "token required", success: false });

  const user = jwt.verify(token, SECRET_PHRASE) as JwtPayload;

  (req as AuthenticatedRequest).user = user;

  next();
};

export default verifyToken;
