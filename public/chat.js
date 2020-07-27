// Make connection
var socket = io.connect("http://localhost:4000");

// Query DOM
var message = document.getElementById("message"),
  handle = document.getElementById("handle"),
  handleError = document.getElementById("handleError"),
  btn = document.getElementById("send"),
  output = document.getElementById("output"),
  feedback = document.getElementById("feedback"),
  btnNewUser = document.getElementById("sendUser"),
  usernames = document.getElementById("usernames"),
  handleDestination = document.getElementById("handleDestine");

// Emit event
btn.addEventListener("click", function () {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
    handleDestination: handleDestination.value,
  });
  handleDestination.value = "";
  message.value = "";
});

btnNewUser.addEventListener("click", function () {
  socket.emit(
    "newUser",
    {
      handle: handle.value,
    },
    function (data) {
      if (data) {
        handleError.innerHTML = "";
      } else {
        handleError.innerHTML = "El nombre de usuario ya está utilizado.";
      }
    }
  );
});

message.addEventListener("keypress", function () {
  socket.emit("typing", handle.value);
});

// Listen for events
socket.on("chat", function (data) {
  feedback.innerHTML = "";
  console.log("En chat chat");
  output.innerHTML +=
    "<p><strong>" + data.handle + ": </strong>" + data.message + "</p>";
});

socket.on("typing", function (data) {
  feedback.innerHTML = "<p><em>" + data + " is typing a message...</em></p>";
});

socket.on("stopTyping", function () {
  feedback.innerHTML = "";
});

socket.on("newUser", function (data) {
  var html = "Usuarios conectados<br/>";
  for (let i = 0; i < data.length; i++) {
    html += data[i] + "<br/>";
  }
  usernames.innerHTML = html;
});
