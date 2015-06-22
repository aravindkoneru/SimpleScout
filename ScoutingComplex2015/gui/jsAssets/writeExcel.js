var writer = require('../../DataEntry/write-excel.js');

var eventCode = process.argv[2];

writer.write(eventCode);

