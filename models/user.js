var mongo = require('./db');

function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;

};

module.exports = User;

User.prototype.save = function(callback){
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	};
    mongo(function (err, db){
		if(err){
			return callback(err);  //err
		}

		db.collection('users', function (err, collection){
			if(err){
				db.close();
				return callback(err);
			}
			collection.insert(user, {safe: true}, function (err, user){
				db.close();
				if(err){
					return callback(err);
				}
				callback(null, user);//成功！err 为 null，并返回存储后的用户文档
			});
		});
	});
};

User.get = function (name, callback){
    mongo(function(err, db){
		if (err) return callback(err);

		db.collection('users', function (err, collection) {
			if(err){
				db.close();
				return callback(err);
			}
			collection.findOne({'name': name}, function (err, user) {
				db.close();
				if(err) return callback(err);
				callback(null, user);
			});
		});
	});
};

User.count = function (callback){
    mongo(function(err, db){
		if (err) return callback(err);

		db.collection('users', function (err, collection) {
			if(err){
				db.close();
				return callback(err);
			}
			collection.count(function (err, num) {
				db.close();
				if(err) return callback(err);
				callback(null, num);
			});
		});
	});
};






