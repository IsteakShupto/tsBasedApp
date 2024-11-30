"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const express_1 = __importDefault(require("express"));
const middleware_1 = __importDefault(require("../middleware"));
const zod_1 = require("zod");
const todoRouter = express_1.default.Router();
const prisma = new client_1.PrismaClient();
// get all the todos
todoRouter.get("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const todos = yield prisma.todo.findMany({
        where: {
            authorId: req.userId,
        },
    });
    res.json({
        todos: todos,
    });
}));
const postTodoBody = zod_1.z.object({
    title: zod_1.z.string(),
    content: zod_1.z.string(),
    published: zod_1.z.boolean(),
});
// create todos
todoRouter.post("/", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = postTodoBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Please provide correct types of inputs.",
        });
    }
    const createTodo = yield prisma.todo.create({
        data: {
            title: req.body.title,
            content: req.body.content,
            published: req.body.published,
            authorId: req.userId,
        },
    });
    res.json({
        message: "Congrats! You have successfully created your todo!",
    });
}));
const todoUpdateBody = zod_1.z.object({
    id: zod_1.z.number(),
    published: zod_1.z.boolean(),
});
// editing todo
todoRouter.put("/edit", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = todoUpdateBody.safeParse(req.body);
    if (!success) {
        return res.status(400).json({
            message: "Please provide correct types of inputs!",
        });
    }
    const edit = yield prisma.todo.update({
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
}));
// deleting a todo
todoRouter.delete("/delete", middleware_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const deleteTodo = yield prisma.todo.delete({
        where: {
            id: req.body.id,
            authorId: req.userId,
        },
    });
    res.json({
        message: "Your todo has been deleted!",
    });
}));
exports.default = todoRouter;
