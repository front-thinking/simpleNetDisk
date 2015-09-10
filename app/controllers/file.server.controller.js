var config = require("../../config/config");
var child_process = require("child_process");
var exec = child_process.exec;
exports.index = function(req, res, next) {
	console.log(config.homeDir);
	res.render("index", {
		title: "取号"
	}); //控制器，用于控制MVC里面的MV
};

exports.fileList = function(req, res, next) {
	var homeDir  = config.homeDir;
	exec("ls -alk " + homeDir, function(err, stdout, stderr){
		if(!err) {
			var fileList = stdout.replace(/\n$/, "").split("\n");
			fileList.splice(0, 1); // 删除多余信息total
			console.log(fileList);
			for(var i = 0; i < fileList.length; i ++) {
				fileList[i] = fileList[i].match(/[^\s]+/g);
			}
			res.json(fileList);
		}
	})
}