const path = require('path');
const express = require('express');
var bodyParser = require('body-parser');
const app = express();
const server = require('http').Server(app);
const io = require('socket.io')(server);
const classifier = require('./chat/Classifier');
const common = require('./chat/Common');
const Reply = require('./chat/Reply');
const operate = require('./dao/OperateChatLogDao');

const messageChannel = 'message';
const replyChannel = 'reply';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use('/', express.static(path.join(__dirname + '/public')));
app.use('/userFeedback', function (req, res) {
    operate.updateChatLogFlag(req.body.chatid);
});
app.use('/userInputMes', function (req, res) {
    var promise = operate.insertChatLog(global.userId, global.userId, req.body.mes, '', 0, 0);
    promise.then(function (value) {
        res.send(""+value);
        return value;
    }, function (value) {
        // failure
    });
});
app.use('/userOperate', function (req, res) {
    operate.insertChatLog(global.userId, global.userId, req.body.mes, '', 0, 0);
});


io.on('connection', function (socket) {
    global.userId = common.uuid(8, 16);
    console.log("User " + global.userId + " connected to Chatbot");
    socket.emit(replyChannel, new Reply("init", "hello", "init1").toJson());
    socket.emit(replyChannel, new Reply("init", "func", "init2").toJson());
    socket.on(messageChannel, function (message, isUser, fn) {
        fn('Message arrived to the server'); //callback function
        sendToBot(message, socket);
    });

    socket.on(replyChannel, function (message, slots, behavior) {
        //console.log("Message: " + message + " | Slots: " + slots + " | Behavior: " + behavior);
    });
});

var port = 8000;
server.listen(port, function () {
    console.log('Chatbot is listening on port ' + port + '!')
});

sendToBot = function (message, socket) {
    //operate.insertChatLog(global.userId, global.userId, message, '', 0, 0);
    classifier.parse(message, global.userId, function (error, slots, behavior) {
        if (error) {
            var promise = operate.insertChatLog(global.userId, global.userId, '系统发生内部错误：' + error, behavior, 1, 0);
            promise.then(function (value) {
                var view = {};
                view['reply'] = '<font color="red"><b>系统发生内部错误：</b></font></br>' + error;
                view['mesid'] = value;
                socket.emit(replyChannel, view);
                return value;
            }, function (value) {
                // failure
            });
        } else {
            var view = new Reply(message, slots, behavior).toJson();

            var promise = operate.insertChatLog(global.userId, global.userId, JSON.stringify(view), behavior, 1, 0);
            promise.then(function (value) {
                view['mesid'] = value;
                socket.emit(replyChannel, view);
                return value;
            }, function (value) {
                // failure
            });
        }
    });
}
