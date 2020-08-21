const Express = require("express");
const Http = require("http").Server(Express);
const Socketio = require("socket.io")(Http);

var users = [];

Socketio.on("connection", socket => {
    socket.on("username", data =>{
        console.log(data)
        users.push(data)
        Socketio.emit("users", users)
    })
})

Http.listen(3000, () =>{
    console.log("Listening on port 3000");
});