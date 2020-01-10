const Router = require("koa-joi-router")
const Joi = Router.Joi

const router = new Router()

function price(p) {
    return Math.round(p * 100) / 100
}

function getBooksInCart(ctx) {
    const cart = ctx.session.cart || []
    const books = []
    cart.forEach(item => {
        const book = ctx.db.prepare(`
        select id, isbn, title, author, description, price from bookinfos
        where isbn = ?
        `).get(item.isbn)
        if (!book) return
        book.count = item.count
        book.totalprice = price(book.count * book.price)
        books.push(book)
        return
    })
    return books
}

router.get("/checkout", async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.redirect("/account/signin?from=/checkout")
        return
    }
    const step = ctx.request.query.step || "1"
    const address = ctx.request.query.address
    const creditcard = ctx.request.query.creditcard
    const books = getBooksInCart(ctx)
    let total = 0
    books.forEach(x => total += x.totalprice)
    total = price(total)
    switch (step) {
        case "1":
            await ctx.render("checkout/checkout1", { books, total })
            break
        case "2":
            await ctx.render("checkout/checkout2", { form: { address, creditcard } })
            break
        case "3":
            if (!address || !creditcard) {
                const invalid = {}
                if (!address) invalid.address = "Address can not be empty"
                if (!creditcard) invalid.creditcard = "Credit card can not be empty"
                await ctx.render("checkout/checkout2", { form: { address, creditcard }, invalid })
            } else {
                await ctx.render("checkout/checkout3", { books, total, address, creditcard })
            }
            break
        default: ctx.redirect("/checkout")
    }
})

router.post("/checkout", {
    validate: {
        type: "form",
        body: {
            address: Joi.string().required(),
            creditcard: Joi.string().required()
        },
        continueOnError: true
    },
}, async (ctx, next) => {
    if (!ctx.session.user) {
        ctx.redirect("/account/signin?from=/checkout")
        return
    }
    const userid = ctx.db.prepare(`
    select id from users
    where name = ?
    `).get(ctx.session.user).id
    const address = ctx.request.body.address
    const creditcard = ctx.request.body.creditcard
    const books = getBooksInCart(ctx)
    if (books.length <= 0) {
        ctx.redirect("/cart")
        return
    }
    let total = 0
    books.forEach(x => total += x.totalprice)
    total = price(total)

    ctx.db.transaction(function () {
        const rowid = ctx.db.prepare(`
        insert into tickets (userid, creditcard, address, totalprice)
        values (?, ?, ?, ?)
        `).run(userid, creditcard, address, total).lastInsertRowid
        const ticketid = ctx.db.prepare(`
        select id from tickets where rowid = ?
        `).get(rowid).id
        const insertItem = ctx.db.prepare(`
        insert into ticketitems (ticketid, bookinfoid, count)
        values (?, ?, ?)
        `)
        books.forEach(book => {
            insertItem.run(ticketid, book.id, -book.count)
        })
    })()
    ctx.session.cart = []
    await ctx.redirect("/checkout/success")
})

router.get("/checkout/success", async (ctx, next) => {
    await ctx.render("checkout/checkout4")
})

module.exports = router.middleware()