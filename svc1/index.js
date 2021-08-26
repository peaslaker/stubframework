/*
This is a standard wrapper that stands up the app, listening on the configured port
*/

const Koa = require('koa')
const Logger = require('../logger.js')

const config = require('config')

const app = new Koa()

app.use(Logger('svc1'))
app.use(require('./svc1.js'))
app.listen(config.get('svc1').port)
