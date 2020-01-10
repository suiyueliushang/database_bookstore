const Router = require("koa-joi-router")
const Joi = Router.Joi

const router = new Router()

router.get("/search", {
    validate: {
        query: {
            q: Joi.string().max(20)
        },
        continueOnError: true
    }
}, async (ctx, next) => {
    const q = ctx.request.query.q || ""
    if (ctx.invalid) {
        await ctx.render("home/search", { invalid: "Search string not valid.", q })
    } else {
        const set = new Set()
        const books = []
        let keys = q.split(/\s+/).map(x => x.trim()).filter(x => x)
        if (keys.length === 0) keys = [""]
        keys.forEach(key => {
            const res = ctx.db.prepare(`
            select isbn, title, author, description, price from bookinfos
            where isbn like @q
                or title like @q
                or author like @q 
                or description like @q collate nocase
            `).all({ q: "%" + key + "%" })
            res.forEach(r => {
                if (set.has(r.isbn)) return
                set.add(r.isbn)
                books.push(r)
            })
        })
        await ctx.render("home/search", { books, q })
    }
})


module.exports = router.middleware()