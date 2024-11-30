import { PrismaClient } from "@prisma/client";
import express from "express";
import { JWT_SECRET } from "../config";
import jwt from "jsonwebtoken";
import { z } from "zod";

const prisma = new PrismaClient();

const userRouter = express.Router();

const signinBody = z.object({
  email: z.string().email(),
  name: z.string(),
});

userRouter.post("/signin", async (req, res) => {
  const { success } = signinBody.safeParse(req.body);

  if (!success) {
    res.status(400).json({
      message: "Please provide correct types of inputs.",
    });
  }

  const signin = await prisma.user.create({
    data: {
      email: req.body.email,
      name: req.body.name,
    },
  });

  const token = jwt.sign({ userId: signin.id }, JWT_SECRET);

  res.json({
    message: "You have successfully opened an account",
    token: token,
  });
});

export default userRouter;
