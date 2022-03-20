const express = require("express");
const app = express();
const {v4: uuidV4} = require('uuid');
const http = require('http');
const server = http.Server(app);
const io = require('socket.io')(server);

app.use(express.static("public"));
app.set("view engine","ejs");

server.listen(4000, ()=>{
  console.log('HTTP SERVER IS LISTENING ON PORT 4000');
});

app.get('/',(req,res)=>{
  res.redirect(`/${uuidV4()}`);
})

app.get('/:room',(req,res)=>{
  console.log(req.params.room);
  res.render('index', {roomId: req.params.room});
})

/*

io.on("connection",function (socket){
  console.log(`USER ${socket.id} đang kết nối đến.`);
  socket.on("disconnection", function(socket){
    console.log(`USER ${socket.id} ngắt kết nối`);
  })
  socket.on("client-send-message",function(message){
    console.log(`USER ${socket.id} vừa mới nói :${message}`)
  })
  io.sockets.emit("server-send-message","hello con cặc");
  //socket.emit("server-send-message","hello con cặc");
  //socket.broadcast.emit("server-send-message","hello con cặc");
})
*/

io.on('connection', socket => {
  socket.on('join-room',(room_id,user_id) => {
    /*console.log(`ROOM_ID ${room_id}`);
    console.log(`USER_ID ${user_id}`);*/
    socket.join(room_id);
    socket.to(room_id).emit('user_connected', user_id);

    socket.on('disconnected', ()=>{
      socket.broadcast.to(room_id).emit('user_disconnected', user_id);
    })
  })

})
