const REPLY_DID_NOT_UNDERSTAND = "I didn't understand that. Can you rephrase?";

function Reply(message, slots, behavior) {
    this.message = message;
    this.reply = this.getReply(slots, behavior);
    this.slots = slots;
    this.behavior = behavior;
    // this.context = "global";
}

Reply.prototype.toJson = function () {
    var json = {};
    json['slots'] = this.slots;
    json['behavior'] = this.behavior;
    json['reply'] = this.reply;
    json['message'] = this.message;
    return json;
};

Reply.prototype.getReply = function (slots, behavior) {
    if (!behavior) {
        return REPLY_DID_NOT_UNDERSTAND;
    }
    else {
        var view;
        switch (behavior) {
            case "init1":{
               view =  "您好！";
                break;
            }
            case "init2":{
                view =  '<div class="article">'+
                    '<p>我是您的机器人助手小智！</p><p>我有如下功能可以协助您更好的运维：</p>'+
                    '<li><a class="slider" onclick="obtainAtext(this)">告警问题解决方案推荐?(正在开发中……)</a></li>'+
                    '<li><a class="slider" onclick="obtainAtext(this)">运维日志的查询与显示?</a></li>'+
                    '<p>请直接点击或输入相关问题，更多功能敬请期待!</p>'+
                    '</div>';
                break;
            }
            case "utter_ask_item":{
                view =  utterAskItem();
                break;
            }
            case "utter_ask_date":{
                view =  utterAskDate();
                break;
            }
            case "utter_ask_ip":{
                view =  utterAskIp();
                break;
            }
            case "utter_ask_mide":{
                view =  utterAskMide();
                break;
            }
            case "utter_log_search":{
                view =  utterLogSearch(slots);
                break;
            }
            case "utter_welcome":{
                view =  utterWelcome();
                break;
            }
            default:{
                view =  utterDefault();
                break;
            }
        }
        return view;
    }
};

function utterAskItem(){
    var s1 = "请问您需要小智帮助您做什么？",
        s2 = '<p>小智的功能目前还在开发中，有如下功能供您选择：</p>'+
            '<p>* 日志查询（date, ip, middleware)</p>'+
            '<p>* 告警问题的解决方案推荐（目前正在开发中)</p>',
        s3 = "您好，需要查询的项目是什么呢",
        s4 = "亲，需要小智帮您实现的功能是什么呢";

    var arr = [s1, s2, s3, s4];
    return getRandomReply(arr);
}

function utterAskDate(){
    var s1 = "请您输入具体时间，参考格式：2018.03.04",
        s2 = "您好，还没有输入要查询的时间",
        s3 = "时间呢？";
    var arr = [s1, s2, s3];
    return getRandomReply(arr);
}

function utterAskIp(){
    var s1 = "请您输入要查询的IP地址，参考格式：21.123.183.45",
        s2 = "麻烦您输入需要查询的IP，目前仅支持单IP查询。",
        s3 = "主机IP呢？";
    var arr = [s1, s2, s3];
    return getRandomReply(arr);
}

function utterAskMide(){
    var s1 = "您好，请问需要查询哪个中间件呢？",
        s2 = "请输入需要查询的中间件名称，例如Apache、Was、Jboss",
        s3 = "中间件名称呢？";
    var arr = [s1, s2, s3];
    return getRandomReply(arr);
}
function utterLogSearch(s){
    //console.log(JSON.stringify(s));
    var str = '', item;
    for (var prop in s) {
        if(prop != 'item') {
            str += prop + '：' + s['' + prop + '']+
                '<br>';
        }else{
            //console.log(s['' + prop + '']);
            switch (s['' + prop + '']) {
                case "日志":
                    item = '运维日志的查询与显示';
                    break;
                default:
                    item = '告警问题解决方案推荐?';
                    break;
            }
        }
    }
    var result = '<div class="article">' +
        '<p>根据您的输入操作项为：</p><b>' + item +
        '</b><p>为您匹配到的参数：</p><b>' + str +
        '</b><p>请点击链接执行或放弃，也可以直接输入新的操作对象。</p>' +
        '<a class="slider" style="margin-right: 10px;" onclick="excuteTask(this)">执行</a>' +
        '<div id="slots" style="display: none;">' +JSON.stringify(s)+ '</div>' +
        '<a class="slider" onclick="giveUp(this)">放弃</a>' +
        '</div>'
    return result;
}
function utterWelcome(){
    var s1 = "小智很开心能够帮到您！",
        s2 = "不客气呢！",
        s3 = "嘻嘻，您高兴小智也高兴！",
        s4 = "不客气，能帮到您是小智的荣幸！";
    var arr = [s1, s2, s3, s4];
    return getRandomReply(arr);
}
function utterDefault(){
    var s1 = "不好意思，我的理解力有限，您可以换一种说法吗？",
        s2 = "请您再重复一次？",
        s3 = "小智目前功能不够完善，理解能力不足请您协助反馈！";
    var arr = [s1, s2, s3];
    return getRandomReply(arr);
}
function getRandomReply(arr){
    var index = Math.floor((Math.random()*arr.length));
    return arr[index];
}

module.exports = Reply;