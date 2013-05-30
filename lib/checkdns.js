var dns = require('dns');
var fs = require('fs');
var clc = require('cli-color');/* https://npmjs.org/package/cli-color */
clc.mBlue = clc.xterm(39);
clc.mGreen = clc.xterm(35);

var displayCol1Size = 60;

var displayError = function(Err) {
  console.log(Err);
}

var parseFile = function(file, callback) {
  fs.readFile(file, function (err, data) {
    if (err) {
      displayError(err);
      return;
    }

    var domains = data.toString().split(/\n|;/);
    callback(domains);
  });
}

var formatLine = function(el1 , el2) {
  var lengthEl1 = displayCol1Size;
  var nbSp = lengthEl1 - el1.length;
  var addSp = '\t';

  if( nbSp > 0 ) {
    addSp = '';
    for( var i = 0 ; i < nbSp ; i++ ) {
      addSp += ' ';
    }
  }

  return el1 + addSp + el2;
}


/* 
  Export
*/

var nslookup = function(domain, rtype) {
  var rtype = rtype ? rtype : 'A';

  /* TODO: if ip address => resolve => rtype = ptr */

  dns.resolve(domain, rtype, function(err, addresses){
    if(err) {
      displayError(clc.red('Error: ' + clc.bold(domain) + '. -> ' + err));
      return;
    }

    /* TODO: if rtype - address is object */
    var message = formatLine('[] Domain: ' + clc.mGreen(domain), 'Address: ' + clc.mBlue(addresses));

    console.log(message);
  });
}

var nslookupFromFile = function(file, rtype) {
  var rtype = rtype ? rtype : 'A';
  fs.exists(file, function (exists) {
    if(!exists) {
      displayError('File does not exists. (' + file + ')');
      return;
    }

    parseFile(file, function(domains){
      domains.forEach(function(domain){
        if( domain.length ) nslookup(domain, rtype);
      });
    });
  });
}

module.exports = checkDNS = {
  nslookup: nslookup,
  nslookupFromFile: nslookupFromFile
};
