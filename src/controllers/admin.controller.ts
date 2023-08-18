import { Request, Response } from "express";

export const login = async (req: Request, res: Response) => {
  res.send("login");
};

export const changeRole = async (req: Request, res: Response) => {
  try {
    res.send("login");
  } catch (error) {
    console.log(error);
  }
};
