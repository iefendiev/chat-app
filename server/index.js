const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 5000;

const router = require('./router');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {
  // console.log('a person is connected...');
  socket.on('join', ({ name, room }, callback) => {
    // console.log('join', name, room);
    const { error, user } = addUser({ id: socket.id, name, room });

    if (error) return callback(error);

    // joins user to the room
    socket.join(user.room);

    socket.emit('message', {
      user: 'admin',
      text: `${user.name}, Welcome to the Room ${user.room}`,
    });

    socket.broadcast.to(user.room).emit('message', {
      user: 'admin',
      text: `${user.name} has been joined to the room!`,
    });
    callback();
  });

  //  sending messages for users
  socket.on('sendMessage', (message, callback) => {
    const user = getUser(socket.id);
    io.to(user.room).emit('message', { user: user.name, text: message });
    callback();
  });

  // DENEME
  socket.on('showUsersInRoom', (room, callback) => {
    const usersInRoom = getUsersInRoom(room);
    io.to(room).emit('users', usersInRoom);
    callback();
  });

  socket.on('disconnect', () => {
    // console.log('person disconnected...');
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit('message', { user: 'admin', text: `${user.name}` });
    }
  });
});

app.use(router);

server.listen(PORT, () => console.log(`Server has started on ${PORT}`));
