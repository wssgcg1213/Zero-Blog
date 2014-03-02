/**
 * mongoDb配置
 */
var mongo = { 
  cookieSecret: 'nb', 
  db: 'zero-blog', 
  host: '127.0.0.1',
  port: '27017',
  user: 'mongouser',
  password: "mongopwd"
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