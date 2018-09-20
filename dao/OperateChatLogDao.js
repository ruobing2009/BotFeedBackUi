const db = require('./CommonDao');
const common = require('../chat/Common');

/**
 * @param cid  每段聊天的ID
 * @param uid  聊天用户的ID
 * @param sendMes
 * @param flag  标识位，0标识用户发送给bot，1标识bot回信给用户
 */
function insertChatLog(cid, uid, sendMes, behavior, pbFlag, feedbackFlag) {
    var promise = new Promise(function (resolve, reject) {
        db.query("insert into chat_log(cid, uid, send_mes, behavior, pb_flag, " +
            "date_time, feedback_flag)values(?,?,?,?,?,?,?)",
            [cid, uid, sendMes, behavior, pbFlag, common.getCurrentTime(), feedbackFlag],
            function (err, result) {
                if (err) {
                    console.log('[INSERT ERROR] - ', err.message);
                    return;
                }
                //console.log('[INSERT RESULT] - ', result.insertId);
                resolve(result.insertId);
            });
    });

    return promise;
}
/**
 * 用户反馈不满意行为，调用更新flag方法
 */
function updateChatLogFlag(mesid) {
    db.query("update chat_log set feedback_flag= ? where id = ?", [1, mesid],
        function (err, result) {
            if (err) {
                console.log('[UPDATE ERROR] - ', err.message);
                return;
            }
        });
};
exports.updateChatLogFlag = updateChatLogFlag;
exports.insertChatLog = insertChatLog;
