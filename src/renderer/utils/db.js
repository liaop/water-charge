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

  db.run(`CREATE TABLE "RECORD" (
    "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
    "person_id" integer(3) NOT NULL,
    "status" integer(1) NOT NULL,
    "count" integer(6) NOT NULL,
    "price" real(1,2) NOT NULL,
    "total" real(4) NOT NULL DEFAULT 0,
    "pre" integer(10) NOT NULL DEFAULT 0,
    "date" integer(10) NOT NULL,
    "end" blob NOT NULL DEFAULT 0,
    "upper" integer(6) NOT NULL DEFAULT 0,
    "remark" text(20) NOT NULL DEFAULT '',
    "create_time" integer(10) NOT NULL
  )`, err => logger(err))

  db.run(`CREATE TABLE "UNIT" (
      "id" integer NOT NULL PRIMARY KEY AUTOINCREMENT,
      "price" real(1,2),
      "time" integer(10)
    )`, err => logger(err))
})

export default db