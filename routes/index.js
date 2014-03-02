/*
 * Routes
 */

var crypto = require('crypto');
var User = require('../models/user.js');
var Emotion = require('../models/emotion.js');
var Post = require('../models/post.js');
var Gallery = require('../models/gallery.js');
var Link = require('../models/link.js');
var site = require('../settings.js').site;
var getTime = require('../models/gettime.js');


module.exports = function(nb){
    //主页
    nb.get('/', function(req, res){
        User.count(function(err, num){
            if(num != 0){
                Emotion.get(site.indexEmotionAmount, function (err, emotions) {
                    if (err) {
                        req.flash('error', "Fetch emotions error!");
                        return res.redirect('/404');
                    }
                    Post.get(site.indexPostAmount, function (err, posts) {
                        if (err) {
                            req.flash('error', "Fetch posts error!");
                            return res.redirect('/404');
                        }
                        Gallery.get(site.indexGalleryAmount, function (err, galleries) {
                            if (err) {
                                req.flash('error', "Fetch galleries error!");
                                return res.redirect('/404');
                            }
                            Link.get(site.indexLinkAmount, function (err, links) {
                                if (err) {
                                    req.flash('error', "Fetch links error!");
                                    return res.redirect('/404');
                                }
                                res.render('index', {
                                    title: site.title,
                                    site: site,
                                    emotions: emotions,
                                    posts: posts,
                                    galleries: galleries,
                                    links: links,
                                    success: req.flash('success').toString(),
                                    error: req.flash('error').toString()
                                });
                            });
                        });
                    });
                });
            }else{
                res.redirect('/admin/reg');
            }
        });
        
	});

	nb.get('/emotion/:eid.html', function (req, res, next) {
		var eid = parseInt(req.params.eid);
		Emotion.getOne(eid, function (err, emotion) {
			if (err){
				req.flash('error', "Fetch emotions error!!");
				return res.redirect('/404');
			}
			if (!emotion){
				req.flash('error', "Fetch emotions error!!");
				return res.redirect('/404');
			}
            Link.get(site.indexLinkAmount, function(err, links){
                if (err){
                    req.flash('error', "Fetch links error!!");
                    return res.redirect('/404');
                }
                res.render("emotions", {
                    title: emotion.title,
                    site: site,
                    user: req.session.user,
                    emotion: emotion,
                    links: links,
                    comments: emotion.comments,
                    success: req.flash('success').toString(),
                    error: req.flash('error').toString()
                });
            });
		});
	});
    nb.post('/emotion/:eid.html', function (req, res, next){
        var eid = parseInt(req.params.eid),
            name = req.body.name,
            qq = req.body.qq ? req.body.qq : 0,
            url = req.body.url,
            content = req.body.content;
        Emotion.saveComment(eid, qq, name, url, content, function(err){
            if(!eid){
                var respond = {
                    status: 0,
                    info: "Sorry, something seems go wrong!"
                }
                return res.end(JSON.stringify(respond));
            }
            if(err){
                var respond = {
                    status: 0,
                    info: err
                }
                return res.end(JSON.stringify(respond));
            }
            if(url){
                if(url.split("//")[0].toLowerCase() != "http:") url = "http://" + url;
            }
            var respond = {
                status: 1,
                content: content,
                qq: qq,
                name: name,
                url: url,
                time: getTime(),
                info: "Reply Successfully!"
            }
            return res.end(JSON.stringify(respond));
        });
    });

	nb.get('/post/:pid.html', function (req, res, next) {
		var pid = parseInt(req.params.pid); 
        Post.getOne(pid, function (err, post) {
        	Link.get(site.indexLinkAmount, function (err, links) {
				if (err){
					req.flash('error', "Fetch posts error!!");
					return res.redirect('/404');
				}
				if (!post){
					req.flash('error', "Fetch posts error!!");
					return res.redirect('/404');
				}
            	res.render("posts", {
            	    title: post.title,
            	    site: site,
            	    links: links,
            	    user: req.session.user,
            	    post: post,
            	    comments: post.comments,
            	    success: req.flash('success').toString(),
            	    error: req.flash('error').toString()
            	});
        	});
		});
	});
    nb.post('/post/:pid.html', function (req, res, next){
        var pid = parseInt(req.params.pid),
            name = req.body.name,
            qq = req.body.qq ? req.body.qq : 0,
            url = req.body.url,
            content = req.body.content;
        Post.saveComment(pid, qq, name, url, content, function(err){
            if(!pid){
                var respond = {
                    status: 0,
                    info: "Sorry, something seems go wrong!"
                }
                return res.end(JSON.stringify(respond));
            }
            if(err){
                var respond = {
                    status: 0,
                    info: err
                }
                return res.end(JSON.stringify(respond));
            }
            if(url){
                if(url.split("//")[0].toLowerCase() != "http:") url = "http://" + url;
            }
            var respond = {
                status: 1,
                content: content,
                qq: qq,
                name: name,
                url: url,
                time: getTime(),
                info: "Reply Successfully!"
            }
            return res.end(JSON.stringify(respond));
        });
    });

    nb.get('/gallery', function (req, res) {
        res.redirect('/galleries');
    })
	nb.get('/galleries', function (req, res) {
		Gallery.get(0, function (err, gallery) {
			if (err){
				req.flash('error', "Fetch galleries error!");
				return res.redirect('/404');
			}
			if (!gallery){
				req.flash('error', "Record not exits!");
				return res.redirect('/404');
			}
			res.render("galleries", {
				site: site,
				user: req.session.user,
				gallery: gallery,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});



	//后台部分
	nb.get('/admin', function (req,res) {
        User.count(function(err, num){
            if(num != 0){
                if(!req.session.user){
                    res.render('admin/login', {
                        site: site,
                        success: req.flash('success').toString(),
                        error: req.flash('error').toString()
                    });         
                }else{
                    Emotion.get(0, function (err, emotions) {
                        if (err) {
                            req.flash('error', "Fetch emotions error!");
                            return res.redirect('/404');
                        }
                        Post.get(0, function (err, posts) {
                            if (err) {
                                req.flash('error', "Fetch posts error!");
                                return res.redirect('/404');
                            }
                            Gallery.get(0, function (err, galleries) {
                                if (err) {
                                    req.flash('error', "Fetch galleries error!");
                                    return res.redirect('/404');
                                }
                                Link.get(0, function (err, links) {
                                    if (err) {
                                        req.flash('error', "Fetch links error!");
                                        return res.redirect('/404');
                                    }
                                    posts = posts.reverse();
                                    emotions = emotions.reverse();
                                    links = links.reverse();
                                    res.render('admin/index', {
                                        title: site.title,
                                        site: site,
                                        user: req.session.user,
                                        emotions: emotions,
                                        posts: posts,
                                        galleries: galleries,
                                        links: links,
                                        success: req.flash('success').toString(),
                                        error: req.flash('error').toString()
                                    });
                                });
                            });
                        });
                    });
                }
            }else{
                res.redirect('/admin/reg');
            }
        });
    });

	nb.get('/admin/site', preCheckLogin);
	nb.get('/admin/site', function (req, res) {
		res.render('admin/site', {
			site: site,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	nb.post('/admin/site', preCheckLogin);
	nb.post('/admin/site', function (req, res) {
		var siteinfo = {
				title: req.body.site_title,
				subtitle: req.body.site_subtitle,
				author: req.body.site_author
			},
			site = new Site(siteinfo);
		site.save(function (err) {
			if(err){
				req.flash('error', err); 
				return res.redirect('/admin');
			}
			req.flash('success', 'Successful!');
			res.redirect('/admin');
		});
	});

	nb.post("/admin/login", function (req, res) {
		var password_md5 = crypto.createHash('md5').update(req.body.password).digest('hex');

		User.get(req.body.username, function (err, user) {
			if(err){
				req.flash('error', "Query Error!");
				return res.redirect('/admin');
			}

			if(!user){
				req.flash('error', 'User not exists!');
				return res.redirect('/admin');
			}

			if(user.password != password_md5){
				req.flash('error', 'Password incorrect!');
				return res.redirect('/admin');
			}

			req.session.user = 	user;
			req.flash('success', 'Successful!');
			res.redirect('/admin');
		});
	});

	nb.get('/admin/logout', function (req, res) {
		site: site,
		req.session.user = null;
		req.flash('success', "Successful!");
		res.redirect('/admin');
	});

	nb.get('/admin/posts', preCheckLogin);
	nb.get('/admin/posts', function (req, res) {
		res.render('admin/posts', {
			site: site,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	nb.post('/admin/posts', preCheckLogin);
	nb.post('/admin/posts', function (req, res) {
		var title = req.body.title,
			tags = req.body.tags.split(",") ? req.body.tags.split(",") : req.body.tags.split("|"),
			content = req.body.content,
			post = new Post(title, tags, content);
			post.save(function (err){
				if(err){
					req.flash('error', err); 
					return res.redirect('/admin');
				}
				req.flash('success', 'Successful!');
				res.redirect('/admin');
			});
	});

    nb.get('/admin/post-edit/:pid', preCheckLogin);
    nb.get('/admin/post-edit/:pid', function (req, res) {
        var pid = parseInt(req.params.pid);
        Post.edit(pid, function (err, post) {
            if(err || !post){
                req.flash('error', "??????!");
                res.redirect('/admin');
            }
            if(post.tags) post.tags = post.tags.join(",");
            res.render('admin/post-edit', {
                site: site,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    nb.post('/admin/post-edit/:pid', preCheckLogin);
    nb.post('/admin/post-edit/:pid', function (req, res) {
        var pid = parseInt(req.params.pid),
            title = req.body.title,
            tags = req.body.tags.split(",") ? req.body.tags.split(",") : req.body.tags.split("|"),
            content = req.body.content;
        Post.update(pid, title, tags, content, function (err, post){
            if(err){
                req.flash('error', "Sorry, something goes wrong!");
                return res.redirect('/admin');
            }
            req.flash('success', 'Successful!');
            res.redirect('/admin');
        });
    });

    nb.get('/admin/post-del/:pid', preCheckLogin);
    nb.get('/admin/post-del/:pid', function (req, res) {
        var pid = parseInt(req.params.pid);
        Post.edit(pid, function (err, post) {
            if(err){
                req.flash('error', "Sorry, something goes wrong");
                return res.redirect('/admin');
            }
            res.render('admin/post-del', {
                site: site,
                post: post,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    nb.post('/admin/post-del/:pid', preCheckLogin);
    nb.post('/admin/post-del/:pid', function (req, res) {
        var pid = parseInt(req.params.pid);
        Post.delete(pid, function (err) {
            if(err){
                req.flash('error', "Sorry, something goes wrong!");
                return res.redirect('/admin');
            }
            req.flash('success', "Successful!");
            res.redirect('/admin');
        });
    });

	nb.get('/admin/emotions', preCheckLogin);
	nb.get('/admin/emotions', function (req, res) {
		res.render('admin/emotions', {
			site: site,
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});

	nb.post('/admin/emotions', preCheckLogin);
	nb.post('/admin/emotions', function (req, res) {
		var content = req.body.content,
			emotion = new Emotion(content);
			emotion.save(function (err){
				if(err){
					req.flash('error', err); 
					return res.redirect('/admin');
				}
				req.flash('success', 'Successful!');
				res.redirect('/admin');
			});
	});

    nb.get('/admin/emotion-edit/:eid', preCheckLogin);
    nb.get('/admin/emotion-edit/:eid', function (req, res) {
        var eid = parseInt(req.params.eid);
        Emotion.edit(eid, function (err, emotion) {
            if(err || !emotion){
                req.flash('error', "Sorry, something goes wrong!");
                res.redirect('/admin');
            }
            return res.render('admin/emotion-edit', {
                site: site,
                emotion: emotion,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });

    });

    nb.post('/admin/emotion-edit/:eid', preCheckLogin);
    nb.post('/admin/emotion-edit/:eid', function (req, res) {
        var eid = parseInt(req.params.eid),
            content = req.body.content;
        Emotion.update(eid, content, function (err) {
            if(err){
                req.flash('error', "Sorry, something goes wrong");
                return res.redirect('/admin');
            }
            req.flash('success', 'Successful!');
            res.redirect('/admin');//修改成功
        });
    });

    nb.get('/admin/emotion-del/:eid', preCheckLogin);
    nb.get('/admin/emotion-del/:eid', function (req, res) {
        var eid = parseInt(req.params.eid);
        Emotion.edit(eid, function (err, emotion) {
            if(err){
                req.flash('error', "Sorry, something goes wrong");
                return res.redirect('/admin');
            }
            return res.render('admin/emotion-del', {
                site: site,
                emotion: emotion,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    nb.post('/admin/emotion-del/:eid', preCheckLogin);
    nb.post('/admin/emotion-del/:eid', function (req, res) {
        var eid = parseInt(req.params.eid);
        Emotion.delete(eid, function (err) {
            if(err){
                req.flash('error', "Sorry, something goes wrong!");
                return res.redirect('/admin');
            }
            req.flash('success', "Successful!");
            res.redirect('/admin');
        });
    });

    nb.get('/admin/links', preCheckLogin);
    nb.get('/admin/links', function (req, res) {
        Link.get(0, function (err, links) {
            if(err){
                req.flash('error', err);
                res.redirect('/admin');
            }
            links = links.reverse();
            res.render('admin/links', {
                site: site,
                links: links,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    nb.post('/admin/links', preCheckLogin);
    nb.post('/admin/links', function (req, res) {
        var url = req.body.url,
            content = req.body.content,
            link = new Link(url, content);
        link.save(function (err){
            if(err){
                req.flash('error', err);
                return res.redirect('/admin');
            }
            req.flash('success', 'Successful!');
            res.redirect('/admin/links');//发表成功
        });
    });

    nb.get('/admin/link-edit/:lid', preCheckLogin);
    nb.get('/admin/link-edit/:lid', function (req, res) {
        var lid = parseInt(req.params.lid);
        Link.edit(lid, function (err, link) {
            if(err || !link){
                req.flash('error', "Sorry, something goes wrong!");
                res.redirect('/admin');
            }
            res.render('admin/link-edit', {
                site: site,
                link: link,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    nb.post('/admin/link-edit/:lid', preCheckLogin);
    nb.post('/admin/link-edit/:lid', function (req, res) {
        var lid = parseInt(req.params.lid),
            url = req.body.url,
            content = req.body.content;
        Link.update(lid, url, content, function (err){
            if(err){
                req.flash('error', "Sorry, something goes wrong!");
                return res.redirect('/admin');
            }
            req.flash('success', 'Successful!');
            res.redirect('/admin/links');//修改成功
        });
    });

    nb.get('/admin/link-del/:lid', preCheckLogin);
    nb.get('/admin/link-del/:lid', function (req, res) {
        var lid = parseInt(req.params.lid);
        Link.edit(lid, function (err, link) {
            if(err){
                req.flash('error', "Sorry, something goes wrong!");
                return res.redirect('/admin');
            }
            res.render('admin/link-del', {
                site: site,
                link: link,
                user: req.session.user,
                success: req.flash('success').toString(),
                error: req.flash('error').toString()
            });
        });
    });

    nb.post('/admin/link-del/:lid', preCheckLogin);
    nb.post('/admin/link-del/:lid', function (req, res) {
        var lid = parseInt(req.params.lid);
        Link.delete(lid, function (err) {
            if(err){
                req.flash('error', "Sorry, something goes wrong!");
                return res.redirect('/admin');
            }
            req.flash('success', "Successful!");
            res.redirect('/admin/links');
        });
    });

	nb.get('/admin/reg', function (req, res) {
        try{
            var reg = require('./reg.js');  
        }catch(e){
            if(e)return res.redirect('/admin');
        }
        reg.get(req, res);
    })
    nb.post('/admin/reg', function (req, res) {
        try{
            var reg = require('./reg.js');  
        }catch(e){
            if(e)return res.redirect('/admin');
        }
        reg.post(req, res);
    })

	//404
	nb.use(function(req, res) {
        res.render('404', {
       	site: site,
        success: req.flash('success').toString(),
        error: req.flash('error').toString()
       });
	});

	function preCheckLogin(req, res, next){
		if(!req.session.user){
			req.flash('error', "Pls Log in First!");
			return res.redirect('/admin');
		}
		next();
	}
};