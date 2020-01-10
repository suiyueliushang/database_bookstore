
const process = require("process")

const exits = []

if (process.platform === 'win32') {
    require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
    }).on('SIGINT', () => {
        process.emit('SIGINT')
    })
}

process.on('SIGINT', () => {
    console.log("\nApp shutting down...\n")
    exits.forEach(f => {
        if (typeof f === "function") f()
    })
    process.exit()
})

process.on('SIGTERM', () => {
    process.exit()
})

module.exports = exits
