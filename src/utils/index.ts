import { NextFunction, Response, Request } from "express"
import config from "../core/config"

import { verify, sign } from "jsonwebtoken"
import constants, { IResponse } from "../constants"
import mongoose from "mongoose"
import bcrypt from "bcrypt"

const COUNTRY_CODE = "234"

export interface UtilResponse {
  success: boolean
  msg: string
}

export interface IToken {
  _id: any
  email: string
  isAdmin: boolean
  iat: number
  exp: number
}

const messageHandler = (
  message: string,
  success: boolean,
  statusCode: number,
  data: any,
) => {
  let response = {}
  return (response = { message, success, statusCode, data })
}

const tokenHandler = (data: { _id: string; email: string }) => {
  var { _id, email } = data

  const token = sign(
    {
      _id,
      email,
    },
    config.SECRET_KEY!,
    { expiresIn: process.env.TOKEN_EXPIRE_IN },
  )
  return { token, _id, email }
}

const isAuthenticated = async (req: any, res: Response, next: NextFunction) => {
  try {
    let authToken = req.headers.authorization

    if (authToken) {
      authToken = authToken.split(" ")[1]
      const payload = await verifyToken(authToken)
      if (payload) {
        req.payload = payload
        res.locals.jwt = payload
        return next()
      }
    }

    throw new Error("Not Authorized!")
  } catch (error: any) {
    if (error.message.includes("jwt expired")) {
      error.message = "Token expired, please sign in again"
    }
    return res.status(401).json({ message: error.message })
  }
}

const verifyToken = async (token: string) => {
  try {
    return verify(token, config.SECRET_KEY!)
  } catch (error) {
    throw new Error("Unable to verify token.")
  }
}

const queryConstructor = (query: any, sortBy: string, item: string) => {
  let params: any = {}
  let array = Object.keys(query)
  for (let i = 0; i < array.length; i++) {
    const value = Object.values(query)[i] as string
    if (Object.keys(query)[i] === "id") {
      params["_id"] = new mongoose.Types.ObjectId(value)
    } else if (Object.keys(query)[i] === "userId") {
      params[Object.keys(query)[i]] = new mongoose.Types.ObjectId(value)
    } else {
      params[Object.keys(query)[i]] = value
    }
  }

  let { limit, skip, sort, ...restOfParams } = params
  limit = limit ? Number(limit) : constants.LIMIT
  skip = skip ? Number(skip) : 0

  if (sort === "asc" || sort === "desc") {
    if (typeof sortBy === "object") {
      let first = sortBy[Object.keys(sortBy)[0]]
      let second = sortBy[Object.keys(sortBy)[1]]

      sort =
        sort === "asc"
          ? { [first]: 1, [second]: 1 }
          : { [first]: -1, [second]: -1 }
    } else {
      sort = sort === "asc" ? { [sortBy]: 1 } : { [sortBy]: -1 }
    }
  } else if (sort == undefined) {
    sort = { [sortBy]: 1 }
  } else {
    return {
      error: `Unable to find ${item} might be because of invalid params`,
    }
  }

  return { params: restOfParams, limit, skip, sort }
}

const hashPassword = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(password, salt)
}

const verifyPassword = async (
  password: string,
  dbpassword: string,
): Promise<boolean> => {
  return bcrypt.compare(password, dbpassword)
}

const manageAsyncOps = async <T>(
  fn: Promise<T>,
): Promise<[Error | null, Awaited<T> | null]> => {
  try {
    const response = await fn
    return [null, response]
  } catch (error) {
    const err = error as Error
    return [err, null]
  }
}

export {
  messageHandler,
  tokenHandler,
  isAuthenticated,
  queryConstructor,
  hashPassword,
  verifyPassword,
  manageAsyncOps,
}
