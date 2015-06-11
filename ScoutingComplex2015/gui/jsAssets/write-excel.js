var writeExcel = require('../../DataEntry/write.js');

var eventCode = process.argv[2];

writeExcel.write(eventCode);

