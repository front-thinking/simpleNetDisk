// 不同的路由应用不同的控制器
var file = require('../controllers/file.server.controller.js');
module.exports = function(app){
	app.get("/", file.index);
	app.get("/fileList", file.fileList);
};