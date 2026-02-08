import { IPost } from "./post.interface"
import { IResponse } from "../../constants"
import { generalMessages } from "../../core/messages"
import { queryConstructor } from "../../utils"
import { postMessages } from "./post.messages"
import PostRepository from "./post.repository"
import slugify from "slugify"

export default class PostService {
  static async createPost(
    payload: Pick<IPost, "title" | "content" | "tags" | "status">,
    user: any,
  ): Promise<IResponse> {
    const slug = slugify(payload.title, { lower: true, strict: true })

    const existing = await PostRepository.validatePost({ slug })
    if (existing) return { success: false, msg: postMessages.POST_EXISTS }

    const post = await PostRepository.createPost({
      ...payload,
      slug,
      author: user._id,
    })

    if (!post)
      return { success: false, msg: generalMessages.UNEXPECTED_FAILURE }

    return {
      success: true,
      msg: postMessages.CREATE_SUCCESS,
      data: post,
    }
  }

  static async fetchPostsService(query: Partial<IPost>) {
    const { error, params, limit, skip, sort } = queryConstructor(
      query,
      "createdAt",
      "Posts",
    )

    if (error) return { success: false, msg: error }

    const posts = await PostRepository.fetchPostsByParams({
      ...params,
      limit,
      skip,
      sort,
    })

    if (posts.length < 1)
      return { success: false, msg: postMessages.NOT_FOUND, data: [] }

    return {
      success: true,
      msg: postMessages.FETCH_SINGLE_SUCCESS,
      data: posts,
    }
  }

  static async fetchSinglePostService(slug: string) {
    const post = await PostRepository.fetchSinglePost({
      slug,
      status: "published",
      deletedAt: null,
    })

    if (!post) return { success: false, msg: postMessages.NOT_FOUND }

    return {
      success: true,
      msg: postMessages.FETCH_SUCCESS,
      data: post,
    }
  }

  static async updatePostService(
    postId: string,
    payload: Partial<IPost>,
    user: any,
  ) {
    const post = await PostRepository.fetchPost({ _id: postId })

    if (!post) return { success: false, msg: postMessages.NOT_FOUND }
    if (post.author.toString() !== user._id)
      return { success: false, msg: postMessages.UNAUTHORIZED }

    await PostRepository.updatePost({ _id: postId }, { $set: payload })

    return { success: true, msg: postMessages.UPDATE_SUCCESS }
  }

  static async deletePostService(postId: string, user: any) {
    const post = await PostRepository.fetchPost({ _id: postId })

    if (!post) return { success: false, msg: postMessages.NOT_FOUND }
    if (post.author.toString() !== user._id)
      return { success: false, msg: postMessages.UNAUTHORIZED }

    await PostRepository.updatePost(
      { _id: postId },
      { $set: { deletedAt: new Date() } },
    )

    return { success: true, msg: postMessages.DELETE_SUCCESS }
  }
}
