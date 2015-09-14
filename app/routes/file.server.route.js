// 不同的路由应用不同的控制器
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var file = require('../controllers/file.server.controller.js');
module.exports = function(app){
	app.get("/", file.index);
	app.get("/fileList", file.fileList);
	app.post("/delete", file.delete);
	app.post("/rename", file.rename);
	app.post("/upload",upload.single('myfile'), file.upload)
};