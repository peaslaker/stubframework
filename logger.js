/*
A simple implementation of a console logger, recording the time spent in a layer and
exposing a few context details
*/

module.exports = (zone) => async function (ctx, next) {
	const start = new Date()
	console.log('%s received: %s %s',zone, ctx.method, ctx.url)
	await next()
	const ms = new Date() - start
	if ('test' != process.env.NODE_ENV) {
	  	console.log('%s handled: %s %s - %s',zone, ctx.method, ctx.url, ms, ctx.response.status)
	}
}
