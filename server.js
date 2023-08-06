const net = require('node:net');

const host = '127.0.0.1';
const port = 37373;
const clients = [];
const server = net.createServer()

class Client{
  constructor(info, socket){
    this.name = info.name;
    this.userName = info.userName;
    this.socket = socket;
    this.id = this.idGen();
  }
  static ID=0;
  idGen(){
    return this.ID++;
  }
}

server.on("connection", socket =>{
  
  socket.on('data', async (mess)=> {
    const dataString = mess.toString('UTF-8');
    const data = JSON.parse(dataString);
    
    if(data.header === 'info'){
      const newClient = new Client(data.mess, socket);
      clients.push(newClient);
    }else{
      clients.forEach(client => {
        if(client.socket !== socket){
          client.socket.write(data.mess)
        }
      })
      console.log(data.mess);
    }
  })
  

})


server.listen(port, host);



