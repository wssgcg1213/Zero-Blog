/**
 * Created with JetBrains WebStorm.
 * User: B1ackRainFlake
 * Author: Liuchenling
 * Date: 2/17/14
 * Time: 20:49
 */
function getTime() {
    var date = new Date();
    var time = {
        date: date,
        year: date.getFullYear(),
        month: date.getFullYear() + "年" + (date.getMonth() + 1),
        day: date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日",
        minute: date.getFullYear() + "年" + (date.getMonth() + 1) + "月" + date.getDate() + "日" + " " + date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
    };
    return time;
}

module.exports = getTime;