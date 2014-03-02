/**
 * Created by Zeroling.
 */
var crypto = require('crypto'),
	User = require('../models/user.js'),
	site = require('../settings.js').site;
var reg = {};
reg.get = function (req, res) {
    res.render('admin/reg', {
    	site: site,
    	success: req.flash('success').toString(),
		error: req.flash('error').toString()
    });
} 
reg.post = function (req, res) {
	var name = req.body.username,
		password = req.body.password,
		password_re = req.body['password-repeat'],
        email = req.body['email'];

	if(password != password_re) {
		req.flash('error', "Confirm-password incorrect!");
		res.redirect('/admin/reg');
	}

	var md5 = crypto.createHash('md5'),
		password_md5 = md5.update(req.body.password).digest('hex');
	var newUser = new User({
		name: name,
		password: password_md5,
		email: email
	});

	User.get(newUser.name, function (err, user) {
		if(user){
			req.flash('error', 'User exites!');
			return res.redirect("/admin/reg");
		}
		newUser.save(function (err, user) {
			if(err){
				req.flash('error', err);
    			return res.redirect('/admin/reg');//注册失败返回主册页
			}
			req.session.user = user;
			req.flash('success', 'Reg successful!');
            require('fs').rename('./routes/reg.js', './routes/reg.js.reged', function (err) {
                if(err){console.log(err)}
                reg.post = null;
            	reg.get = null;
                res.redirect("/admin");
            });
		});
	});
}

module.exports = reg;