"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importStar(require("express"));
var cors_1 = __importDefault(require("cors"));
var userRoutes_1 = __importDefault(require("./src/routes/userRoutes"));
var db_1 = __importDefault(require("./src/config/db"));
var adminRoutes_1 = __importDefault(require("./src/routes/adminRoutes"));
var postRouter_1 = __importDefault(require("./src/routes/postRouter"));
var servicRoutes_1 = __importDefault(require("./src/routes/servicRoutes"));
var freelanceRouter_1 = __importDefault(require("./src/routes/freelanceRouter"));
var conversationRouter_1 = __importDefault(require("./src/routes/conversationRouter"));
var http_1 = require("http");
var socket_io_1 = require("socket.io");
var dotenv = __importStar(require("dotenv"));
var mongoSanitize = require("express-mongo-sanitize");
var body_parser_1 = __importDefault(require("body-parser"));
var freelanceController_1 = __importDefault(require("./src/controllers/freelanceController"));
dotenv.config();
var app = (0, express_1.default)();
var PORT = 4000;
var server = (0, http_1.createServer)(app);
var io = new socket_io_1.Server(server, {
    cors: {
        origin: "*",
    },
});
app.use(mongoSanitize());
app.use((0, cors_1.default)());
app.post('/api/webhook', express_1.default.raw({ type: 'application/json' }), freelanceController_1.default.webhook);
// app.post('/orderWebhook', bodyParser.raw({ type: 'application/json' }), freelanceController.servicePaymentByStripeWebhook);
app.use(body_parser_1.default.json({ limit: '50mb' }));
app.use(express_1.default.json());
app.use((0, express_1.json)({ limit: "50mb" }));
app.use((0, express_1.urlencoded)({ limit: "50mb", extended: true }));
app.use('/api', userRoutes_1.default);
app.use('/api', adminRoutes_1.default);
app.use('/api', postRouter_1.default);
app.use('/api', servicRoutes_1.default);
app.use('/api', conversationRouter_1.default);
app.use('/api', freelanceRouter_1.default);
var users = [];
var addUser = function (userId, socketId) {
    if (!users.some(function (user) { return user.userId === userId; })) {
        users.push({ userId: userId, socketId: socketId });
    }
};
var getUser = function (userId) {
    return users.find(function (user) { return user.userId === userId; });
};
var removeUser = function (socketId) {
    users = users.filter(function (user) { return user.socketId !== socketId; });
};
io.on("connection", function (socket) {
    socket.on("addUser", function (userId) {
        addUser(userId, socket.id);
        io.emit("getUsers", users);
    });
    // Send and get message
    socket.on("sendMessage", function (_a) { return __awaiter(void 0, [_a], void 0, function (_b) {
        var user;
        var senderId = _b.senderId, receiverId = _b.receiverId, text = _b.text, isGroup = _b.isGroup, groupId = _b.groupId;
        return __generator(this, function (_c) {
            user = getUser(receiverId);
            if (user) {
                io.to(user.socketId).emit("getMessage", {
                    senderId: senderId,
                    text: text,
                });
            }
            return [2 /*return*/];
        });
    }); });
    socket.on("like", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " liked your post"));
        var text = "".concat(currentUser.username, " liked your post");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("comment", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " commented on your post"));
        var text = "".concat(currentUser.username, "  commented on your  post");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("call", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " is calling"));
        var text = "".concat(currentUser.username, " is calling...");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("order", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " send new order"));
        var text = "".concat(currentUser.username, " send new order");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("payment", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " payment completed"));
        var text = "".concat(currentUser.username, " payment completed");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("approve", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " approved the work"));
        var text = "".concat(currentUser.username, " approved the work");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("accept", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " accepted the order"));
        var text = "".concat(currentUser.username, "  accepted the order");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("upload", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " uploaded the work"));
        var text = "".concat(currentUser.username, " uploaded the work");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("reject", function (currentUser, userId) {
        console.log("".concat(currentUser.username, " rejected the order"));
        var text = "".concat(currentUser.username, " rejected the order");
        io.emit("notification", userId, text, currentUser);
    });
    socket.on("seen", function (data) {
        console.log(data);
        console.log("MEssage seen by", data.receiverId, data.senderId, data.conversationId);
        io.emit("msgSeen", data);
    });
    socket.on("disconnect", function () {
        console.log("User disconnected", users);
        removeUser(socket.id);
        io.emit("getUsers", users);
    });
});
server.listen(PORT, function () {
    (0, db_1.default)();
    console.log("Running on port ".concat(PORT));
});
//# sourceMappingURL=server.js.map