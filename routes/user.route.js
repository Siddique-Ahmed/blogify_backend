import { Router } from "express";
import {
  register,
  login,
  logout,
  updateProfile,
  getProfile,
} from "../controllers/user.controller.js";
import isAuthorizedUser from "../middleware/authorized.user.js";

const routes = Router();


routes.route("/register").post(register);
routes.route("/login").post(login);
routes.route("/logout").post(logout);
routes.route("/update-profile/:id").put(isAuthorizedUser,updateProfile);
routes.route("/profile/:id").get(isAuthorizedUser,getProfile);

export default routes;
