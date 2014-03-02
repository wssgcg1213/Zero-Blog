/**
 * link 模型
 */

var mongo = require('./db');
    marked = require('marked');

function Link(url, content) {
	this.url = url;
	this.content = content;
}

module.exports = Link;

Link.prototype.save = function (callback){
	//要存入数据库的文档
	var link = {
		url: this.url,
		content: this.content
	};
	//开库
    mongo(function (err, db){
		if(err) return callback(err);
		//读
		db.collection('links', function (err, collection){
			if(err){
				db.close();
				return callback(err);
			}
            collection.find({}, {sort: {lid: -1}, limit:1}).toArray(function(err, last){
                link.lid = last[0] ? last[0].lid + 1 : 1;
                collection.insert(link, {safe: true}, function (err){
                    db.close();
                    if(err) return callback(err);
                    callback(null);
                });
            });
		});
	});
};

/**
 * [get description]获取最多amount数量的links,lid倒序,pv无影响
 * @param  {[type]}   amount   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Link.get = function (amount, callback) {
    mongo(function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('links', function (err, collection) {
			if(err){
				db.close();
				return callback(err);
			}
            collection.find({}, {
                skip: 0,
                limit: amount
            }).sort({lid: -1}).toArray(function (err, docs) {
                db.close();
                if(err) return callback(err);
                callback(null, docs);
            });
		});
	});
};

/**
 * [getOne description]返回一个link
 * @param  {[type]}   lid      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Link.getOne = function (lid, callback) {
    mongo(function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('links', function (err, collection) {
			if(err){
				db.close();
				return callback(err);
			}
			collection.findOne({'lid': lid}, function (err, doc) {
                db.close();
				if(err){
					return callback(err);
				}
				if(doc){
					callback(null, doc);
				}else{
					callback(null, null);
				}
			});
		});
	});
};

Link.edit = Link.getOne;

Link.update = function (lid, url, content, callback) {
    mongo(function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('links', function (err, collection) {
			if(err){
				db.close();
				return callback(err);
			}
			collection.update({'lid': lid}, {$set: {
				url: url,
				content: content
			}}, function (err) {
				db.close();
				if(err) return callback(err);
				callback(null);
			});
		});
	});
};

Link.delete = function (lid, callback) {
    mongo(function (err, db) {
        if(err){
            db.close();
            return callback(err);
        }
        db.collection('links', function (err, collection) {
            if(err){
                db.close();
                return callback(err);
            }
            collection.remove({lid: lid}, function (err) {
                db.close();
                if(err) return callback(err);
                callback(null);
            });
        });
    });
}










