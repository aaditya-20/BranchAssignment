const express = require('express')
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const http = require('http').createServer(app)
const userRoutes = require("./routes/userRoutes")
const queryRoutes = require("./routes/queriesRoutes")
// console.log(window)
const io = require('socket.io')(http, {
    cors: {
      origin: `*`
    }
  });
const { port,mongo_url } = require('./config');
app.use(cors());
app.use(express.json());
app.use("/api/auth",userRoutes)
app.use("/api/queries",queryRoutes)

const URL=mongo_url;

mongoose.connect(URL).then(()=>{
    console.log("Connected")
}).catch((err)=>{
    console.log(err," pls solve this error")
})
http.listen(port, function() {
  console.log(`listening on port ${port}`);
})
io.on('connection', socket => {
  socket.on('message', ({ userId, message }) => {
    io.emit('message', { userId, message });
  })
  socket.on('resolve', ({ queryId, solution }) => {
    io.emit('resolve', { queryId, solution });
  })
})
