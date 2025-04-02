import { Router, Request, Response } from "express";
import { contentModel } from "../models/content";
import { userMiddleware } from "../middlewares/user";
import mongoose from "mongoose";

export const contentRouter = Router();

contentRouter.post(
  "/add",
  userMiddleware,
  async (req: Request, res: Response) => {
    const title = req.body.title;
    const link = req.body.link;

    await contentModel.create({
      title,
      link,
      //tags: [],
      userId: req.userId,
    });
    res.json({
      message: "Content Added",
    });
  }
);

contentRouter.get(
  "/view",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      const userId = req.userId;
      const content = await contentModel
        .find({ userId: userId })
        .populate("userId", "username");
      res.json({
        content,
      });
    } catch (err) {
      res.status(500).json({ message: "Error fetching content", error: err });
    }
  }
);

contentRouter.delete(
  "/del",
  userMiddleware,
  async (req: Request, res: Response) => {
    try {
      if(!mongoose.Types.ObjectId.isValid(req.body.contentId)) {
        res.status(400).json({ message: "Invalid contentId" });
        return;
      }
      const contentId = new (mongoose.Types.ObjectId as any)(req.body.contentId);
      const userId = req.userId;
      const result = await contentModel.deleteOne({
        _id: contentId,
        userId: userId,     
      });
      if (result.deletedCount === 0) {
        res.status(404).json({ message: "Content not found" });
        return;
      }
      res.json({
        message: "Deleted",
      });
    } catch (err) {
      res.status(500).json({ message: "Error deleting content", error: err });
    }
  }
);
