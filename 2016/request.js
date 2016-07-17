var http = require("https");
var fs = require('fs');
var Q = require('q');

var auth = fs.readFile("authkey.txt", "utf8", function(err, data){
	if(err){
		return err;
	}
	return data;
});



