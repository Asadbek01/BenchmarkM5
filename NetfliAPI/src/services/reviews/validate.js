import { body } from "express-validator"


export const reviewValidation = [
  body("comment").exists().withMessage("comment is a mandatory field!"),
  body("rate").exists().withMessage("rate is a mandatory field!"),
]