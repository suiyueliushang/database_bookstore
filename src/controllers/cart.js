const Router = require("koa-joi-router")
const Joi = Router.Joi

const router = new Router()

router.get("/cart", async (ctx, next) => {
    const cart = ctx.session.cart || []
    const books = []
    cart.forEach(item => {
        const book = ctx.db.prepare(`
        select isbn, title, author, description, price from bookinfos
        where isbn = ?
        `).get(item.isbn)
        if (!book) return
        book.count = item.count
        book.totalprice = book.count * book.price
        books.push(book)
        return
    })
    await ctx.render("home/cart", { books })
})


router.post("/cart/add", {
    validate: {
        type: "form",
        body: {
            isbn: Joi.number().required(),
            count: Joi.number().integer().min(1).required()
        },
        continueOnError: true
    },
}, async (ctx, next) => {
    let cart = ctx.session.cart || []
    let { isbn, count } = ctx.request.body
    if (!ctx.invalid) {
        const book = ctx.db.prepare(`
        select isbn, title, author, description, price from bookinfos
        where isbn = ?
        `).get(isbn)
        if (!book) return
        isbn = book.isbn
        const item = cart.find(x => x.isbn === isbn)
        if (!item) {
            cart.unshift({ isbn, count })
        } else {
            item.count += count
        }
        ctx.session.cart = cart
    }
    ctx.redirect("/detail/" + isbn)
})

function modifyCart(ctx) {
    let cart = ctx.session.cart || []
    const items = ctx.request.body || {}
    Object.keys(items).forEach(isbn => {
        const book = ctx.db.prepare(`
        select isbn, title, author, description, price from bookinfos
        where isbn = ?
        `).get(isbn)
        if (!book) return
        isbn = book.isbn
        let count = items[isbn]
        if (typeof count !== "number") count = parseInt(count)
        if (isNaN(count) || count <= 0) {
            cart = cart.filter(x => x.isbn !== isbn)
        } else {
            const it = cart.find(x => x.isbn === isbn)
            if (it) it.count = count
            else cart.unshift({ isbn, count })
        }
    })
    ctx.session.cart = cart
}

router.post("/cart/modify", {
    validate: {
        type: "form",
        body: {},
        continueOnError: true
    },
}, async (ctx, next) => {
    modifyCart(ctx)
    ctx.redirect("/cart")
})

router.post("/cart/checkout", {
    validate: {
        type: "form",
        body: {},
        continueOnError: true
    },
}, async (ctx, next) => {
    modifyCart(ctx)
    if (!ctx.session.user) ctx.redirect("/account/signin?from=/checkout")
    else ctx.redirect("/checkout")
})

module.exports = router.middleware()