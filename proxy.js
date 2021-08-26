const Proxy = require('koa-proxies')

module.exports = ({ host, port }) => Proxy(
  ''
  , {
    target: 'http://' + host + ':' + port,
    changeOrigin: true
  }
)
