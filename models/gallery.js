/**
 * gallery 模型
 */

var mongo = require('./db'),
    marked = require('marked'),
    getTime = require('./gettime');

function Gallery(url, content) {
	this.url = url;
	this.content = content;
}

module.exports = Gallery;

Gallery.prototype.save = function (callback){
	var date = new Date();

	var time = getTime();
	//要存入数据库的文档
	var gallery = {
		url: this.url,
		content: this.content,
		time: time,
		comments: [],
		pv: 0,
	};
	//开库
    mongo(function (err, db){
		if(err) return callback(err);
		//读
		db.collection('gallerys', function (err, collection){
			if(err){
				db.close();
				return callback(err);
			}
            collection.find({}, {sort: {gid: -1}, limit:1}).toArray(function(err, last){
                gallery.gid = last[0] ? last[0].gid + 1 : 1;
                collection.insert(gallery, {safe: true}, function (err){
                    db.close();
                    if(err) return callback(err);
                    callback(null);
                });
            });
		});
	});
};

/**
 * [getOne description]显示一篇gallrery用的,pv++噢
 * @param  {[type]}   gid      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Gallery.getOne = function(gid, callback){
    mongo(function (err, db){
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('gallerys', function (err, collection){
			if (err){
				db.close();
				return callback(err);
			}
			collection.findOne({'gid': gid}, function (err, doc){
				if(err){
					db.close();
					return callback(err);
				}
				if(doc){
					collection.update({'gid': gid}, {$inc: {'pv': 1}}, function (err){  //pv++
						db.close();
						if(err) return callback(err);
                        marked(doc.content, function (err, content){
                            if(err) return console.log(err);
                            doc.content = content;
                            doc.title = doc.content.replace(/<\/?.+?>/g,"");
                            doc.comments.forEach(function (comment){
                                marked(comment.content, function (err, content){
                                    if(err) return console.log(err);
                                    comment.content = content;
                                });
                            });
                        });
                        callback(null, doc);
					});
				}else{
                    db.close();
					callback(null, null);   //no gallery
				}
			});
		});
	});
};

/**
 * [get description]获取最多amount数量的文章,gid倒序,pv无影响
 * @param  {[type]}   amount   [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Gallery.get = function (amount, callback) {
    mongo(function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('gallerys', function (err, collection) {
			if(err){
                db.close();
				return callback(err);
			}
			collection.count({}, function (err, total) {
				if(err){
					db.close();
					return callback(err);
				}
				var skip = 0;
				collection.find({}, {
					skip: skip,
					limit: amount
				}).sort({gid: -1}).toArray(function (err, docs) {
					db.close();
					if(err) return callback(err);
					docs.forEach(function (doc) {
						marked(doc.content, function (err, content){
							if(err) return console.log(err);
							doc.content = content;
						});
					});
					callback(null, docs);
				});
			});
		});
	});
};

/**
 * [edit description]这回返回不markdown解析过的原始文档
 * @param  {[type]}   gid      [description]
 * @param  {Function} callback [description]
 * @return {[type]}            [description]
 */
Gallery.edit = function (gid, callback) {
    mongo(function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('gallerys', function (err, collection) {
			if(err){
				db.close();
				return callback(err);
			}
			collection.findOne({'gid': gid}, function (err, doc) {
                db.close();
				if(err) return callback(err);
				if(doc) return callback(null, doc);
                callback(null, null);
			});
		});
	});
};


Gallery.update = function (gid, url, content, time, callback) {
    mongo(function (err, db) {
		if(err){
			db.close();
			return callback(err);
		}
		db.collection('gallerys', function (err, collection) {
			if(err){
				db.close();
				return callback(err);
			}
			collection.update({'gid': gid}, {$set: {
				url: url,
				content: content,
				time: time
			}}, function (err) {
				db.close();
				if(err) return callback(err);
				callback(null);
			});
		});
	});
}












