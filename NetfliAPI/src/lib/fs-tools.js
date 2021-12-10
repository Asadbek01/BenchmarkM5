import fs from "fs-extra" 
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const mediaPublicFolderPath = join(process.cwd(), "./public/img/users") 

console.log("DATA FOLDER PATH: ", dataFolderPath)
console.log("PROJECT ROOT ", process.cwd())

const mediaJSONPath = join(dataFolderPath, "media.json")

export const getMedia = () => readJSON(mediaJSONPath)
export const writeMedia = content => writeJSON(mediaJSONPath, content)


export const saveUsersAvatars = (fileName, contentAsABuffer) => writeFile(join(mediaPublicFolderPath, fileName), contentAsABuffer)

export const getMediaReadableStream = () => createReadStream(mediaJSONPath)