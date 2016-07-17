var readExcel = require('../../DataEntry/read.js');

var filePath = process.argv[2];

readExcel.read(filePath);

