// sized.js - web service to return data of specific size
// usage: (eg curl)
// curl -verbose localhost:8001/sized/1mb
// curl -verbose localhost:8001/sized/5k
//
// TODO 20151204 HTTPS
// TODO 20151204 Multipart support
//
var express = require('express')
var app = express()



var fs = require('fs');
var http = require('http');
var https = require('https')

var keystore = fs.readFileSync('certs/certs.config');
var passphrase = fs.readFileSync('config/config', 'utf8');
var credentials = {pfx: keystore, passphrase: passphrase};




var listen_port_http = 8001
var listen_port_https = 9001

// specification for creating the buffer hashtable, there must be
// a better way
//
var buf_spec = [
    { key: '5k',
      value: (5 * 1024)},
    { key: '10k',
      value: (10 * 1024)},
    { key: '20k',
      value: (20 * 1024)},
    { key: '30k',
      value: (30 * 1024)},
    { key: '40k',
      value: (40 * 1024)},
    { key: '50k',
      value: (50 * 1024)},
    { key: '100k',
      value: (100 * 1024)},
    { key: '200k',
      value: (200 * 1024)},
    { key: '300k',
      value: (300 * 1024)},
    { key: '400k',
      value: (400 * 1024)},
    { key: '500k',
      value: (500 * 1024)},
    { key: '1mb',
      value: (1024 * 1024)}
]

var buffers = {}

buf_spec.forEach(function (spec) {
  buffers[spec.key] = new Buffer(spec.value)
  buffers[spec.key].fill(0)
})

app.get('/sized/:sz', function (request, response) {
  console.log('request made for: ' + request.params.sz)

  if (buffers[request.params.sz] !== undefined) {
    response.set('Content-Type', 'application/octet-stream')
    response.send(buffers[request.params.sz])
  } else {
    response.status(404).send('Not Found size: ' + request.params.sz)
  }
})

var httpServer = http.createServer(app);
var httpsServer = https.createServer(credentials, app);

httpServer.listen(listen_port_http);
httpsServer.listen(listen_port_https);

console.log('Now listening port ' + listen_port_http + 'for http and port' +listen_port_https+ 'for https' )
