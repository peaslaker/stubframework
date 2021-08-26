/* This project is an example implementation of stubbing reverse proxies that can be
configured on the fly to return arbitrary http responses or introduce delays or other
unhappy path outcomes
*/

const config = require('config')

const Koa = require('koa')

/* These are just two helper functions internal to the project */
const proxy = require('./proxy.js')
const logger = require('./logger.js')

/* The three API services start up entirely independently */
require('./api')
require('./svc1')
require('./svc2')

/* 'harness', 'use' and 'listen' functions */
const mgmt = require('./mgmt.js')

/* three implementations of managed reverse proxies */
const apiZone = new Koa()
const zone1 = new Koa()
const zone2 = new Koa()

apiZone.use(logger('apiZone'))
apiZone.use(mgmt.harness('/api'))
apiZone.use(proxy(config.get('apisvc')))

zone1.use(logger('zone1'))
zone1.use(mgmt.harness('/svc1'))
zone1.use(proxy(config.get('svc1')))

zone2.use(logger('zone2'))
zone2.use(mgmt.harness('/svc2'))
zone2.use(proxy(config.get('svc2')))

mgmt.use(logger('mgmt'))

if (!module.parent) {
  apiZone.listen(config.get('apizone').port)
  zone1.listen(config.get('zone1').port)
  zone2.listen(config.get('zone2').port)
  mgmt.listen(config.get('mgmtsvc').port)
}
