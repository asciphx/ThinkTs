import * as $ from "socket.io"; import * as _ from 'underscore';import * as o from "os"
// client.emit() ：向建立该连接的客户端广播console.log(users)查看客户端的人数
// client.broadcast.emit() ：向除去建立该连接的客户端的所有客户端广播
// 通过该连接对象（toSocket）与链接到这个对象的客户端进行单独通信
let rooms = new Array(), userNum = 0, users = {}, io
export default {
  users,rooms,userNum,
  init(args) {
    io = new $.Server(args);
    io.sockets.on("connection", socket => {
      socket.emit('login', socket.id); userNum++; users[socket.id] = 1;
      socket.on('message', mes => {
        console.log(mes)
        switch (mes.d) {
          case "all": mes.r ? io.to(mes.r).emit("message", mes) : io.emit("message", mes); break
          case "del": mes.r ? socket.leave(mes.r) : socket.disconnect(true); break
          default: mes.r ? socket.broadcast.to(mes.r).emit('message', mes) : socket.broadcast.emit('message', mes)
        }
      });
      socket.on('create or join', room => {
        const num = io.nsps['/'].adapter.rooms[room]
        if (num === undefined) {
          let obj = {}
          socket.join(room); io.emit('created', room);
          Object.defineProperty(obj, room, {
            enumerable: true,
            configurable: false,
            writable: true,
            value: new Array(socket.id)
          });
          rooms.push(obj);
          socket.emit('joined', socket.id, room)
        } else if (num.length < 4) {
          rooms[rooms.findIndex(v => Object.keys(v)[0] === room)][room].push(socket.id)
          socket.emit('getRoomPlayers', Object.keys(num.sockets));
          socket.join(room); socket.emit('joined', socket.id, room)
          socket.broadcast.to(room).emit('playerCome', socket.id)
          if (num.length === 4) io.sockets.in(room).emit('ready')
        } else {
          socket.emit('full', room);
        }
        socket.emit('log', '房间：' + room + ' 有 ' + (num ? num.length : 1) + '个用户');
      });
      socket.on("leaveRoom", room => {
        if (room === "") return;
        const idex = rooms.findIndex(v => Object.keys(v)[0] === room)
        let players = rooms[idex][room]
        players.splice(players.findIndex(v => v === socket.id), 1)
        io.to(room).emit("leaveRoom", room, socket.id); socket.leave(room)
        if (io.nsps['/'].adapter.rooms[room] === undefined) {
          io.emit("destroyRoom", room);
          rooms.splice(idex, 1)
        }
      })
      socket.on("getRooms", () => {
        let list = [];
        rooms.forEach(v => { list.push(Object.keys(v)[0]) })
        socket.emit("getRooms", list)
      })
      socket.on("getUsers", bool => {
        if (bool) socket.broadcast.emit('userCome', socket.id, userNum)
        socket.emit("getUsers", Object.keys(users), userNum);
      })
      socket.on('IPv4', () => {
        var ifaces = o.networkInterfaces();
        for (let dev in ifaces) {
          ifaces[dev].forEach(details => {
            if (details.family === 'IPv4' && details.address !== '127.0.0.1') {
              socket.emit('IPv4', details.address)
            }
          });
        }
      });
      socket.on("disconnect", () => {
        userNum--; delete users[socket.id];
        const idex = rooms.findIndex(v => Object.entries(v)[0][1].toString().indexOf(socket.id) > -1)
        if (idex === -1) { socket.broadcast.emit('exit', socket.id); return; }
        const room = Object.keys(rooms[idex])[0];
        if (io.nsps['/'].adapter.rooms[room] === undefined) {
          rooms.splice(idex, 1)
          socket.broadcast.emit('exit', socket.id, true);
          return
        } else socket.broadcast.to(room).emit("leaveRoom", room, socket.id)
        socket.broadcast.emit('exit', socket.id)
      });
    });
  },
  del(id) {
    if (io.sockets.connected[id]) {
      _.findWhere(io.sockets.sockets, { id: id }).disconnect(true);
    }
  }
}