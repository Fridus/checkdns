const dns = require('dns');
const fs = require('fs');
const chalk = require('chalk');
const { table, getBorderCharacters, createStream } = require('table');

const rtypeValid = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'PTR', 'ANY'];

const displayError = function (Err) {
  console.log(chalk.red(Err));
};

const parseFile = function (file, callback) {
  fs.readFile(file, function (err, data) {
    if (err) {
      displayError(err);
      return;
    }

    const domains = data.toString().split(/\n|;/);
    callback(domains);
  });
};

const isIPAddress = function (address) {
  const r = '^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9]).){3}(?:25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]|[0-9])$';

  const ipRE = new RegExp(r);

  return ipRE.test(address);
};

const isValidType = function (type) {
  if (rtypeValid.indexOf(type) < 0) {
    return false;
  }
  return true;
};

const print = function (data) {
  console.log(
    table(data, {
      border: getBorderCharacters('void')
    })
  );
};

/*
  Export
*/

const nslookup = function (domain, rtype, cb) {
  rtype = rtype || 'A';
  const isIP = isIPAddress(domain);

  if (!isValidType(rtype)) {
    displayError('Error: Type not vaild.');
    return;
  }

  if (isIP) {
    rtype = 'PTR';
  } else if (rtype === 'PTR') {
    rtype = 'A';
  }

  dns.resolve(domain, rtype, function (err, addresses) {
    if (err) {
      const rowError = [[chalk.red(domain), rtype, chalk.red(err.errno)]];
      if (cb) {
        cb(rowError);
      } else {
        print(rowError);
      }
      return;
    }

    const rows = [];
    switch (rtype) {
    case 'PTR':
      rows.push([
        chalk.blue(domain),
        rtype,
        chalk.green(addresses)
      ]);
      break;
    case 'MX':
      addresses.forEach(function (iSrv, i) {
        rows.push([
          i === 0 ? [chalk.green(domain)] : [],
          rtype,
          chalk.yellow(iSrv.priority),
          chalk.blue(iSrv.exchange)
        ]);
      });
      break;
    case 'ANY':
      addresses.forEach(function (item, i) {
        if (!isValidType(item.type)) {
          return;
        }

        let value = '-';
        if (item.type === 'A' || item.type === 'AAAA') {
          value = item.address;
        } else if (item.type === 'MX') {
          value = item.exchange;
        } else if (item.type === 'NS' || item.type === 'CNAME') {
          value = item.value;
        } else if (item.type === 'TXT') {
          value = item.entries.join();
        }

        rows.push([
          i === 0 ? [chalk.green(domain)] : [],
          item.type,
          chalk.blue(value)
        ]);
      });
      break;
    default:
      rows.push([
        chalk.green(domain),
        rtype,
        chalk.blue(addresses)
      ]);
    }

    if (cb) {
      return cb(rows);
    }

    print(rows);
  });
};

const nslookupFromFile = function (file, rtype) {
  rtype = rtype || 'A';

  if (!isValidType(rtype)) {
    displayError('Error: Type not vaild.');
    return;
  }

  // Check if the file exists in the current directory.
  fs.access(file, fs.constants.F_OK, function (err) {
    if (err) {
      displayError('Error: File does not exists. (' + file + ')');
      return;
    }

    parseFile(file, function (domains) {
      const stream = createStream({
        columnDefault: {
          width: 30
        },
        columns: {
          1: {
            width: 4
          }
        },
        columnCount: 3
      });
      console.log('File "' + file + '": \n');
      domains.forEach(function (domain) {
        if (domain.length) {
          nslookup(domain, rtype, function (rows) {
            rows.forEach(function (row) {
              stream.write(row);
            });
          });
        }
      });
    });
  });
};

module.exports = {
  nslookup: nslookup,
  nslookupFromFile: nslookupFromFile
};
