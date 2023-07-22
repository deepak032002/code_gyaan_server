import { JwtPayload } from "jsonwebtoken";
import { Request } from "express";
// declare module 'express' {
//   interface Request {
//     user: JwtPayload
//   }
// }

export interface AuthenticatedRequest extends Request {
  user: JwtPayload;
}
