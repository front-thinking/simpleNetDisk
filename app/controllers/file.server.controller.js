var config = require("../../config/config");
var child_process = require("child_process");
var exec = child_process.exec;
var homeDir = config.homeDir;
exports.index = function(req, res, next) {
	console.log(config.homeDir);
	res.render("index", {
		title: "取号"
	}); //控制器，用于控制MVC里面的MV
};

exports.fileList = function(req, res, next) {

	exec("ls -lk " + homeDir, function(err, stdout, stderr) {
		if (!err) {
			var fileList = stdout.replace(/\n$/, "").split("\n");
			fileList.splice(0, 1); // 删除多余信息total
			console.log(fileList);
			for (var i = 0; i < fileList.length; i++) {
				fileList[i] = fileList[i].match(/[^\s]+/g);
			}
			res.json({
				fileList: fileList
			});
		}
	})
}

exports.delete = function(req, res, next) {
	var fileNames = req.body.fileNames.split("; ");
	for (var i = 0; i < fileNames.length; i++) {
		fileNames[i] = homeDir + fileNames[i];
	}
	exec("rm " + fileNames.join(" "), function(err, stdout, stderr) {
		if (err) {
			console.log(err);
			res.json({status: "0"});
		} else {
			res.json({status: "1"});
			console.log(stdout);
		}
	})
}