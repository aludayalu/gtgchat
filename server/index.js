PORT=8080
port=8080
const io = require("socket.io")(port, {
    cors: {
      origin: '*',
    }
  });
const users = {};
console.log(`Server started on port ${port}`)

io.on('connection',socket=>{
    socket.on('new-user-joined',name => {
        console.log(`${name} Joined the chat!`)
        users[socket.id]=name;
        socket.broadcast.emit('user-joined',`${name} joined the chat!`)
        socket.broadcast.emit('peeps',Object.keys(users).length)
        socket.emit('peeps',Object.keys(users).length)
    });
    socket.on('msg',data=>{
        socket.broadcast.emit('receive',{name : users[socket.id] , message: data})
        d=decrypt("uwu",data)
        console.log({name: data.name , message: d,s_name: users[socket.id]});
    });
    socket.on('disconnect',()=>{
        socket.broadcast.emit('user-left',users[socket.id]);
        delete users[socket.id];
        socket.broadcast.emit('peeps',Object.keys(users).length)
        console.log(`${users[socket.id]} Left the chat!`)
    });
})

const crypt = (salt, text) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const byteHex = (n) => ("0" + Number(n).toString(16)).substr(-2);
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
  
    return text
      .split("")
      .map(textToChars)
      .map(applySaltToChar)
      .map(byteHex)
      .join("");
  };
  
  const decrypt = (salt, encoded) => {
    const textToChars = (text) => text.split("").map((c) => c.charCodeAt(0));
    const applySaltToChar = (code) => textToChars(salt).reduce((a, b) => a ^ b, code);
    return encoded
      .match(/.{1,2}/g)
      .map((hex) => parseInt(hex, 16))
      .map(applySaltToChar)
      .map((charCode) => String.fromCharCode(charCode))
      .join("");
  };