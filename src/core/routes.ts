import { Application } from "express"
import UserRoute from "../files/user/user.route"
import PostRoute from "../files/post/post.route"
export const routes = (app: Application) => {
  const base = "/api/v1"
  app.use(`${base}/user`, UserRoute)
  app.use(`${base}/post`, PostRoute)
}
