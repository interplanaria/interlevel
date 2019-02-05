const zmq = require('zeromq')
const level = require('level')

var Methods = function(o) {
  let req = zmq.socket('req');
  let callback
  req.on('message', function(data) {
    let res = data.toString()
    let o = JSON.parse(res)
    if (o.success) {
      if (o.type === 'get') {
        callback(null, o.message)
      } else if (o.type === 'put') {
        callback(null)
      }
    } else {
      if (o.type === 'get') {
        callback(o.message, null)
      } else if (o.type === 'put') {
        callback(o.message)
      }
    }
  });
  req.connect('tcp://' + o.host + ':' + o.port)
  this.get = function(k, cb) {
    callback = cb
    req.send(JSON.stringify({ k: k }))
  }
  this.put = function(k, v, cb) {
    callback = cb
    req.send(JSON.stringify({ k: k, v: v }))
  }
}
var server = function(o) {
  let db
  if (o.db) {
    db = o.db
  } else {
    db = level(o.store)
  }
  let responder = zmq.socket('rep');
  responder.on('message', function(request) {
    let m = request.toString()
    let o = JSON.parse(m)
    if (o.k) {
      if (o.v) {
        // put
        db.put(o.k, o.v, function (err) {
          let r
          if (err) {
            r = { success: false, type: 'put', message: err.toString() }
          } else {
            r =  { success: true, type: 'put', message: null }
          }
          let rs = JSON.stringify(r)
          responder.send(rs)
        })
      } else {
        // get
        db.get(o.k, function (err, v) {
          let r
          if (err) {
            r = { success: false, type: 'get', message: err.toString() }
          } else {
            r = { success: true, type: 'get', message: v }
          }
          let rs = JSON.stringify(r)
          responder.send(rs)
        })
      }
    } else {
      let r = { success: false, type: null, message: "no key" }
      let rs = JSON.stringify(r)
      responder.send(rs)
    }
  });
  responder.bind('tcp://*:' + o.port, function(err) {
    if (err) {
      console.log(err);
    } else {
      console.log("Listening on " + o.port);
    }
  });
  process.on('SIGINT', function() {
    responder.close();
  });
  return responder
}
var client = function(o) {
  let c = new Methods(o)
  return c
}
module.exports = {
  server: server, client: client
}
