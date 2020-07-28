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
    output.scrollTop = output.scrollHeight - output.clientHeight;
  } else {
    output.innerHTML = "Aún no hay mensajes para mostrar";
  }
}

// Emit event
btn.addEventListener("click", function () {
  if (message.value != "") {
    socket.emit("chat", {
      message: message.value,
      handle: handle.value,
      handleDestination: handleDestination.value,
    });
    message.value = "";
  }
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
          userName.innerHTML = `Conectado como <strong>${handle.value}</strong>`;
          login.style.display = "none";
          roomChat.style.display = "block";
          nameChat.innerHTML = `Estas en el chat <strong>público</strong>`;
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
});

// usernames.addEventListener("click", function (event) {
//   if (event.target.value !== handle.value) {
//     if (event.target.value === "public") {
//       nameChat.innerHTML = `Estas en el chat <strong>público</strong>`;
//     } else {
//       nameChat.innerHTML = `Estas en el chat de <strong>${event.target.value}</strong>`;
//     }

//     handleDestination.value = event.target.value;
//     printChat(event.target.value);
//   }
// });

// socket.on("chat-public", function (data) {
//   var d = new Date();
//   var dateMinute = d.getHours() + ":" + d.getMinutes();
//   var html = "";
//   if (data.handle === handle.value) {
//     html = `<div style="text-align: right;"><p><strong>[${dateMinute}][${data.handle}]:</strong>${data.message}</p></div>`;
//   } else {
//     html = `<div style="text-align: left;"><p><strong>[${dateMinute}][${data.handle}]: </strong>${data.message}</p></div>`;
//   }
//   if ("public" in history) {
//     history.public.push(html);
//   } else {
//     history.public = [html];
//   }

//   nameChat.innerHTML = `<strong>Chat público</strong>`;
//   printChat("public");
//   //console.log(history);
// });
socket.on("chat-public", function (data) {
  var d = new Date();
  var dateMinute = d.getHours() + ":" + d.getMinutes();
  var html = "";
  if (data.handle === handle.value) {
    html = `<div class="outgoing_msg">
    <div class="sent_msg">
    <p>${data.message}</p>
      <span class="time_date"> ${data.handle} | ${dateMinute}</span>
    </div>
  </div>`;
  } else {
    html = `<div class="incoming_msg">
    <div class="incoming_msg_img">
      <img
        src="https://ptetutorials.com/images/user-profile.png"
        alt="sunil"
      />
    </div>
    <div class="received_msg">
      <div class="received_withd_msg">
        <p>${data.message}</p>
        <span class="time_date"> ${data.handle} | ${dateMinute}</span>
      </div>
    </div>
  </div>`;
  }
  if ("public" in history) {
    history.public.push(html);
  } else {
    history.public = [html];
  }

  nameChat.innerHTML = `Estas en el chat <strong>público</strong>`;
  printChat("public");
  //console.log(history);
});

// socket.on("chat-private", function (data) {
//   var d = new Date();
//   var dateMinute = d.getHours() + ":" + d.getMinutes();
//   var html = "";
//   if (data.message.substring(0, 3) === "to:") {
//     html = `<div style="text-align: right;"><p><strong>${dateMinute} : </strong>${data.message.substring(
//       3
//     )}</p></div>`;
//   } else if (data.message.substring(0, 3) === "of:") {
//     html = `<div style="text-align: left;"><p><strong>${dateMinute} : </strong>${data.message.substring(
//       3
//     )}</p></div>`;
//   }
//   if (data.handle in history) {
//     history[data.handle].push(html);
//   } else {
//     history[data.handle] = [html];
//   }

//   nameChat.innerHTML = `<strong>Estas en el chat de ${data.handle}</strong>`;

//   printChat(data.handle);
//   //console.log(history);
// });

socket.on("chat-private", function (data) {
  var d = new Date();
  var dateMinute = d.getHours() + ":" + d.getMinutes();
  var html = "";
  if (data.message.substring(0, 3) === "to:") {
    html = `<div class="outgoing_msg">
    <div class="sent_msg">
    <p>${data.message.substring(3)}</p>
      <span class="time_date"> ${data.handle} | ${dateMinute}</span>
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
        <span class="time_date"> ${data.handle} | ${dateMinute}</span>
      </div>
    </div>
  </div>`;
  }
  if (data.handle in history) {
    history[data.handle].push(html);
  } else {
    history[data.handle] = [html];
  }

  nameChat.innerHTML = `Estas en el chat de <strong>${data.handle}</strong>`;

  printChat(data.handle);
  //console.log(history);
});

// socket.on("newUser", function (data) {
//   var html =
//     '<select class="custom-select list-group" multiple id="userConnect">';
//   html +=
//     '<option value="public" selected class="list-group-item d-flex justify-content-between align-items-center">Sala pública</option>';
//   for (let i = 0; i < data.length; i++) {
//     if (data[i] !== handle.value) {
//       html += `<option value="${data[i]}" class="list-group-item d-flex justify-content-between align-items-center">${data[i]}</option>`;
//     }
//   }
//   html += "</select>";
//   usernames.innerHTML = html;
// });

function changeDestiny(data) {
  if (data !== handle.value) {
    if (data === "public") {
      nameChat.innerHTML = `Estas en el chat <strong>público</strong>`;
    } else {
      nameChat.innerHTML = `Estas en el chat de <strong>${data}</strong>`;
    }

    handleDestination.value = data;
    printChat(data);
  }
}

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
