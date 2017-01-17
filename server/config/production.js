/**
 * Created by YT on 16/8/28.
 */

//生产环境配置
module.exports = {
	port: process.env.PORT || 8800,
	//生产环境mongodb配置
	database: {
		uri: 'mongodb://127.0.0.1/***',
		options: {
			user: '***',          //生产环境用户名
			pass: '***'           //生产环境密码
		}
	}
}
