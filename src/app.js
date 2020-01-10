
const os = require("os")
const path = require("path")
const Koa = require('koa')
require("./utils/exit")

const app = new Koa()
const port = 80

app.keys = ["BOOK_SHOP_SECRET_KEY"]
require('koa-qs')(app, 'first')
app.use(require("./utils/log"))
app.use(require("./utils/exception"))
app.use(require("koa-static")(path.join(__dirname, "./wwwroot")))
app.use(require("koa-bodyparser")())
app.use(require("koa-session")(app))

app.use(require("./models/database"))
app.use(require("./views/views"))
app.use(require("./controllers/routes"))

app.listen(port, () => {
    console.log("Listening on")
    var ifaces = os.networkInterfaces()
    Object.keys(ifaces).forEach((dev) => {
        ifaces[dev].forEach((details) => {
            if (details.family === 'IPv4') {
                console.log("http://" + details.address + ":" + port)
            }
        })
    })
})
