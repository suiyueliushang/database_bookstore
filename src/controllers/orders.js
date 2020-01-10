const Router = require("koa-router")

const router = new Router()

router.get("/orders", async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.redirect("/account/signin?from=/orders")
        return
    }
    const orders = ctx.db.prepare(`
    select * from tickets
    where userid = (
        select id from users
        where name = ?)
    order by id desc
    `).all(ctx.session.user)

    orders.forEach(o => {
        o.datetime = new Date(o.datetime + " +0000").toLocaleString("en-US", { timeZone: "Asia/Shanghai" })
        o.items = ctx.db.prepare(`
        select b.title, b.isbn, i.count from ticketitems as i
        inner join bookinfos as b on b.id = i.bookinfoid
        where i.ticketid = ?
        order by i.id asc
        `).all(o.id)
    })

    await ctx.render("checkout/orders", { orders })
})

module.exports = router.routes()
