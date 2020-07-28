// Make connection
var socket = io.connect("http://localhost:4000");

var history = {};

// Query DOM
var message = document.getElementById("message"),
  handle = document.getElementById("handle"),
  handleError = document.getElementById("handleError"),
  btn = document.getElementById("send"),
  output = document.getElementById("output"),
  btnNewUser = document.getElementById("sendUser"),
  usernames = document.getElementById("usernames"),
  handleDestination = document.getElementById("handleDestine"),
  userName = document.getElementById("userName"),
  login = document.getElementById("login"),
  roomChat = document.getElementById("room-chat"),
  nameChat = document.getElementById("nameChat");

function printChat(name) {
  if (name in history) {
    output.innerHTML = "";
    for (let i = 0; i < history[name].length; i++) {
      output.innerHTML += history[name][i];
    }
  } else {
    output.innerHTML = "Aún no hay mensajes para mostrar";
  }
}

// Emit event
btn.addEventListener("click", function () {
  socket.emit("chat", {
    message: message.value,
    handle: handle.value,
    handleDestination: handleDestination.value,
  });
  message.value = "";
});

btnNewUser.addEventListener("click", function () {
  if (handle.value !== "") {
    socket.emit(
      "newUser",
      {
        handle: handle.value,
      },
      function (data) {
        if (data) {
          handleError.style.display = "none";
          handleError.innerHTML = "";
          userName.innerHTML = `Bienvenido ${handle.value}`;
          login.style.display = "none";
          roomChat.style.display = "block";
        } else {
          handleError.innerHTML = "El nombre de usuario ya está utilizado.";
          handleError.style.display = "block";
        }
      }
    );
  } else {
    handleError.innerHTML = "El nombre de usuario no puede estar vacio";
    handleError.style.display = "block";
  }
});

usernames.addEventListener("click", function (event) {
  if (event.target.value !== handle.value) {
    nameChat.innerHTML = `Chat de ${event.target.value}`;
    handleDestination.value = event.target.value;
    printChat(event.target.value);
  }
});

socket.on("chat-public", function (data) {
  var d = new Date();
  var dateMinute = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  var html = "";
  if (data.handle === handle.value) {
    html = `<div style="text-align: right;"><p><strong>[${dateMinute}][${data.handle}]:</strong>${data.message}</p></div>`;
  } else {
    html = `<div style="text-align: left;"><p><strong>[${dateMinute}][${data.handle}]: </strong>${data.message}</p></div>`;
  }
  if ("public" in history) {
    history.public.push(html);
  } else {
    history.public = [html];
  }
  printChat("public");
  //console.log(history);
});

socket.on("chat-private", function (data) {
  var d = new Date();
  var dateMinute = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
  var html = "";
  if (data.message.substring(0, 3) === "to:") {
    html = `<div style="text-align: right;"><p><strong>${dateMinute} : </strong>${data.message.substring(
      3
    )}</p></div>`;
  } else if (data.message.substring(0, 3) === "of:") {
    html = `<div style="text-align: left;"><p><strong>${dateMinute} : </strong>${data.message.substring(
      3
    )}</p></div>`;
  }
  if (data.handle in history) {
    history[data.handle].push(html);
  } else {
    history[data.handle] = [html];
  }

  printChat(data.handle);
  //console.log(history);
});

socket.on("newUser", function (data) {
  var html = '<select class="custom-select" multiple id="userConnect">';
  html += '<option selected value="public">Sala pública</option>';
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== handle.value) {
      html += `<option value="${data[i]}">${data[i]}</option>`;
    }
  }
  html += "</select>";
  usernames.innerHTML = html;
});
