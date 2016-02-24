// sized.js - web service to return data of specific size
// usage: (eg curl)
// curl -verbose localhost:8001/sized/1mb
// curl -verbose localhost:8001/sized/5k
//
// TODO 20151204 HTTPS
// TODO 20151204 Multipart support
//
var express = require('express'),
  app = express(),
  _ = require('lodash')


var multer = require('multer')
var upload = multer({dest : 'uploads/'})
var bodyParser = require('body-parser')
var type = upload.single('upload');



var fs = require('fs');
var http = require('http');
var https = require('https')

//var keystore = fs.readFileSync('certs/certs.config');
//var passphrase = fs.readFileSync('config/config', 'utf8');
//var credentials = {pfx: keystore, passphrase: passphrase};




var listen_port_http = 8001
var listen_port_https = 9001

var buf_spec = ['5KiB', '10KiB', '20KiB', '30KiB', '40KiB', '50KiB', '100KiB', '200KiB',
        '300Kib', '400KiB', '500KiB', '1MiB']

var buffers = _.zipObject(buf_spec, _.map(buf_spec, iec_buffer))

function iec_buffer (sz_in_a_string) {
  return new Buffer(iec_bytes(sz_in_a_string))
}

function iec_bytes (sz) {
  // known bug, if an unaccepted unit is specified, the numeral
  // value of bytes is returned
  // [0] full string; [1] numeral; [2] unit
  // TODO if (sz.IsInteger) return sz
  var multiplier = 1
  var compartmentalised = /([0-9]+)\s*(MiB|KiB){0,1}/.exec(sz)

  if (compartmentalised === null) {
    return 0
  }

  switch (compartmentalised[2]) {
    case 'MiB':
      multiplier = 1024 * 1024
      break
    case 'KiB':
      multiplier = 1024
      break
    default:
      multiplier = 1
  }

  return compartmentalised[1] * multiplier
}

function process_size (request, response) {
  console.log('request made for: ' + request.params.sz)

  if (buffers[request.params.sz] !== undefined) {
    response.set('Content-Type', 'application/octet-stream')
    response.send(buffers[request.params.sz])
  } else {
    response.status(404).send('Not Found size: ' + request.params.sz)
  }
}

app.post('/resultsupload', type , function (req, res, next) {
// req.file //is the `avatar` file
// req.body will hold the text fields, if there were any
//console.log(req.file.path);
fs.rename(''+req.file.path ,'uploads/'+(new Date().toISOString() )+".csv" , function(err) {
   // console.log("Rename");
  })
   res.send("ok")
})




module.exports.iec_bytes = iec_bytes
module.exports.iec_buffer = iec_buffer
module.exports.process_size = process_size

// TODO - protect via a command line switch
//
app.get('/sized/:sz', process_size)

var httpServer = http.createServer(app);
//var httpsServer = https.createServer(credentials, app);

httpServer.listen(listen_port_http);
//httpsServer.listen(listen_port_https);

console.log('Now listening port ' + listen_port_http + 'for http and port' +listen_port_https+ 'for https' )
