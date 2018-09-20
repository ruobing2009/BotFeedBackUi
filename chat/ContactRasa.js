const request = require('request');
const async = require('async');

exports.MesInteractive = MesInteractive;

function MesInteractive(message, userId, callback) {
    // 去掉转义字符
    message = message.replace(/[\'\"\\\/\b\f\n\r\t]/g, '');

    var data = {'query': message};
    var postOptions = {
        method: 'POST',
        uri: 'http://localhost:5005' + '/conversations/' + userId + '/parse',
        json: true,
        body: data
    };
    //console.log('!!!*****====1. 发给Bot的数据是: ' + JSON.stringify(data));
    request(postOptions, function (error, response, body) {
        //console.log('rasa: response - ', response && response.statusCode);
        if (!error && response.statusCode == 200) {
            //console.log('==========1. Bot返回的数据========' + JSON.stringify(body));
            var events = [];
            if (body.next_action == 'utter_log_search') {
                events = [{"event": "reset_slots"}];
            } else {
                for (var prop in body.tracker.slots) {
                    var event = {
                        'event': 'slot',
                        'name': prop,
                        'value': body.tracker.slots['' + prop + '']
                    }
                    events.push(event);
                }
            }

            var returnDataSend =  {'executed_action': body.next_action, 'events': events};
            var postOptionss = {
                method: 'POST',
                uri: 'http://localhost:5005' + '/conversations/' + userId + '/continue',
                json: true,
                body: returnDataSend
            };
            //console.log('!!!*****====2. 发给Bot的数据是: ' + JSON.stringify(returnDataSend));
            request(postOptionss, function (errors, responses, bodys) {
                if (!error && response.statusCode == 200) {
                    //console.log('==========2. Bot返回的数据========' + JSON.stringify(bodys));
                } else if (error) {
                    callback(error,null,null);
                    console.log('problem with request: ' + error.message);
                }
            });
            callback(null, getSlots(body), getBehavior(body));////打印到前端
        } else if (error) {
            callback(error,null,null);
            console.log('problem with request: ' + error.message);
        }
    });

}

function getSlots(body) {
    return body.tracker.slots;
}
function getBehavior(body) {
    return body.next_action ? body.next_action : null;
}


