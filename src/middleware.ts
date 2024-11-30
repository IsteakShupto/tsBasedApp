import { JWT_SECRET } from "./config";

import jwt, { JwtPayload } from "jsonwebtoken";

interface decoded extends JwtPayload {
  userId: number;
}

export default function middleware(req: any, res: any, next: any) {
  const authToken = req.headers.authorization;

  if (!authToken || !authToken.startsWith("Bearer ")) {
    return res.status(400).json({
      message: "Please provide correct credentials.",
    });
  }
  const jwtToken = authToken.split(" ")[1];

  const decoded = jwt.verify(jwtToken, JWT_SECRET) as decoded;

  if (decoded.userId) {
    req.userId = decoded.userId;
    next();
  } else {
    res.status(403).json({
      message: "You are not logged in!",
    });
  }
}
