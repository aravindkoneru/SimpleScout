var lib = require('./index.js');

function write(eventCode){
  lib.makeScoutingFile(eventCode);
}

module.exports = {
	write: write
};