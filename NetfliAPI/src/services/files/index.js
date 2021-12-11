import express from "express"
import multer from "multer"
import createHttpError from "http-errors"
import { v2 as cloudinary } from "cloudinary"
import { CloudinaryStorage } from "multer-storage-cloudinary"
import { pipeline } from "stream"
// import { createGzip } from "zlib"
// import json2csv from "json2csv"

import { saveUsersAvatars, getMediaReadableStream } from "../../lib/fs-tools.js"
import { getPDFReadableStream } from "../../lib/media-pdf-tools.js"

// import { getPDFReadableStream, generatePDFAsync } from "../../lib/pdf-tools.js"

const filesRouter = express.Router()

const uploader = multer({
  fileFilter: (req, file, multerNext) => {
    if (file.mimetype !== "image/png") {
      multerNext(createHttpError(400, "only gifs are allowed"))
    } else {
      multerNext(null, true)
    }
  },
}).single("profilePic")

const cloudStorage = new CloudinaryStorage({
  cloudinary, 
  params: {
    folder: "strive-media",
  },
})

filesRouter.post("/uploadSingle", uploader, async (req, res, next) => {
  try {
    console.log("FILE: ", req.file)
    await saveUsersAvatars(req.file.originalname, req.file.buffer)
    res.send("OK")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadMultiple", multer().array("profilePic"), async (req, res, next) => {
  try {
    console.log("FILES: ", req.files)
    const arrayOfPromises = req.files.map(file => saveUsersAvatars(file.originalname, file.buffer))
    await Promise.all(arrayOfPromises)
    res.send("Ok")
  } catch (error) {
    next(error)
  }
})

filesRouter.post("/uploadCloudinary", multer({ storage: cloudStorage }).single("profilePic"), async (req, res, next) => {
  try {
    console.log(req.file)

    res.send("Image uploaded on Cloudinary!")
  } catch (error) {
    next(error)
  }
})

// filesRouter.get("/downloadJSON", async (req, res, next) => {
//   try {
//     // SOURCE (file on disk, request, ...) --> DESTINATION (file on disk, terminal, response, ...)

//     // In this example we are going to have: SOURCE(file on disk --> books.json) --> DESTINATION (http response)

//     res.setHeader("Content-Disposition", "attachment; filename=whatever.json.gz") // This header tells the browser to open the "Save file on disk" dialog

//     const source = getBooksReadableStream()
//     const transform = createGzip()
//     const destination = res
//     pipeline(source, transform, destination, err => {
//       if (err) next(err)
//     })
//   } catch (error) {
//     next(error)
//   }
// })

filesRouter.get("/downloadPDF", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=media.pdf") // This header tells the browser to open the "Save file on disk" dialog
    const source = getPDFReadableStream({ name: "Media"})
    const destination = res
    pipeline(source, destination, err => {
      if (err) next(err)
    })
  } catch (error) {
    next(error)
  }
})

// filesRouter.get("/downloadCSV", (req, res, next) => {
//   try {
//     res.setHeader("Content-Disposition", "attachment; filename=books.csv")

//     const source = getBooksReadableStream()
//     const transform = new json2csv.Transform({ fields: ["asin", "title", "price", "category"] })
//     const destination = res

//     pipeline(source, transform, destination, err => {
//       if (err) next(err)
//     })
//   } catch (error) {
//     next(error)
//   }
// })

// filesRouter.get("/PDFAsync", async (req, res, next) => {
//   try {
//     // 1. Generate PDF with streams
//     const path = await generatePDFAsync({ firstName: "Bogdan", lastName: "Birau" })
//     // 2. Use the pdf somehow (example --> send it as an attachment to an email)
//     // await sendEmail({attachment: path})
//     res.send({ path })
//   } catch (error) {
//     next(error)
//   }
// })

export default filesRouter
