import { PrismaClient } from "@prisma/client";
// express library builder ra express ke default bhabe export korse, ejonnow amader import nicher moto hoise
import express from "express";
import middleware from "../middleware";
// zod library builder ra bibhinno object alada alada kore export korse without using default, shejonnow amake ebhabe zod ke import korte hoise
import { z } from "zod";

const todoRouter = express.Router();
const prisma = new PrismaClient();

// get all the todos
todoRouter.get("/", middleware, async (req: any, res: any) => {
  const todos = await prisma.todo.findMany({
    where: {
      authorId: req.userId,
    },
  });

  res.json({
    todos: todos,
  });
});

// used zod validation
const postTodoBody = z.object({
  title: z.string(),
  content: z.string(),
  published: z.boolean(),
});

// create todos
todoRouter.post("/", middleware, async (req: any, res: any) => {
  const { success } = postTodoBody.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Please provide correct types of inputs.",
    });
  }

  const createTodo = await prisma.todo.create({
    data: {
      title: req.body.title,
      content: req.body.content,
      published: req.body.published,
      authorId: req.userId,
    },
  });

  res.json({
    message: `Congrats! You have successfully created your todo, ${createTodo.id}`,
  });
});

const todoUpdateBody = z.object({
  id: z.number(),
  published: z.boolean(),
});

// editing todo
todoRouter.put("/edit", middleware, async (req: any, res: any) => {
  const { success } = todoUpdateBody.safeParse(req.body);

  if (!success) {
    return res.status(400).json({
      message: "Please provide correct types of inputs!",
    });
  }

  const edit = await prisma.todo.update({
    where: {
      id: req.body.id,
      authorId: req.userId,
    },
    data: {
      published: req.body.published,
    },
  });

  res.json({
    message: "You have successfully updated your todo.",
  });
});

// deleting a todo
todoRouter.delete("/delete", middleware, async (req: any, res: any) => {
  const deleteTodo = await prisma.todo.delete({
    where: {
      id: req.body.id,
      authorId: req.userId,
    },
  });

  res.json({
    message: "Your todo has been deleted!",
  });
});

export default todoRouter;
