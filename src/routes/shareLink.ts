import { Request, Response, Router } from "express";
import { userMiddleware } from "../middlewares/user";
import { linkModel } from "../models/Link";
import { randomFn } from "../utils";
import { contentModel } from "../models/content";
import { userModel } from "../models/user";

export const shareLinkRouter = Router();

shareLinkRouter.post(
  "/share",
  userMiddleware,
  async (req: Request, res: Response) => {
    const share = req.body.share;
    if (share) {
      const existingLink = await linkModel.findOne({
        userId: req.userId,
      });
      if (existingLink) {
        res.json({
          hash: existingLink.hash,
        });
        return;
      }
      const hash = randomFn(10);
      await linkModel.create({
        userId: req.userId,
        hash: hash,
      });
      res.json({
        message: "/share/" + hash,
      });
    } else {
      await linkModel.deleteOne({
        userId: req.userId,
      });
      res.json({
        message: "Removed link",
      });
    }
  }
);

shareLinkRouter.get("/:shareLink", async (req: Request, res: Response) => {
  const hash = req.params.shareLink;
  const link = await linkModel.findOne({
    hash,
  });
  if (!link) {
    res.status(411).json({
      message: "Incorrect input",
    });
    return;
  }
  const content = await contentModel.find({
    userId: link.userId,
  });
  const user = await userModel.findOne({
    _id: link.userId,
  });
  if (!user) {
    res.status(411).json({
      message: "User not found",
    });
    return;
  }
  res.json({
    username: user?.username, // either use optional chaining or early return using if(!user)
    content: content,
  });
});
