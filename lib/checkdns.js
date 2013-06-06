var dns = require('dns');
var fs = require('fs');
var clc = require('cli-color');/* https://npmjs.org/package/cli-color */
clc.mBlue = clc.xterm(39);
clc.mGreen = clc.xterm(35);
clc.orange = clc.xterm(216);

var displayCol1Size = 45;
var rtypeValid = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'PTR'];

var displayError = function(Err) {
  console.log(clc.red(Err));
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

var formatLine = function(el1 , el2, offset) {
  var offset = offset ? offset : 0,
      lengthEl1 = displayCol1Size,
      nbSp = lengthEl1 - el1.length + offset,
      addSp = '\t';

  if( nbSp > 0 ) {
    addSp = '';
    for( var i = 0 ; i < nbSp ; i++ ) {
      addSp += ' ';
    }
  }

  return el1 + addSp + el2;
}

var isIPAddress = function(address) {
  var r = '^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$',
      ipRE = new RegExp(r);

  return ipRE.test(address);
}

var isValidType = function(type) {
  if( rtypeValid.indexOf(type) < 0 ) {
    return false;
  }
  return true;
}

/* 
  Export
*/

var nslookup = function(domain, rtype) {
  var rtype = rtype ? rtype : 'A',
      isIP = isIPAddress(domain),
      message = '';

  if( !isValidType(rtype) ) {
    displayError('Error: Type not vaild.');
    return;
  }

  if(isIP) {
    rtype = 'PTR';
  } else if( rtype === 'PTR') {
    rtype = 'A';
  }

  dns.resolve(domain, rtype, function(err, addresses){
    if(err) {
      displayError('Error: ' + clc.bold(domain) + '. -> ' + err);
      return;
    }

    switch(rtype) {
    case 'PTR':
      message = formatLine('[] Address: ' + clc.mBlue(domain), 'Domain: ' + clc.mGreen(addresses), clc.mBlue('').length);
      break;
    case 'MX':
      addresses.forEach(function(i_srv, i) {
        var el1 = 
        message += formatLine((i === 0 ? '[] Domain: ' + clc.mGreen(domain) : ''), 'Exchange: ' + clc.mBlue(i_srv.exchange) + ', priority: ' + clc.orange(i_srv.priority) + (i+1 < addresses.length ? '\n' : ''), (i === 0 ? clc.mGreen('').length : 0 ));
      });
      break;
    case 'CNAME':
      message = formatLine('[] Domain: ' + clc.mGreen(domain), 'Host: ' + clc.mBlue(addresses), clc.mGreen('').length);
      break;
    case 'TXT':
      message = formatLine('[] Domain: ' + clc.mGreen(domain), 'TXT: ' + clc.mBlue(addresses), clc.mGreen('').length);
      break;
    case 'NS':
      message = formatLine('[] Domain: ' + clc.mGreen(domain), 'NS: ' + clc.mBlue(addresses), clc.mGreen('').length);
      break;
    default:
      message = formatLine('[] Domain: ' + clc.mGreen(domain), 'Address: ' + clc.mBlue(addresses), clc.mGreen('').length);
    }

    console.log(message);
  });
}

var nslookupFromFile = function(file, rtype) {
  var rtype = rtype ? rtype : 'A';

  if( !isValidType(rtype) ) {
    displayError('Error: Type not vaild.');
    return;
  }

  fs.exists(file, function (exists) {
    if(!exists) {
      displayError('Error: File does not exists. (' + file + ')');
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
