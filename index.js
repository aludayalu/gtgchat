const io = require("socket.io")(8080, {
    cors: {
      origin: '*',
    }
  });
const users = {};

io.on('connection',socket=>{
    socket.on('new-user-joined',name => {
        console.log(name)
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',`${name} joined the chat!`)
        socket.broadcast.emit('peeps',Object.keys(users).length)
        socket.emit('peeps',Object.keys(users).length)
    });
    socket.on('msg',data=>{
        socket.broadcast.emit('receive',{message: data, name: users[socket.id]})
    });
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-left',users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit('peeps',Object.keys(users).length)
    });
})