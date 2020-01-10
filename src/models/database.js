const fs = require("fs")
const path = require("path")
const Sqlite = require("better-sqlite3")

const conn = new Sqlite(path.join(__dirname, "./database.sqlite3"))

module.exports = async (ctx, next) => {
    ctx.db = conn
    ctx.state.user = ctx.session.user
    let cart = 0
    if (ctx.session.cart) ctx.session.cart.forEach(x => cart += x.count)
    ctx.state.cart = cart
    ctx.state.url = ctx.request.url
    await next()
}

conn.exec(fs.readFileSync(path.join(__dirname, "./schema.sql"), "utf-8"))
if (!conn.prepare("select 1 from users where id = 1 and name = 'admin'").get())
    conn.exec(fs.readFileSync(path.join(__dirname, "./seed.sql"), "utf-8"))

require("../utils/exit").push(() => {
    conn.close()
})