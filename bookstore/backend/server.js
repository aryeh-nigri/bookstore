const express = require("express");
const server = require('http').Server(express);
const io = require('socket.io')(server);
const mongoose = require("mongoose");
const cors = require('cors');

const app = express();

// Bodyparser Middleware
app.use(express.json());

// DB Config
const db = require("./config/keys").mongoURI;

// Connect to Mongo
mongoose
  .connect(db, {
    useNewUrlParser: true,
    useCreateIndex: true
  }) // Adding new mongo url parser
  .then(() => console.log("MongoDB Connected..."))
  .catch(err => console.log(err));


app.use(cors());

// Use Routes
app.use("/api/users", require("./routes/api/users"));
app.use("/api/books", require("./routes/api/books"));
app.use("/api/auth", require("./routes/api/auth"));

// // Serve static assets if in production
// if (process.env.NODE_ENV === 'production') {
//   // Set static folder
//   app.use(express.static('client/build'));

//   app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
//   });
// }

const port = process.env.PORT || 8080;

app.listen(port, () => console.log(`Server started on port ${port}`));

// Socket.io

const socketPort = 80;
server.listen(socketPort, () => console.log(`WebSocket listening to port ${socketPort}`));

let pot = 0;
let names = [];
let serverNames = [];
io.on('connection', socket => {
  // below we listen if our pot is updated
  // then emit an event to all connected sockets about the update
  socket.on('UPDATE_POT', state => {
    pot = state.pot;
    socket.broadcast.emit('UPDATED_POT', state);
  });

  // get the current pot's value and emit it to clients
  socket.on('GET_CURRENT_POT', () => socket.emit('CURRENT_POT', pot));

  // add the newest client to the list of active clients
  // then broadcast that to all connected clienhts 
  socket.on('SEND_NAME_TO_SERVER', name => {
    serverNames = [...serverNames, { socketId: socket.id, name }];
    names = [...names, name];
    socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', names);
    socket.emit('SEND_NAMES_TO_CLIENTS', names);
  });

  // broadcast to everyone if somebody pitched in
  socket.on('SOMEONE_PITCHED_IN', name => {
    socket.broadcast.emit('GUESS_WHO_PITCHED_IN', name);
  });

  // broadcast to everyone if somebody got one
  socket.on('SOMEONE_GOT_ONE', name => {
    socket.broadcast.emit('GUESS_WHO_GOT_ONE', name);
  });


  // this is to make sure that when a client disconnects
  // the client's name will be removed from our server's list of names
  // then broadcast that to everybody connected so their list will be updated
  socket.on('disconnect', () => {
    serverNames = serverNames.filter(data => data.socketId !== socket.id);
    names = serverNames.map(data => data.name);
    socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', names);
    socket.emit('SEND_NAMES_TO_CLIENTS', names);
  });
});


// NOVO

// // /server.js
// const app = require('express')();
// const server = require('http').Server(app);
// const io = require('socket.io')(server);
// const cors = require('cors');

// // we will use port 8000 for our app
// server.listen(8000, () => console.log('connected to port 8000!'));

// // only use this for dev purposes
// app.use(cors());

// let pot = 0;
// let names = [];
// let serverNames = [];
// io.on('connection', socket => {
//   // below we listen if our pot is updated
//   // then emit an event to all connected sockets about the update
//   socket.on('UPDATE_POT', state => {
//     pot = state.pot;
//     socket.broadcast.emit('UPDATED_POT', state);
//   });

//   // get the current pot's value and emit it to clients
//   socket.on('GET_CURRENT_POT', () => socket.emit('CURRENT_POT', pot));

//   // add the newest client to the list of active clients
//   // then broadcast that to all connected clienhts 
//   socket.on('SEND_NAME_TO_SERVER', name => {
//     serverNames = [...serverNames, { socketId: socket.id, name }];
//     names = [...names, name];
//     socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', names);
//     socket.emit('SEND_NAMES_TO_CLIENTS', names);
//   });

//   // broadcast to everyone if somebody pitched in
//   socket.on('SOMEONE_PITCHED_IN', name => {
//     socket.broadcast.emit('GUESS_WHO_PITCHED_IN', name);
//   });

//   // broadcast to everyone if somebody got one
//   socket.on('SOMEONE_GOT_ONE', name => {
//     socket.broadcast.emit('GUESS_WHO_GOT_ONE', name);
//   });


//   // this is to make sure that when a client disconnects
//   // the client's name will be removed from our server's list of names
//   // then broadcast that to everybody connected so their list will be updated
//   socket.on('disconnect', () => {
//     serverNames = serverNames.filter(data => data.socketId !== socket.id);
//     names = serverNames.map(data => data.name);
//     socket.broadcast.emit('SEND_NAMES_TO_CLIENTS', names);
//     socket.emit('SEND_NAMES_TO_CLIENTS', names);
//   });
// });