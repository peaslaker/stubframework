/*
The MGMT module provides abstraction of a managed test harness implementing ...
... delays
... arbitrary http responses (errors)
And...
... default null behaviour (transparently passes to the next middleware)
*/

const Koa = require('koa')
const Router = require('koa-router')
const Parser = require('koa-bodyparser')
const Compose = require('koa-compose')

const context = new Map()

const app = new Koa()
const mgmt = new Router()

// A basic implementation of a delay function
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

// Shows current state of the test harness
const harnessShow = async function (ctx, next) {
  await next()
  ctx.response.body = [...context.entries()]
}

// Expose as the default endpoint of the mgmt service
mgmt.post('', harnessShow)

// A partial function providing a setter endpoint for context values
const harnessSetter = (name) => async function (ctx, next) {
  await next()
  const { delayms, errcode, errpayload } = ctx.request.body
  context.set(name, { delayms, errcode, errpayload })
  // return the current context entries
  ctx.body = [...context.entries()]
}

// A partial function providing implementers of the harness actions(delays / errors)
const harnessImplementer = (name) => async function (ctx, next) {
  const { delayms, errcode, errpayload } = context.get(name)
  console.log('harness:' + name, { delayms, errcode, errpayload })
  if (delayms != null) await delay(delayms)
  if (errcode != null) ctx.throw(errcode, errpayload)
  await next()
}

// The 'harness' function binds an implementer to a setter endpoint
const harness = (name) => {
  // initialise a blank set of harness context values
  context.set(name, {})
  // expose the 'name' endpoint for setting harness context values
  mgmt.post(name, Compose([Parser(), harnessSetter(name)]))
  // return handler to be 'used' by implementer apps
  return harnessImplementer(name)
}

// We expose the koa app's 'use' function so the mgmt module behaves like a koa app
const use = (..._) => app.use(..._)

// We expose the koa app's 'listen' function so the mgmt module behaves like a koa app
// but we overload it, guaranteeing routing to our mgmt endpoints
const listen = (port) => {
  app.use(mgmt.routes())
  app.listen(port)
}

// The return object offers the basic listen and use interfaces of the Koa app
// along with the harness hook
module.exports = { harness, use, listen }
