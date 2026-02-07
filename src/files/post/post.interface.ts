export interface IPost {
  _id?: any
  title: string
  slug: string
  content: string
  author: any
  status: "draft" | "published"
  tags?: string[]
  deletedAt?: Date | null
  createdAt?: Date
  updatedAt?: Date
}
