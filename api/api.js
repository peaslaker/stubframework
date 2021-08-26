const Router = require('koa-router')
const Request = require('koa-http-request')
const Compose = require('koa-compose')

const config = require('config')

const { port: port1, host: host1 } = config.get('zone1')
const { port: port2, host: host2 } = config.get('zone2')

/*  FAKE IMPLEMENTATION WARNING
The 'assemble' function is a fake implementation.  It obtains data from two asynchronous
services without any error checking or strategy for returning partial results (e.g. only
one source responded) with metadata/headers/response code indicating the result was partial
*/
const assemble = async function (ctx, next) {
  await next()
  const [resp1, resp2] = await Promise.all([
    ctx.post(host1 + ':' + port1 + ctx.url, null, { 'User-Agent': 'koa-http-request' }),
    ctx.post(host2 + ':' + port2 + ctx.url, null, { 'User-Agent': 'koa-http-request' })
  ])
  ctx.body = { resp1, resp2 }
}

// The two example endpoints route to the assemble function
const api = Router()
api.post('/thing', assemble)
api.post('/detail', assemble)

// The module exports a composed middleware, preprocessing the request
// for returning a JSON payload and then routing to endpoints
module.exports = Compose([
  Request({ dataType: 'JSON' }),
  api.routes()
])
