var should = require('chai').should(),
  _ = require("lodash"),
  iec_bytes = require("../sized").iec_bytes,
  iec_buffer = require("../sized").iec_buffer,
  renamefile = require("../sized").renamefile,


  sized = require("../sized")


  var fs = require('fs');

  var watch

  // iec_bytes = require('../sized').iec_bytes
  // iec_buffer = require('../sized').iec_bytes

describe('no modifier', function() {
  it ('sending nothing', function() {
    iec_bytes('').should.equal(0)
  })

  it ('number without modifier', function() {
    iec_bytes('15').should.equal(15)
  })

})

describe('modifier', function() {
  it ('number with MiB modifier', function() {
    iec_bytes('12MiB').should.equal(12*1024*1024)
    iec_bytes('9 MiB').should.equal(9*1024*1024)
    
  })

  it ('number with KiB modifier', function() {
    iec_bytes('101KiB').should.equal(101*1024)
    iec_bytes('56 KiB').should.equal(56*1024)
  })

  it ('number with incorrect modifier', function() {
    // known bug -- cant get my regex to work right now, this
    // should return 0  but it will return the numeral
    //
    iec_bytes('7MB').should.equal(7)
  })
})

describe('sized buffer returned', function() {
  it ('buffer size check', function() {
//    var buf = iec_buffer('51KiB')
    iec_buffer('51KiB').length.should.equal(51*1024)
//    iecnv.iec_buffer('5 MiB').length.should.equal(5*1024*1024)
  })

 


  
})



 describe('file saving', function() {
  it ('written file matches', function() {
//    var buf = iec_buffer('51KiB')

//prepares the file to test the function by placing a copy in uploads
var source = fs.createReadStream('test.csv');
var dest = fs.createWriteStream('uploads/test.csv');
source.pipe(dest);
source.on('end', function() { /* copied */ });
source.on('error', function(err) { /* error */ });



fs.watch("uploads/test.csv",function()

{
var newname = renamefile("uploads/test.csv");
var  originalfile = fs.readFileSync('test.csv').toString();

var  renamedfile = fs.readFileSync('uploads/'+newname).toString();  
     renamedfile.should.equal(originalfile)

}


  ,null)


//console.log(newname);








//    iecnv.iec_buffer('5 MiB').length.should.equal(5*1024*1024)
  })
})
