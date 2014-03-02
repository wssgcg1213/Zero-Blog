var settings = require('../settings.js').mongo,
    url = "mongodb://" + settings.user + ":" + settings.password + "@" + settings.host + ":" + settings.port + "/" + settings.db,
    mongo = function (callback) {
        require('mongodb').MongoClient.connect(url, callback);
    }
module.exports = mongo;