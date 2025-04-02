import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { getJwtUserCode } from "../utils/getJwtUserCode";

export const userMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const header = req.headers["authorization"];

  const JWT_USER_CODE = getJwtUserCode("JWT_USER_CODE");

  if (!header) {
    res.status(401).json({ message: "Unauthorized Header" });
    return;
  }

  let token = header; // Default to the whole header

  if (header.startsWith("Bearer ")) {
    token = header.split(" ")[1]; // Extract token if "Bearer " prefix exists
  }
  if (!token) {
    res.status(401).json({ message: "Unauthorized Token" });
    return;
  }

  try {
    const decoded = jwt.verify(token as string, JWT_USER_CODE) as JwtPayload;
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({ message: "Unauhorized" });
  }
};
