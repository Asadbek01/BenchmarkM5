import express from "express"
import uniqid from "uniqid"
import createHttpError from "http-errors"
import { validationResult } from "express-validator"
import { mediaValidation } from "./validation.js"
import { getMedia, writeMedia} from "../../lib/fs-tools.js"

const mediaRouter = express.Router()

// 1.

mediaRouter.post("/", mediaValidation, async (req, res, next) => {
  try {

    const errorsList = validationResult(req)
    if (!errorsList.isEmpty()) {
      next(createHttpError(400, "Some Errors occured in the request body", { errorsList }))
    } else {
   
      const newMedia = { ...req.body, createdAt: new Date(), id: uniqid() }
      const medias = await getMedia()

      medias.push(newMedia)
      await writeMedia(medias)
      res.status(201).send({ id: newMedia.id })
    }
  } catch (error) {
    next(error)
  }
})


// 2.

mediaRouter.get("/",  async (req, res, next) => {
  try {
    
    const medias = await getMedia()
    // const media = await getMedia()
    if (req.query && req.query.year) {
        console.log(req.query)
      const filterMedias = medias.filter(media => media.year === req.query.year)
      res.send(filterMedias)
    } else {
      res.send(medias)
    }
  } catch (error) {
    next(error)
  }
})
 // 3.

mediaRouter.get("/:mediaId", async (req, res, next) => {
  try {
    const medias = await getMedia()

    const media = medias.find(m => m.id === req.params.mediaId)
    if (media) {
      res.send(media)
    } else {
      next(createHttpError(404, `Book with ID ${req.params.mediaId} not found!`))
    }
  } catch (error) {
    next(error)
  }
})

 // 4.

mediaRouter.put("/:mediaId", async (req, res, next) => {
  try {
    const medias = await getMedia()

    const index = medias.findIndex(m => m.id === req.params.mediaId)

    const mediaToModify = medias[index]
    const updatedFields = req.body

    const updatedMedia = { ...mediaToModify, ...updatedFields, updatedAt: new Date() }

    medias[index] = updatedMedia

    await writeMedia(medias)

    res.send(updatedMedia)
  } catch (error) {
    next(error)
  }
})

// // 5.

mediaRouter.delete("/:mediaId", async (req, res, next) => {
  try {
    const medias = await getMedia()
    const remainingMedia = medias.filter(m => m.id !== req.params.mediaId)
    await writeMedia(remainingMedia)
    res.status(204).send()
  } catch (error) {
    next(error)
  }
})

export default mediaRouter
