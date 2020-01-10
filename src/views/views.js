const path = require("path")
const koaNunjucks = require('koa-nunjucks-2');

module.exports = koaNunjucks({
    ext: 'html',
    path: path.join(__dirname, '.'),
    nunjucksConfig: {
        trimBlocks: true
    }
})
