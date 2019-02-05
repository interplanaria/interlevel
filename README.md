# interlevel

A remote LevelDB server, powered by ZeroMQ

# Install

```
npm install --save interlevel
```

# Usage

## 1. Server

### A. Set up a server from scratch

```
var L = require('interlevel')
L.server({ store: "./.state", port: 28334 })
```

### B. Set up a server from existing Leveldb object

```
// Existing local leveldb
var level = require('level')
var localdb = level('./db')

// Set up a server from local leveldb
var L = require('interlevel')
L.server({ db: localdb, port: 28334 })
```

## 2. Client

Set up a client

```
var L = require('interlevel')
var db = L.client({ host: "168.34.234.2", port: 28334 })
db.put('name', 'Level', function (err) {
  if (err) return console.log('Ooops!', err)
  db.get('name', function (err, value) {
    if (err) return console.log('Ooops!', err)
    console.log('name=' + value)
  })
})
```
