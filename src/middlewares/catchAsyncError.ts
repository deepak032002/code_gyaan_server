import { NextFunction, Request, Response } from "express";

export default (
    controller: (req: Request, res: Response, next: NextFunction) => void,
  ) =>
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(controller(req, res, next)).catch(next);
  };
