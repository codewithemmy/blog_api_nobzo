import express from "express"
import postController from "./post.controller"
import { checkSchema } from "express-validator"
import validate from "../../validations/validate"
import { isAuthenticated } from "../../utils"
import {
  createPostValidation,
  updatePostValidation,
} from "../../validations/post/post.validation"

const PostRoute = express.Router()

const {
  createPost,
  fetchPostsController,
  fetchSinglePostController,
  updatePostController,
  deletePostController,
} = postController

PostRoute.post(
  "/",
  isAuthenticated,
  validate(checkSchema(createPostValidation)),
  createPost,
)

PostRoute.get("/", fetchPostsController)
PostRoute.get("/:slug", fetchSinglePostController)

PostRoute.put(
  "/:id",
  isAuthenticated,
  validate(checkSchema(updatePostValidation)),
  updatePostController,
)

PostRoute.delete("/:id", isAuthenticated, deletePostController)

export default PostRoute
