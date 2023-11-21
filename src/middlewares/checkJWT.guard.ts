import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
export function checkJWt(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const token = req.cookies?.accessToken;
  const secretKey = process.env?.ACCESS_TOKEN_SECRET_KEY;

  if (req.url.includes("login") || req.url.includes("signup")) {
    next();
    return;
  }
  if (!secretKey) throw new Error("secret key is not set in env");
  if (!token) {
    res.status(401).send("Unauthorized");
    return;
  }

  jwt.verify(token, secretKey, { complete: true }, (err, suc) => {
    if (err) {
      res.status(401).send("Token expired");
      return;
    } else next();
  });
}
