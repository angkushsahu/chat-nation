import { Router } from "express";
import * as chatController from "../controllers/chat.controller";
import { isUserAuthenticated } from "../middlewares";
const router = Router();

router.route("/access-chat").post(isUserAuthenticated, chatController.accessChat);
router.route("/fetch-chats/:id").get(isUserAuthenticated, chatController.fetchAllUserChats);
router.route("/group-chat/:id").get(isUserAuthenticated, chatController.getGroupChat);
router.route("/create-group-chat").post(isUserAuthenticated, chatController.createGroupChat);
router.route("/rename-group").put(isUserAuthenticated, chatController.renameGroup);
router.route("/add-to-group").put(isUserAuthenticated, chatController.addToGroup);
router.route("/remove-from-group").put(isUserAuthenticated, chatController.removeFromGroup);
router.route("/remove-logo").put(isUserAuthenticated, chatController.removeGroupLogo);
router.route("/add-logo").put(isUserAuthenticated, chatController.addGroupLogo);
router.route("/delete").delete(isUserAuthenticated, chatController.deleteGroup);

export default router;
