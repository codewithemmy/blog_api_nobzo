import { IUser } from "./user.interface"
import UserRepository from "./user.repository"
import { userMessages } from "./user.messages"
import { generalMessages } from "../../core/messages"
import { IResponse } from "../../constants"
import { hashPassword, tokenHandler, verifyPassword } from "../../utils"

export default class UserService {
  static async registerService(
    payload: Pick<IUser, "name" | "email" | "password">,
  ): Promise<IResponse> {
    payload.email = payload.email.toLowerCase()

    const exists = await UserRepository.validateUser({
      email: payload.email,
    })

    if (exists) return { success: false, msg: userMessages.USER_EXISTS }

    const hashedPassword = await hashPassword(payload.password)

    const user = await UserRepository.createUser({
      ...payload,
      password: hashedPassword,
    })

    if (!user)
      return { success: false, msg: generalMessages.UNEXPECTED_FAILURE }

    const token = tokenHandler({ _id: user._id, email: user.email })

    return {
      success: true,
      msg: userMessages.REGISTER_SUCCESS,
      data: { token },
    }
  }

  static async loginService(
    payload: Pick<IUser, "email" | "password">,
  ): Promise<IResponse> {
    payload.email = payload.email.toLowerCase()

    const user = await UserRepository.fetchUser({ email: payload.email })

    if (!user) return { success: false, msg: userMessages.INVALID_LOGIN }

    const isMatch = await verifyPassword(payload.password, user.password)

    if (!isMatch) return { success: false, msg: userMessages.INVALID_LOGIN }

    const token = tokenHandler({ _id: user._id, email: user.email })

    return {
      success: true,
      msg: userMessages.LOGIN_SUCCESS,
      data: { token },
    }
  }
}
