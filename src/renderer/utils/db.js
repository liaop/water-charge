import fse from 'fs-extra'
import path from 'path'
import sq3 from 'sqlite3'
import logger from './logger'
import { docDir } from './settings'

const dbPath = path.join(docDir, 'data.db')
fse.ensureFileSync(dbPath)
const sqlite3 = sq3.verbose()
const db = new sqlite3.Database(dbPath)

db.serialize(() => {

  db.run(`CREATE TABLE "PERSON" (
      "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
      "house" text(8) NOT NULL,
      "contact" text(20) DEFAULT '',
      "address" text(20) NOT NULL,
      "remark" text(20) NOT NULL,
      "create_time" integer(10) NOT NULL,
      "update_time" integer(10) NOT NULL
    )`, err => logger(err))
})

export default db