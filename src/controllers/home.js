const Router = require("koa-router")

const router = new Router()

router.get("/", async (ctx, next) => {
    await ctx.render("home/home", {
        hello: "Hello book!"
    })
})

router.post("/", async (ctx, next) => {
    console.log(ctx)
    ctx.redirect("/")
})

router.get("/policy", async (ctx, next) => {
    await ctx.render("help/policy")
})

router.get("/faq", async (ctx, next) => {
    await ctx.render("help/faq")
})

router.get("/contact", async (ctx, next) => {
    await ctx.render("help/contact")
})

module.exports = router.routes()
