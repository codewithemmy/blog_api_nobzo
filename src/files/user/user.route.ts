import express from "express"
import userController from "./user.controller"
import { checkSchema } from "express-validator"
import validate from "../../validations/validate"
import {
  loginUserValidation,
  registerUserValidation,
} from "../../validations/user/user.validation"

const UserRoute = express.Router()

const { registerController, loginController } = userController

UserRoute.post(
  "/register",
  validate(checkSchema(registerUserValidation)),
  registerController,
)

UserRoute.post(
  "/login",
  validate(checkSchema(loginUserValidation)),
  loginController,
)

export default UserRoute
