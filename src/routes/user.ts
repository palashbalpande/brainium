import { Router, Request, Response } from "express";
import { userModel } from "../models/user";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { validateSignupSchema } from "../middlewares/validateSignupSchema";
import { SignupBody, userSignupSchema } from "../schemas/userSignupSchema";

export const userRouter = Router();

userRouter.post(
  "/signup",
  validateSignupSchema,
  async (req: Request, res: Response) => {
    const validation = userSignupSchema.safeParse(req.body);

    const { username, email, password } = req.body as SignupBody;

    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      await userModel.create({
        username,
        email,
        password: hashedPassword,
      });
      res.status(201).json({ message: "Signup Succeded" });
    } catch (err) {
      console.error("Error during signup: ", err);
      res.status(409).json({
        message: "User Already exists",
        error: err instanceof Error ? err.message : "Unknown Error",
      });
    }
  }
);

userRouter.post("/signin", async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "Invalid Credentials" });
      return;
    }

    if (user && user.password) {
      const isPasswordCorrect = await bcrypt.compare(password, user.password);
      if (!isPasswordCorrect) {
        res.status(400).json({ message: "Invalid Creds" });
        return;
      }
    }

    if (process.env.JWT_USER_CODE) {
      const token = jwt.sign({ id: user._id }, process.env.JWT_USER_CODE);
      res.json({ mesage: "Login Succeeded", token });
    } else {
      console.error("JWT_USER_CODE is undefined");
      res.status(500).json({ message: "Internal Server Error" });
    }
  } catch (err) {
    console.error("Error login: ", err);
    res.status(400).json({
      message: "Login Failed",
      error: err instanceof Error ? err.message : "Unknown Error",
    });
  }
});
