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
  console.log("made socket connection", socket.id);

  function updateNicknames() {
    io.sockets.emit("newUser", Object.keys(users));
  }

  socket.on("newUser", function (data, callback) {
    if (data.handle in users) {
      callback(false);
      console.log("No se puede agregar.");
    } else {
      callback(true);
      console.log("Agregando usuario.");
      socket.nickname = data.handle;
      users[socket.nickname] = socket;
      //nicknames.push(socket.nickname);
      console.log(Object.keys(users));
      io.sockets.emit("newUser", Object.keys(users));
    }
  });

  socket.on("chat", function (data, callback) {
    console.log(data);
    if (data.handleDestination !== "") {
      if (data.handleDestination in users) {
        users[data.handleDestination].emit("chat", {
          handle: `Message of ${socket.nickname}`,
          message: data.message,
        });
        users[socket.nickname].emit("chat", {
          handle: `Message to ${data.handleDestination}`,
          message: data.message,
        });
        io.sockets.emit("stopTyping", { stop: "true" });
      } else {
        console.log("User not found");
      }
    } else {
      io.sockets.emit("chat", data);
    }
  });

  // Handle typing event
  socket.on("typing", function (data) {
    socket.broadcast.emit("typing", data);
  });

  socket.on("disconnect", function (data) {
    if (!socket.nickname) return;
    delete users[socket.nickname];
    updateNicknames();
  });
});
