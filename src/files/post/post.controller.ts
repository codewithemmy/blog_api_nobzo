import { NextFunction, Response, Request } from "express"
import { responseHandler } from "../../core/response"
import { manageAsyncOps } from "../../utils"
import { CustomError } from "../../utils/error"
import PostService from "./post.service"
import { statusCode } from "../../constants/statusCode"

class PostController {
  async createPost(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      PostService.createPost(req.body, res.locals.jwt),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.CREATED, data)
  }

  async fetchPostsController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      PostService.fetchPostsService(req.query, res.locals.jwt),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.SUCCESS, data)
  }

  async fetchSinglePostController(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    const [error, data] = await manageAsyncOps(
      PostService.fetchSinglePostService(req.params.slug),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.SUCCESS, data)
  }

  async updatePostController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      PostService.updatePostService(req.params.id, req.body, res.locals.jwt),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.SUCCESS, data)
  }

  async deletePostController(req: Request, res: Response, next: NextFunction) {
    const [error, data] = await manageAsyncOps(
      PostService.deletePostService(req.params.id, res.locals.jwt),
    )

    if (error) return next(error)
    if (!data?.success) return next(new CustomError(data!.msg, 400, data!))
    return responseHandler(res, statusCode.SUCCESS, data)
  }
}

export default new PostController()
