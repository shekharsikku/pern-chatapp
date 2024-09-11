"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const path_1 = __importDefault(require("path"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const message_route_1 = __importDefault(require("./routes/message.route"));
const dotenv_1 = __importDefault(require("dotenv"));
const socket_1 = require("./socket/socket");
dotenv_1.default.config();
const PORT = process.env.VITE_PORT;
socket_1.app.use((0, cookie_parser_1.default)());
socket_1.app.use(express_1.default.json());
socket_1.app.use("/api/auth", auth_route_1.default);
socket_1.app.use("/api/messages", message_route_1.default);
if (process.env.NODE_ENV !== "development") {
    const __dirname = path_1.default.resolve();
    socket_1.app.use(express_1.default.static(path_1.default.join(__dirname, "/client/dist")));
    socket_1.app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "client/dist", "index.html"));
    });
}
socket_1.server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
