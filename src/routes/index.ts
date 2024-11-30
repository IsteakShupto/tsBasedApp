import express from "express";

import todoRouter from "./todo";
import userRouter from "./user";

const mainRouter = express.Router();

mainRouter.use("/todo", todoRouter);
mainRouter.use("/user", userRouter);

export default mainRouter;
