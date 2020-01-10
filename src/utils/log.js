
const colors = require('colors/safe')
const morgan = require("koa-morgan")

const ErrorOnly = false

morgan.token("colorStatus", (req, res) => {
    var code = res.statusCode
    if (code < 300) return colors.green(code)
    if (code < 400) return colors.cyan(code)
    if (code < 500) return colors.red(code)
    return colors.bgRed(code)
})

morgan.token("content-length", (req, res) => {
    var length = +res.getHeader("Content-Length")
    if (isNaN(length) || length < 0) return "-"
    if (length > (1 << 20)) return (length / (1 << 20)).toFixed(2) + " MB"
    if (length > (1 << 10)) return (length / (1 << 10)).toFixed(2) + " KB"
    return length + " B"
})

morgan.token("mytime", (req, res) => {
    return new Date().toLocaleTimeString()
})

module.exports = morgan("[:mytime]:remote-addr :method :url HTTP/:http-version \n\t :colorStatus  :response-time ms  :content-length", {
    skip: (req, res) => {
        if (ErrorOnly) {
            if (res.statusCode < 400) return true
        }
        return false
    }
})
