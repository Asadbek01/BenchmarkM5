import { body } from "express-validator"

export const mediaValidation = [
  body("year").exists().withMessage("Title is a mandatory field!"),
  body("type").exists().withMessage("Category is a mandatory field!"),
]

export const reviewValidation = [
  body("comment").exists().withMessage("comment is a mandatory field!"),
  body("rate").exists().withMessage("rate is a mandatory field!"),
]