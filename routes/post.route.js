import { Router } from "express";
import {
  createPost,
  updatePost,
  deletePost,
  getUserPosts,
  getAllPosts,
  getPostById,
} from "../controllers/post.controller.js";
import isAuthorizedUser from "../middleware/authorized.user.js";
import { upload } from "../middleware/multer.js";

const routes = Router();

// ROUTES FOR POSTS

// create post route
routes
  .route("/create")
  .post(isAuthorizedUser, upload.single("postImg"), createPost);

// delete post route
routes.route("/delete/:id").delete(isAuthorizedUser, deletePost);

// update post route
routes
  .route("/update/:id")
  .put(isAuthorizedUser, upload.single("postImg"), updatePost),
  // get all post route
  routes.route("/all-post").get(isAuthorizedUser, getAllPosts);

// get user post route
routes.route("/post/:id").get(isAuthorizedUser, getUserPosts);

// get post by id route
routes.route("/get-post/:id").get(isAuthorizedUser, getPostById);

export default routes