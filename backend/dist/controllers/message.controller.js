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
exports.getUsersForSidebar = exports.getMessages = exports.sendMessage = void 0;
const prisma_1 = __importDefault(require("../db/prisma"));
const socket_1 = require("../socket/socket");
const sendMessage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message } = req.body;
        const { id: receiverId } = req.params;
        const senderId = req.user.id;
        let conversation = yield prisma_1.default.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, receiverId],
                },
            },
        });
        // the very first message is being sent, that's why we need to create a new conversation
        if (!conversation) {
            conversation = yield prisma_1.default.conversation.create({
                data: {
                    participantIds: {
                        set: [senderId, receiverId],
                    },
                },
            });
        }
        const newMessage = yield prisma_1.default.message.create({
            data: {
                senderId,
                body: message,
                conversationId: conversation.id,
            },
        });
        if (newMessage) {
            conversation = yield prisma_1.default.conversation.update({
                where: {
                    id: conversation.id,
                },
                data: {
                    messages: {
                        connect: {
                            id: newMessage.id,
                        },
                    },
                },
            });
        }
        // Socket io will go here
        const receiverSocketId = (0, socket_1.getReceiverSocketId)(receiverId);
        if (receiverSocketId) {
            socket_1.io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);
    }
    catch (error) {
        console.error("Error in sendMessage: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.sendMessage = sendMessage;
const getMessages = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id: userToChatId } = req.params;
        const senderId = req.user.id;
        const conversation = yield prisma_1.default.conversation.findFirst({
            where: {
                participantIds: {
                    hasEvery: [senderId, userToChatId],
                },
            },
            include: {
                messages: {
                    orderBy: {
                        createdAt: "asc",
                    },
                },
            },
        });
        if (!conversation) {
            return res.status(200).json([]);
        }
        res.status(200).json(conversation.messages);
    }
    catch (error) {
        console.error("Error in getMessages: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getMessages = getMessages;
const getUsersForSidebar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authUserId = req.user.id;
        const users = yield prisma_1.default.user.findMany({
            where: {
                id: {
                    not: authUserId,
                },
            },
            select: {
                id: true,
                fullName: true,
                profilePic: true,
            },
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error("Error in getUsersForSidebar: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
});
exports.getUsersForSidebar = getUsersForSidebar;
