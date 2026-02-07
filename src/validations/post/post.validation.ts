export enum PostStatus {
  DRAFT = "draft",
  PUBLISHED = "published",
}

export const createPostValidation = {
  title: {
    isString: true,
    notEmpty: true,
    isLength: { options: { min: 3, max: 200 } },
  },
  content: {
    isString: true,
    notEmpty: true,
  },
  status: {
    optional: true,
    isIn: { options: [["draft", "published"]] },
  },
  tags: {
    optional: true,
    isArray: true,
  },
  "tags.*": {
    optional: true,
    isString: true,
  },
}
export const updatePostValidation = {
  title: {
    optional: true,
    isString: true,
    isLength: { options: { min: 3, max: 200 } },
  },
  content: {
    optional: true,
    isString: true,
  },
  status: {
    optional: true,
    isIn: { options: [["draft", "published"]] },
  },
  tags: {
    optional: true,
    isArray: true,
  },
  "tags.*": {
    optional: true,
    isString: true,
  },
}
