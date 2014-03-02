var settings = require('../settings.js').mongo;
var url;
if(settings.user){
	url = "mongodb://" + settings.user + ":" + settings.password + "@" + settings.host + ":" + settings.port + "/" + settings.db
}else{
	url = "mongodb://" + settings.host + ":" + settings.port + "/" + settings.db
}
var mongo = function (callback) {
        require('mongodb').MongoClient.connect(url, callback);
    }
module.exports = mongo;