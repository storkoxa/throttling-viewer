const path = require('path');
const Throttling = require('./throttling.js')
const LSet = require('./limit_set.js')

const port = process.env.PORT || 5000;


const express = require('express');
const app = express();
app.use(express.json());

const http = require('http').Server(app);
const io = require('socket.io')(http);


let requests = new LSet({ limit: 500, oldest: 60000, every: 1000 })


list = [
  { name: "Per 5 seconds", per: 5000 },
  { name: "Every second", per: 1000 },
  { name: "Every minute", per: 60000 }
].map(v => new Throttling(requests, v))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname + '/index.html'));
})


app.all(['/ms', '/ms/:path*'], (req, res) => {
  requests.add(Date.now())
  res.json(JSON.parse(`{ "responses": [ { "id": "${req.body?.requests?.[0]?.id}", "status": 201, "headers": { "Cache-Control": "private", "Content-Type": "application/json" }, "body": { "id": "id" } } ] }`));
})

app.all(['/google', '/google/:path*'], (req, res) => {
  requests.add(Date.now())
  res.json(JSON.parse(` {"id": "${req.body?.id}"}`))
})

app.all('/post/:path', (req, res) => {
  requests.add(Date.now())
  res.json(`{OK}`)
})



http.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})


io.on('connection', function (socket) {

  setInterval(function () {

    let json = []
    list.forEach(e => {
      json.push({ name: e.name, interval: e.per, result: e.result })
    })

    socket.emit('update', json);
  }, 1000);

  socket.on('disconnect', function () {
    console.log('A user disconnected');
  });
});

