Checkdns
========

node.js - Resolution of domain names or IP addresses given or from a file. 

## Installation
```
$ npm install checkdns
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

With rtype :
```
checkdns github.com -t [cname|ns|txt|aaaa|mx|ptr]
```

Using file:
You can use a file with a list of domains. There are separate by return line or ';'.
```
checkdns myFile
checkdns myFile -t ...
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