const Router = require('koa-router')

const api = Router()

/*
This is a very basic dummy api implementation
*/

async function thing(ctx, next) {
	await next()
	ctx.body = [{type:'c', maskedValue:'1234'}]
}

async function detail(ctx, next) {
	await next()
	ctx.body = [{type:'c', value:'1234567887651234', other: '1224', detail: '100'}]
}

api.post('/thing',thing)
api.post('/detail',detail)

module.exports = api.routes()