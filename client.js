const net = require('node:net');
const readline = require("node:readline/promises")
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

const PORT = 37373;
const HOST = '127.0.0.1';

const socket = net.createConnection({port: PORT, host: HOST})

class Data{
    constructor(header, mess){
    this.header = header;
    this.mess = mess;
  }
}

async function info(){
  const name = await rl.question('Enter your name: ');
  const userName = await rl.question('Enter your userName: ');
  return {name, userName};
}

function showPrompt(){
  console.log("Enter your message--> ");
}

function printMessage(message, ownMessage = false){
  // Move up the cursor
  process.stdout.moveCursor(0, -1);
  if(ownMessage) process.stdout.moveCursor(0, -1);
  // Clear prompt line
  process.stdout.clearLine(0);
  process.stdout.cursorTo(0);

  console.log(message);
  showPrompt();
}

socket.on('data', data=>{
  printMessage(data.toString('utf-8'))
})
async function input(){
  const message = await rl.question('');
  return message;
}

async function sendData(header, mess){
  const data = new Data(header, mess);
  const dataString = JSON.stringify(data);
  socket.write(dataString);
 // console.log("send data is terminated")
}
async function main(){
  const information = await info();
  sendData('info', information);
  showPrompt();
  while(true){
    const mess = await input();
    printMessage(mess, true);
    if(mess === '.exit'){
      rl.close();
      socket.end();
      break;
    } 
    sendData('message', mess);
  }
}
main();
