const Router = require("koa-joi-router")
const Joi = Router.Joi

const router = new Router()

router.get("/detail/:isbn", {
    validate: {
        params: {
            isbn: Joi.number().integer().required()
        },
        continueOnError: true
    }
}, async (ctx, next) => {
    const isbn = ctx.request.params.isbn
    if (ctx.invalid) {
        await next()
    } else {
        const book = ctx.db.prepare(`
        select isbn, title, author, description, price, (
            select sum(count) from ticketitems
            where bookinfoid = bookinfos.id
        ) as count from bookinfos
        where isbn = ?
        `).get(isbn)
        if (!book) await next()
        else await ctx.render("home/detail", { book })
    }
})


module.exports = router.middleware()