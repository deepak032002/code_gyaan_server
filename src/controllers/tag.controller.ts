import { Request, Response } from "express";
import Tag from "../db/models/tag.model";

export const addTag = async (req: Request, res: Response) => {
  try {
    if (!req.body.name) return res.status(400).send("name is required");

    const tag = new Tag({
      name: req.body.name,
    });

    const isSaveTag = await tag.save();

    if (!isSaveTag) return res.status(400).send("Something went wrong");

    return res.status(200).send({ tag });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getTag = async (req: Request, res: Response) => {
  try {
    const tags = await Tag.find();

    if (!tags) return res.status(400).send("Something went wrong");

    return res.status(200).send({ tags });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};

export const getTagbyId = async (req: Request, res: Response) => {
  try {
    const tag = await Tag.findById(req.params.id);

    if (!tag) return res.status(400).send("Something went wrong");

    return res.status(200).send({ tag });
  } catch (error) {
    return res.status(500).send("Internal Server Error");
  }
};
