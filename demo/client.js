var interlevel = require('../index')
var db = interlevel.client({ host: "127.0.0.1", port: 28334 })
var k,v;
if (process.argv.length === 3) {
  // get
  k = process.argv[2]
} else if (process.argv.length === 4) {
  k = process.argv[2]
  v = process.argv[3]
  if (/,/.test(v)) {
    v = v.split(',')
  }
  console.log("v=",v, typeof v)
}

if (k) {
  if (v) {
    // put
    db.put(k, v, function (err) {
      if (err) {
        console.log("error", err)
      } else {
        console.log("saved")
      }
      process.exit()
    })
  } else {
    // get
    db.get(k, function (err, value) {
      if (err) {
        console.log("error", err)
      } else {
        console.log(value, typeof value) 
      }
      process.exit()
    })
  }
} else {
  console.log("Syntax:")
  console.log("[Put]")
  console.log("$ node demo/client [key] [val]")
  console.log("[Get]")
  console.log("$ node demo/client [key]")
  process.exit()
}
