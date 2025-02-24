import { Router } from "express";
import {
  createComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js"
import isAuthorizedUser from "../middleware/authorized.user.js";

const routes = Router();

routes.route("/create-comment").post(isAuthorizedUser,createComment);
routes.route("/update-comment/:id").put(isAuthorizedUser,updateComment);
routes.route("delete/:id").delete(isAuthorizedUser,deleteComment)

export default routes