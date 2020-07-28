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
var users = {};
io.on("connection", (socket) => {
  function updateNicknames() {
    io.sockets.emit("newUser", Object.keys(users));
  }

  socket.on("newUser", function (data, callback) {
    if (data.handle in users) {
      callback(false);
    } else {
      callback(true);
      socket.nickname = data.handle;
      users[socket.nickname] = socket;
      io.sockets.emit("newUser", Object.keys(users));
    }
  });

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
        console.log("User not found");
      }
    } else {
      io.sockets.emit("chat-public", data);
    }
  });

  socket.on("disconnect", function (data) {
    if (!socket.nickname) return;
    delete users[socket.nickname];
    updateNicknames();
  });
});
