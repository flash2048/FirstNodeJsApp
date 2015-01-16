var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');

var messages = [];

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'index.html'));
});
app.use(express.static(path.join(__dirname , 'public')));
io.on('connection', function (socket) {
    console.log("Подсоединился новый пользователь");
    socket.on('message', function (msg) {
        if (msg.length > 0) {
            console.log("Новое сообщение: " + msg);
            io.emit('message', msg);
            messages.push(msg);
            if (messages.length > 10) {
                messages.splice(0, 1);
            }
        }
    });
    socket.on('disconnect', function () {
        console.log("Пользователь вышел...");
    });
    socket.on('first', function () {
        for (var i = 0; i < messages.length; i++) {
            socket.emit("message",
                messages[i]);
        }
        
    });

});
http.listen(3000, function () {
    console.log('Чат запущен, порт: 3000');
});