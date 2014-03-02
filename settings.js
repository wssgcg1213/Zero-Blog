/**
 * mongoDb配置
 * 如果开启了mongodb的auth,请更改user和password字段
 * if you enable mongodb auth, pls change user & password field
 */
var mongo = { 
  cookieSecret: 'nb', 
  db: 'zero-blog', 
  host: '127.0.0.1',
  port: '27017',
  user: null,
  password: null
}; 

/**
 * 站点配置
 */
var site = {
	author: "Zeroling",
	title: "Zero-Blog",
	subtitle: "@Zeroling",
	indexEmotionAmount: 5,
		//主页显示的Emotion数量,etc,0 == all
	indexPostAmount: 0,
	indexGalleryAmount: 3,
	indexLinkAmount: 21
};


module.exports = {
	mongo: mongo,
	site: site
}