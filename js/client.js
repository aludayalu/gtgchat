var socket = io.connect('http://aaravdayal-63532.portmap.host:63532');
const form = document.getElementById('send-container')
const send_div = document.getElementById('send')
const loader_div = document.getElementById('loader')
const container_div = document.getElementById('container')
const msginput=document.getElementById('msginput')
const msgcontainer=document.querySelector('.container')
const nop=document.getElementById('nop')

function force_prompt(the_prompt){
    while (true){
        out=prompt(the_prompt)
        if (out==""||out==null){
        }else{
            return out
        }
    }
}

const uname = force_prompt("Kindly enter your name to join")
socket.emit('new-user-joined',uname)

var notify_sound= new Audio("https://bit.ly/3u4kZGC");
const append = (msg,pos)=>{
    const msg_elem=document.createElement('div');
    msg_elem.innerText=msg;
    msg_elem.classList.add('message')
    msg_elem.classList.add(pos)
    msgcontainer.append(msg_elem)
    if (pos=='left'){
        notify_sound.play();
    }
    msgcontainer.scrollTop = msgcontainer.scrollHeight;
}

append('You joined the chat','left')

socket.on('user-joined',data=>{
    append(data,'left')
})

socket.on('receive',data=>{
    append(`${data.name} : ${decrypt("uwu",data.message)}`,'left')
})

socket.on('user-left',data=>{
    append(`${data} left the chat`,'left')
})

socket.on('peeps',data=>{
$('#send').show()
$('#container').show()
$('#loader').hide()
    nop.innerText=`Total Number of people online : ${data}`
})

form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const msg=msginput.value;
    if (msg!=""){
    append(`You : ${msg}`,'right')
    socket.emit('msg',crypt("uwu",msg))
    msginput.value=""}
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