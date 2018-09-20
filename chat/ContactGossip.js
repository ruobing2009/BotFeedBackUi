const request = require('request');

exports.parse = parse;

function parse(message, callback) {
    var data = 'msg='+message;

    console.log('!!!*****====发给Bot的数据是: ' + JSON.stringify(data));
    request('http://localhost:5000/get?'+data , function(error, response, body) {
        console.log('rasa: response - ', response && response.statusCode);
        if (!error && response.statusCode == 200){
            console.log('==========Bot返回的数据========'+JSON.stringify(body));
            var events = [];

            callback(null, 'extractIntent(body)', 'extractBehavior(body)');////打印到前端

        }else if(error){
            callback(error);
            console.log('problem with request: ' + error.message);
        }
    });

}

function extractIntent(body) {
    //console.log(JSON.stringify(body))
    return body.tracker ? new Intent(body.tracker.latest_message.intent.name) : null;
}

function extractBehavior(body) {
    return body.next_action ? new Behavior(body.next_action) : null;
}

