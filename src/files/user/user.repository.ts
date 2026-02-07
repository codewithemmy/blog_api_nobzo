import User from "./user.model"
import { IUser } from "./user.interface"

export default class UserRepository {
  static createUser(
    payload: Pick<IUser, "name" | "email" | "password">,
  ): Promise<IUser> {
    return User.create(payload)
  }

  static async fetchUser(payload: Partial<IUser>): Promise<IUser | null> {
    return User.findOne({ ...payload })
  }

  static async validateUser(
    query: Partial<IUser> | { $or?: Partial<IUser>[] },
  ) {
    return User.exists(query)
  }
}
