import { Router } from "express";
import * as messageController from "../controllers/message.controller";
import { isUserAuthenticated } from "../middlewares";
const router = Router();

router.route("/add").post(isUserAuthenticated, messageController.addMessage);
router.route("/fetch-messages/:id").get(isUserAuthenticated, messageController.fetchAllMessages);

export default router;
