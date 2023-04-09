import { NextFunction, Request, Response } from "express";
import Joi from "joi";

const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validate = schema.validate(req.body);

    if (validate.error)
      return res.status(400).send(validate.error?.details[0].message);
    next();
  };
};

export default validate;
