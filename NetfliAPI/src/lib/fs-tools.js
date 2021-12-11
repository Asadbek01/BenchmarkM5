import fs from "fs-extra" 
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const mediaPublicFolderPath = join(process.cwd(), "./public/img/media")
 


console.log("DATA FOLDER PATH: ", dataFolderPath)
console.log("PROJECT ROOT ", process.cwd())

const mediaJSONPath = join(dataFolderPath, "media.json")
const reviewJSONPath =join(dataFolderPath, "review.json")

export const getMedia = () => readJSON(mediaJSONPath)
export const writeMedia = content => writeJSON(mediaJSONPath, content)
export const getReview = () => readJSON(reviewJSONPath)
export const writeReview = content => writeJSON(reviewJSONPath, content)


export const saveUsersAvatars = (fileName, contentAsABuffer) => writeFile(join(mediaPublicFolderPath, fileName), contentAsABuffer)

export const getMediaReadableStream = () => createReadStream(mediaJSONPath)