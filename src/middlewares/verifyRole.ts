import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest } from "../types/express";

const verifyRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { role } = (req as AuthenticatedRequest).user;
    if (!roles.includes(role)) {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
    }

    next();
  };

export default verifyRole;
