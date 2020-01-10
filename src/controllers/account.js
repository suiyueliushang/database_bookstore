const Router = require("koa-joi-router")
const Joi = Router.Joi

const router = new Router()

const urlMidlle = async (ctx, next) => {
    let url = (ctx.request.query.from || "/").toLowerCase()
    if (url.startsWith("/account") || url.startsWith("http")) url = "/"
    ctx.state.url = url
    await next()
}

router.get("/account/signin", urlMidlle, async (ctx, next) => {
    if (ctx.session.user) ctx.redirect(ctx.state.url || "/")
    else await ctx.render("account/signin")

})

router.post("/account/signin", {
    validate: {
        type: "form",
        body: {
            username: Joi.string().required(),
            password: Joi.string().required(),
        },
        continueOnError: true
    },
}, urlMidlle, async (ctx, next) => {
    if (ctx.session.user) ctx.redirect(ctx.state.url || "/")
    else if (ctx.invalid) {
        const invalid = {}
        ctx.invalid.body.details.forEach(m => invalid[m.context.key] = m.message)
        ctx.status = 400
        await ctx.render("account/signin", { invalid, form: ctx.request.body })
    } else {
        const user = ctx.db.prepare(`
        select name, password from users
        where name = ? and password = ?
        `).get(ctx.request.body.username, ctx.request.body.password)
        if (user) {
            ctx.session.user = ctx.request.body.username
            ctx.redirect(ctx.state.url || "/")
        } else {
            ctx.status = 403
            await ctx.render("account/signin", {
                failed: "Login failed. Check your username and password.",
                form: ctx.request.body
            })
        }
    }
})

router.get("/account/signup", urlMidlle, async (ctx, next) => {
    if (ctx.session.user) ctx.redirect(ctx.state.url || "/")
    else await ctx.render("account/signup")
})

router.post("/account/signup", {
    validate: {
        type: "form",
        body: {
            username: Joi.string().min(3).max(20).required(),
            password: Joi.string().min(6).max(20).required(),
            repeat_password: Joi.ref("password"),
        },
        continueOnError: true
    },
}, urlMidlle, async (ctx, next) => {
    if (ctx.session.user) ctx.redirect(ctx.state.url || "/")
    else if (ctx.invalid) {
        const invalid = {}
        ctx.invalid.body.details.forEach(m => invalid[m.context.key] = m.message)
        ctx.status = 400
        await ctx.render("account/signup", { invalid, form: ctx.request.body })
    } else {
        const res = ctx.db.prepare(`
        insert or ignore into users (name, password)
        values (?, ?)
        `).run(ctx.request.body.username, ctx.request.body.password)
        if (res.changes === 1) {
            ctx.session.user = ctx.request.body.username
            ctx.redirect(ctx.request.query.from || "/")
        } else {
            ctx.status = 403
            await ctx.render("account/signup", {
                failed: "Username already taken.",
                form: ctx.request.body
            })
        }
    }
})

router.get("/account/signout", urlMidlle, async (ctx, next) => {
    ctx.session.user = undefined
    ctx.redirect(ctx.request.query.from || "/")
})

module.exports = router.middleware()
