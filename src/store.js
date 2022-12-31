import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import Configstore from 'configstore'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const packageJson = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../package.json'), 'utf8'))

export const store = new Configstore(packageJson.name, {})

export const API_KEY = 'apiKey'
