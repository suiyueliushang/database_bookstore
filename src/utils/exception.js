
module.exports = async (ctx, next) => {
    try {
        await next()
    } catch (error) {
        console.error(error)
        ctx.response.status = 500
        await ctx.render("shared/error")
    }
}