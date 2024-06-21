"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var serviceRouter = express_1.default.Router();
var serviceController_1 = __importDefault(require("../controllers/serviceController"));
serviceRouter.get('/getServices', serviceController_1.default.serviceList);
serviceRouter.post('/addService', serviceController_1.default.createService);
serviceRouter.delete('/delete-service', serviceController_1.default.deleteService);
exports.default = serviceRouter;
//# sourceMappingURL=servicRoutes.js.map