import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { reviewValidation } from "./validate.js"
import { getMedia, writeMedia, getReview, writeReview} from "../../lib/fs-tools.js"

const reviewRouter = express.Router()

// 1.

reviewRouter.post("/", reviewValidation, async (req, res, next) => {
  try {

    const errorsList = validationResult(req)
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, "Some Errors occured in the request body", { errorsList }))
    } else {
   
      const newReview = { ...req.body, createdAt: new Date(), id: uniqid() }
      const review = await getReview()

      review.push(newReview)
      await writeReview(review)
      res.status(201).send({ id: newReview.id })
    }
  } catch (error) {
    next(error)
  }
})


// 2.

reviewRouter.delete("/:reviewId", async (req, res, next) => {
  try {
    const review = await getReview()
    const remainingReview = review.filter(m => m.id !== req.params.reviewId)
    await writeReview(remainingReview)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default reviewRouter
