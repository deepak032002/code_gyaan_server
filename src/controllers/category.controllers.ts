import { Request, Response } from "express";
import Category from "../db/models/category.model";

export const addCategory = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) return res.status(400).send("Name is required");

    const category = new Category({
      name: req.body.name,
    });

    const isSaveTag = await category.save();

    if (!isSaveTag) return res.status(400).send("Something went wrong");

    return res.status(200).send({ category });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getCategory = async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();

    if (!categories) return res.status(400).send("Something went wrong");

    return res.status(200).send({ categories });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) return res.status(400).send("Something went wrong");

    return res.status(200).send({ category });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
