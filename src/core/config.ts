import * as dotenv from "dotenv"
dotenv.config()

const config = {
  SECRET_KEY: process.env.SECRET_KEY,
  ENV: process.env.ENVIRONMENT,
}

export default config
