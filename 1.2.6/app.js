const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  const fs = require("fs")
  let fileName = "counter.txt"
  let count = +fs.readFileSync(fileName)
  res.send(`${++count}`)
  fs.writeFileSync(fileName, (count+""), "utf8")
})

app.listen(port, () => {
  console.log("Counter")
})