import { NextFunction, Request, Response } from "express";
import { JwtPayload } from "jsonwebtoken";

declare global {
  namespace Express {
    interface Request {
      user: any | JwtPayload;
    }
  }
}

const verifyRole =
  (...roles: string[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    const { role } = req.user;
    console.log(req.user);
    
    
    if (!roles.includes(role)) {
      return res
        .status(403)
        .json({ success: false, message: "You are not authorized" });
    }

    next();
  };

export default verifyRole;
