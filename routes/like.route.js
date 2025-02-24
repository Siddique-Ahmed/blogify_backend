import {Router} from "express"
import { likePost } from "../controllers/like.controller.js";
import isAuthorizedUser from "../middleware/authorized.user.js";

const routes = Router()

routes.route("/like/:id").post(isAuthorizedUser,likePost)

export default routes