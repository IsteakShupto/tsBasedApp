"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function middleware(req, res, next) {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith("Bearer ")) {
        return res.status(400).json({
            message: "Please provide correct credentials.",
        });
    }
    const jwtToken = authToken.split(" ")[1];
    const decoded = jsonwebtoken_1.default.verify(jwtToken, config_1.JWT_SECRET);
    if (decoded.userId) {
        req.userId = decoded.userId;
        next();
    }
    else {
        res.status(403).json({
            message: "You are not logged in!",
        });
    }
}
exports.default = middleware;
