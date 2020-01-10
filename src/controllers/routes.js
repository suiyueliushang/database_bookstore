const Router = require("koa-router")

const router = new Router()

router.use(require("./home"))
router.use(require("./account"))
router.use(require("./search"))
router.use(require("./detail"))
router.use(require("./cart"))
router.use(require("./checkout"))
router.use(require("./orders"))

router.all("*", async(ctx, next) => {
    ctx.response.status = 404
    await ctx.render("shared/notfound")
})

module.exports = router.routes()