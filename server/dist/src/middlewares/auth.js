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
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var UserRepository_1 = __importDefault(require("../repositories/UserRepository"));
var verifyToken = function (req, res, next) { return __awaiter(void 0, void 0, void 0, function () {
    var authorizationHeader, token, decoded, userId, user, err_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                authorizationHeader = req.headers['authorization'];
                if (!authorizationHeader) {
                    res.status(403).json({ error: 'Token not provided' });
                    return [2 /*return*/];
                }
                token = authorizationHeader.split(' ')[1];
                console.log('worked', token);
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                decoded = verify(token);
                userId = decoded.userId;
                console.log("User id ", userId);
                return [4 /*yield*/, UserRepository_1.default.findById(userId)];
            case 2:
                user = _a.sent();
                console.log('working : ', user);
                if (user === null || user === void 0 ? void 0 : user.isBlocked) {
                    return [2 /*return*/, res.status(400).json({ message: "User is blocked" })];
                }
                next();
                return [3 /*break*/, 4];
            case 3:
                err_1 = _a.sent();
                console.error('Token verification1 failed:', err_1.message);
                res.status(401).json({ error: 'Failed to authenticate token' });
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); };
var verify = function (token) {
    try {
        var decoded = jsonwebtoken_1.default.verify(token, "7e657ddd0578cdf66febd42caf0c66538e68e3d2fcb6a7621706f085588e084e");
        return decoded;
    }
    catch (err) {
        console.error('Token verification2 failed:', err.message);
        throw new Error('Token verification failed');
    }
};
exports.default = verifyToken;
//# sourceMappingURL=auth.js.map