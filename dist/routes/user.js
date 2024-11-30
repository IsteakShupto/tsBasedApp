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
const config_1 = require("../config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
const userRouter = express_1.default.Router();
const signinBody = zod_1.z.object({
    email: zod_1.z.string().email(),
    name: zod_1.z.string(),
});
userRouter.post("/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success } = signinBody.safeParse(req.body);
    if (!success) {
        res.status(400).json({
            message: "Please provide correct types of inputs.",
        });
    }
    const signin = yield prisma.user.create({
        data: {
            email: req.body.email,
            name: req.body.name,
        },
    });
    const token = jsonwebtoken_1.default.sign({ userId: signin.id }, config_1.JWT_SECRET);
    res.json({
        message: "You have successfully opened an account",
        token: token,
    });
}));
exports.default = userRouter;
