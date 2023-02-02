import { Router } from "express";
import * as userController from "../controllers/user.controller";
import { isUserAuthenticated } from "../middlewares";
const router = Router();

router.route("/get-all-users").get(isUserAuthenticated, userController.getAllUsers);
router.route("/").get(isUserAuthenticated, userController.getUser);
router.route("/change-password").post(isUserAuthenticated, userController.changePassword);
router.route("/logout").get(isUserAuthenticated, userController.userLogout);
router.route("/delete").delete(isUserAuthenticated, userController.deleteUserAccount);
router.route("/update").put(isUserAuthenticated, userController.updateUserDetails);
router.route("/remove-avatar").put(isUserAuthenticated, userController.removeAvatar);
router.route("/:id").get(isUserAuthenticated, userController.visitProfile);

export default router;
