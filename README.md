# Blog API (TypeScript, Express, MongoDB)

A clean, production‑style **Blog REST API** built with **Node.js, Express, TypeScript, MongoDB, and Mongoose**.
This project was implemented as part of the **Nobzo Ent. Backend Technical Evaluation** and focuses on **clean architecture, authentication, authorization, validation, and maintainable code structure**.

The codebase strictly follows a **Controller → Service → Repository** pattern with:

- centralized response handling
- centralized error handling
- schema‑based request validation (`express-validator`)
- JWT authentication

---

## 📌 Features

### Authentication

- User registration
- User login
- JWT‑based authentication

### Authorization

- Any authenticated user can create posts
- Only the **author** of a post can update or delete it
- Public users can only view **published** posts
- Authenticated users may view **their own drafts**

### Blog Posts

- Create blog posts (draft or published)
- Update posts (author‑only)
- Soft delete posts (author‑only)
- Fetch published posts publicly
- Fetch a single post by slug

### Filtering & Pagination

- Pagination (`page`, `limit`)
- Search by title or content
- Filter by tag
- Filter by author
- Filter by status (authenticated users only)

---

## 🧱 Tech Stack

- **Node.js**
- **Express.js**
- **TypeScript**
- **MongoDB**
- **Mongoose**
- **JWT (JSON Web Tokens)**
- **express-validator**

---

## 📁 Project Structure

```bash
src/
│
├── core/
│   ├── response.ts          # Centralized response handler
│   └── messages.ts          # General system messages
│
├── constants/
│   ├── statusCode.ts
│   └── pagination.ts
│
├── middlewares/
│   ├── auth.middleware.ts   # JWT authentication middleware
│   └── error.middleware.ts  # Centralized error handling
│
├── modules/
│   ├── auth/
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   └── auth.routes.ts
│   │
│   ├── user/
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── user.repository.ts
│   │   ├── user.model.ts
│   │   ├── user.interface.ts
│   │   └── user.messages.ts
│   │
│   └── post/
│       ├── post.controller.ts
│       ├── post.service.ts
│       ├── post.repository.ts
│       ├── post.model.ts
│       ├── post.interface.ts
│       └── post.messages.ts
│
├── validations/
│   ├── validate.ts
│   ├── user.validation.ts
│   └── post.validation.ts
│
├── utils/
│   ├── error.ts             # CustomError class
│   ├── manageAsyncOps.ts    # Async handler helper
│   └── queryConstructor.ts
│
├── app.ts
└── server.ts
```

---

## 🧑‍💻 Data Models

### User

```ts
{
  name: string
  email: string(unique)
  password: string(hashed)
  createdAt: Date
}
```

### Post

```ts
{
  title: string
  slug: string (unique, generated from title)
  content: string
  author: ObjectId (ref User)
  status: 'draft' | 'published'
  tags: string[]
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
}
```

---

## 🔐 Authentication

JWT is used for authentication.

### Register

```
POST /api/user/register
```

### Login

```
POST /api/user/login
```

The JWT token must be sent in the `Authorization` header:

```
Authorization: Bearer <token>
```

---

## 📝 Post Endpoints

### Create Post (Auth required)

```
POST /api/post
```

### Get Public Posts (Published or draft using query params)

```
GET /api/postt?status=draft&page=1&limit=10
```

### Get Single Published Post

```
GET /api/post/:slug
```

### Update Post (Author only)

```
PUT /api/post/:id
```

### Delete Post – Soft Delete (Author only)

```
DELETE /api/post/:id
```

---

## 🔍 Filtering

`GET /api/post` supports:

| Query Param | Description                          |
| ----------- | ------------------------------------ |
| page        | Page number                          |
| limit       | Results per page                     |
| search      | Search in title or content           |
| tag         | Filter by tag                        |
| author      | Filter by author ID                  |
| status      | draft or published (auth users only) |

---

## ✅ Validation

All incoming requests are validated using **express-validator** schemas:

- `user.validation.ts`
- `post.validation.ts`

Validation is applied using a centralized `validate()` middleware.

---

## ⚠️ Error Handling

- Centralized error middleware
- Consistent error format
- Custom `CustomError` class
- Proper HTTP status codes

---

## ⚙️ Environment Variables

Create a `.env` file using `.env.example`:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/blog-api
JWT_SECRET=your_jwt_secret
TOKEN_EXPIRE_IN=jwt_expiry
```

---

## 🚀 Setup Instructions

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

---

## 📬 Sample Requests

### Create Post (Authenticated)

```json
{
  "title": "My First Blog Post",
  "content": "This is the content of the post",
  "status": "published",
  "tags": ["tech", "nodejs"]
}
```

### Success Response

```json
{
  "success": true,
  "msg": "Post created successfully",
  "data": { ... }
}
```

---

## 📦 Submission

- Public GitHub repository
- Includes:

  - Source code
  - `package.json`
  - `.env.example`
  - `README.md`
