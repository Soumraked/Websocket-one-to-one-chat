var express = require("express");
var socket = require("socket.io");

// App setup
var app = express();
var serve = app.listen(4000, function () {
  console.log("Listen for request on port 4000");
});

// Static files
app.use(express.static("public"));

// Socket setup & pass serve
var io = socket(serve);

// users storage
var users = {};
io.on("connection", (socket) => {
  function updateNicknames() {
    io.sockets.emit("newUser", Object.keys(users));
  }
  // append new user
  socket.on("newUser", function (data, callback) {
    if (data.handle in users) {
      callback(false);
    } else {
      callback(true);
      const address = socket.request.connection._peername;
      console.log(
        "Server says: the IP " +
          address.address +
          " with the PORT " +
          address.port +
          " was assigned to '" +
          data.handle +
          "'"
      );
      socket.nickname = data.handle;
      users[socket.nickname] = socket;
      io.sockets.emit("newUser", Object.keys(users));
    }
  });
  // send message according to your recipient
  socket.on("chat", function (data, callback) {
    if (data.handleDestination !== "") {
      if (data.handleDestination in users) {
        users[data.handleDestination].emit("chat-private", {
          handle: socket.nickname,
          message: "of:" + data.message,
        });
        users[socket.nickname].emit("chat-private", {
          handle: data.handleDestination,
          message: "to:" + data.message,
        });
      } else {
        io.sockets.emit("chat-public", data);
      }
    } else {
      io.sockets.emit("chat-public", data);
    }
  });
  // disconnect user
  socket.on("disconnect", function (data) {
    if (!socket.nickname) return;
    delete users[socket.nickname];
    updateNicknames();
  });
});
