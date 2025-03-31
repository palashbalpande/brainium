import { Request, Response, NextFunction } from "express";
import { userSignupSchema } from "../schemas/userSignupSchema";

export const validateSignupSchema = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validation = userSignupSchema.safeParse(req.body);
  if (!validation.success) {
    res.status(400).json({
      message: "Incorrect Data format",
      error: validation.error?.format(),
    });
    return;
  }
  next();
};
