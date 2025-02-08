"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var client_1 = require("@prisma/client");
var db = global.prisma ||
    new client_1.PrismaClient({
        log: [
            {
                emit: "event",
                level: "query",
            },
            {
                emit: "stdout",
                level: "error",
            },
            {
                emit: "stdout",
                level: "info",
            },
            {
                emit: "stdout",
                level: "warn",
            },
        ],
    });
if (process.env.NODE_ENV !== "production")
    global.prisma = db;
exports.default = db;
