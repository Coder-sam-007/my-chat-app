const socket = io("https://ancient-everglades-66739.herokuapp.com/");

// Get DOM elements in respective Js variables
const form = document.getElementById("send-container");
const messageInput = document.getElementById("messageInp");
const messageContainer = document.querySelector(".chat-container");
const name_value = document.querySelector(".modal input");
const modal = document.querySelector(".modal");
const modal_btn = modal.querySelector("button");
const Password = document.querySelector(".password");
const join_msg = document.querySelector(".join-msg");

// Audio that will play on receiving messages
var audio = new Audio("ting.mp3");

// Function which will append event info to the contaner
const append = (message, position) => {
  const messageElement = document.createElement("div");
  messageElement.innerText = message;
  messageElement.classList.add("msg");
  messageElement.classList.add(position);
  messageContainer.append(messageElement);
  if (position == "left") {
    audio.play();
  }
};

//modal and password stuff

modal_btn.addEventListener("click", addUser);
name_value.addEventListener("click", () => {
  Password.classList.remove("disappear");
});
Password.addEventListener(
  "click",
  () => (Password.placeholder = "Enter Password")
);

function addUser(e) {
  e.preventDefault();
  let name = name_value.value;

  if (!name) {
    return alert("You must add a user name");
  }
  if (Password.value != "pacific_black") {
    return alert("Wrong Password");
  }
  socket.emit("new-user-joined", name);
  modal.classList.add("disappear");
  join_msg.classList.remove("disappear");
}

// Ask new user for his/her name and let the server know
const name = prompt("Enter your name to join");
socket.emit("new-user-joined", name);

// If a new user joins, receive his/her name from the server
socket.on("user-joined", (name) => {
  append(`${name} joined the chat`, "right");
});

// If server sends a message, receive it
socket.on("receive", (data) => {
  append(`${data.name}: ${data.message}`, "left");
});

// If a user leaves the chat, append the info to the container
socket.on("left", (name) => {
  append(`${name} left the chat`, "right");
});

// If the form gets submitted, send server the message
form.addEventListener("submit", (e) => {
  e.preventDefault();
  const message = messageInput.value;
  append(`You: ${message}`, "right");
  socket.emit("send", message);
  messageInput.value = "";
});
