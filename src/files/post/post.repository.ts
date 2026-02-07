import Post from "./post.model"
import { IPost } from "./post.interface"
import pagination, { IPagination } from "../../constants"

const { LIMIT, SKIP, SORT } = pagination

export default class PostRepository {
  static createPost(payload: Partial<IPost>): Promise<IPost> {
    return Post.create(payload)
  }

  static async fetchPost(payload: Partial<IPost>): Promise<IPost | null> {
    return Post.findOne({ ...payload })
  }

  static async fetchSinglePost(payload: Partial<IPost>) {
    return Post.findOne({ ...payload }).populate("author", "name email")
  }

  static async validatePost(query: Partial<IPost>) {
    return Post.exists(query)
  }

  static async updatePost(
    payload: Partial<IPost>,
    update: { $set: Partial<IPost> },
  ) {
    const { lastErrorObject } = await Post.findOneAndUpdate(
      { ...payload },
      { ...update },
      { rawResult: true },
    )

    return lastErrorObject
  }

  static async fetchPostsByParams(
    payload: Partial<IPost & IPagination>,
  ): Promise<IPost[]> {
    const { limit = LIMIT, skip = SKIP, sort = SORT, ...rest } = payload

    return Post.find({ ...rest })
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate("author", "name email")
  }
}
