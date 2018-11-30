Checkdns
========

node.js - Resolution of domain names or IP addresses given or from a file.  
Node v6+

## Installation
```
$ npm install -g checkdns
```

## Use command line

Help:
```
checkdns -h
```

Use:
```
checkdns github.com [domain2] [domain3] ...
checkdns 204.232.175.90 [IP2] [IP3] ...
```

With rtype (type `any` with node v8+):
```
checkdns github.com -t [cname|ns|txt|aaaa|mx|ptr|any]
```

Using file:
You can use a file with a list of domains. There are separate by return line or ';'.
```
checkdns -f myFile
checkdns -f myFile -t ...
```

## Usage

```
var checkdns = require('checkdns');
```

Resolve a domain:
```
checkdns.nslookup(domain, rtype);
```

Resolve domains from a file:

```
checkdns.nslookupFromFile(file, rtype);
```
