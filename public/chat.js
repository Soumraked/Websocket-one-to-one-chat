// Make connection
var socket = io.connect("http://localhost:4000");

// local database
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
  nameChat = document.getElementById("nameChat"),
  disconnect = document.getElementById("disconnect");

// Functions
function printChat(name) {
  // Show chat of selected destination
  if (name in history) {
    output.innerHTML = "";
    for (let i = 0; i < history[name].length; i++) {
      output.innerHTML += history[name][i];
    }
    output.scrollTop = output.scrollHeight - output.clientHeight;
  } else {
    output.innerHTML = "Aún no hay mensajes para mostrar";
  }
  handleDestination.value = name;
}

function sendMessage() {
  // Enter message
  if (message.value != "") {
    socket.emit("chat", {
      message: message.value,
      handle: handle.value,
      handleDestination: handleDestination.value,
    });
    message.value = "";
  }
}

function input() {
  // Login user
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
          userName.innerHTML = `Bienvenido a Whatsup, <strong>${handle.value}</strong>`;
          login.style.display = "none";
          roomChat.style.display = "block";
          nameChat.innerHTML = `Estas chateando en sala <strong>pública</strong>`;
          output.innerHTML = "Aún no hay mensajes para mostrar";
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
}

function changeDestiny(data) {
  // Change the destination of messages
  if (data !== handle.value) {
    if (data === "public") {
      nameChat.innerHTML = `Estas chateando en sala <strong>pública</strong>`;
    } else {
      nameChat.innerHTML = `Estas chateando con <strong>${data}</strong>`;
    }

    handleDestination.value = data;
    printChat(data);
  }
}

// Events
btn.addEventListener("click", function () {
  sendMessage();
});

message.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    sendMessage();
  }
});

disconnect.addEventListener("click", function () {
  window.location.reload();
});

handle.addEventListener("keyup", function (event) {
  if (event.keyCode === 13) {
    event.preventDefault();
    input();
  }
});

btnNewUser.addEventListener("click", function () {
  input();
});

// Enter message public room
socket.on("chat-public", function (data) {
  var date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  let t = hh + ":" + mm;

  var html = "";
  if (data.handle === handle.value) {
    html = `<div class="outgoing_msg">
    <div class="sent_msg">
    <p>${data.message}</p>
      <span class="time_date"> ${data.handle} | ${t}</span>
    </div>
  </div>`;
  } else {
    html = `<div class="incoming_msg">
    <div class="incoming_msg_img">
      <img
        src="https://ptetutorials.com/images/user-profile.png"
        alt="sunil"
        style="vertical-align: center"
      />
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>${data.message}</p>
        <span class="time_date"> ${data.handle} | ${t}</span>
      </div>
    </div>
  </div>`;
  }
  if ("public" in history) {
    history.public.push(html);
  } else {
    history.public = [html];
  }

  nameChat.innerHTML = `Estas chateando en sala <strong>pública</strong>`;

  printChat("public");
  //console.log(history);
});

// Enter message private room
socket.on("chat-private", function (data) {
  var date = new Date();
  let hh = date.getHours();
  let mm = date.getMinutes();
  if (hh < 10) {
    hh = "0" + hh;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  let t = hh + ":" + mm;
  var html = "";
  if (data.message.substring(0, 3) === "to:") {
    html = `<div class="outgoing_msg">
    <div class="sent_msg">
    <p>${data.message.substring(3)}</p>
      <span class="time_date"> ${data.handle} | ${t}</span>
    </div>
  </div>`;
  } else if (data.message.substring(0, 3) === "of:") {
    html = `<div class="incoming_msg">
    <div class="incoming_msg_img">
      <img
        src="https://ptetutorials.com/images/user-profile.png"
        alt="sunil"
      />
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>${data.message.substring(3)}</p>
        <span class="time_date"> ${data.handle} | ${t}</span>
      </div>
    </div>
  </div>`;
  }
  if (data.handle in history) {
    history[data.handle].push(html);
  } else {
    history[data.handle] = [html];
  }

  nameChat.innerHTML = `Estas chateando con <strong>${data.handle}</strong>`;

  printChat(data.handle);
  //console.log(history);
});

// Append new user in the connects
socket.on("newUser", function (data) {
  var html = `<div class="chat_list" onclick="changeDestiny('public')" style="cursor: pointer;">
  <div class="chat_people">
    <div class="chat_img">
      <img
        src="https://ptetutorials.com/images/user-profile.png"
        alt="sunil"
      />
    </div>
    <div class="chat_ib">
      <h5>Sala pública</h5>
    </div>
  </div>
</div>`;
  for (let i = 0; i < data.length; i++) {
    if (data[i] !== handle.value) {
      html += `<div class="chat_list" onclick="changeDestiny('${data[i]}')" style="cursor: pointer;">
      <div class="chat_people">
        <div class="chat_img">
          <img
            src="https://ptetutorials.com/images/user-profile.png"
            alt="sunil"
          />
        </div>
        <div class="chat_ib">
          <h5>${data[i]}</h5>
        </div>
      </div>
    </div>`;
    }
  }
  usernames.innerHTML = html;
});
