# stubframework

This project is a scratchpad implementation of stubbable reverse proxies for introducing 
test scenarios into multi-tier API implenentations.  The project includes a sample multi-tier implementation 
with:
  1. A dummy API layer service
  2. 2x dummy data layer services called by the dummy API layer
  3. A reverse proxy for each of the above services
  4. A management service for setting up test scenarios in the reverse proxies

The proxies allow error responses from the proxied zones to fake error conditions to test
application and API handling of errors.  Responses can also be delayed.

The implementation is based on Koa middleware.

- ``index.js`` sets up the sample project made up of three Koa implementations of dummy services
- ``mgmt.js`` is the implementation of the reverse proxy management service that also provides the middleware hook function, ``harness()`` for integration in implementing reverse proxies
- ``logger.js`` logs to console, implemented by all services and proxies
- ``proxy.js`` helper function for creating reverse proxies

*** this is not suitable for implementation and is just a working demonstration model ***

## Development implementation

  - ``npm install``
  - ``node .``
  - ... run calls from the Postman collection ``postman_collection.json``
  
### Ports 

  - ``3101`` - API zone reverse proxy
  - ``3102`` - data service 1 reverse proxy
  - ``3103`` - data service 2 reverse proxy
  - ``3199`` - management interface for configuring the reverse proxies

  - ``3001`` - API implementation
  - ``3002`` - data service 1 implementation
  - ``3003`` - data service 2 implementation
  
### Management interface on port 3199

The interface supports a default POST endpoint for returning the current context objects for all the proxies.

- ``localhost:3199``

The interface supports POST endpoints for setting the reverse proxy context:

  - ``localhost:3199/api``
  - ``localhost:3199/svc1``
  - ``localhost:3199/svc2``
  
Each setter endpoint accepts a JSON payload object with the following accepted keys:

  - ``delayms``
  - ``errcode``
  - ``errpayload``
  
 By default all keys are undefined and the reverse proxy operates a transparent passthrough to its respective service
 
 If ``delayms`` is set with a numeric positive integer value, the response will be delayed by that number of milliseconds.
 
 If ``errcode`` is set with a numeric integer value indicating an ``http`` error, that error code will be thrown by the proxy.  The optional ``errpayload``
 will be returned in the case of an error.
