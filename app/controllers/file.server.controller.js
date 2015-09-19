var config = require("../../config/config");
var child_process = require("child_process");
var fs = require('fs');
var path = require('path');
var exec = child_process.exec;
var homeDir = config.homeDir;
exports.index = function (req, res, next) {
	console.log(config.homeDir);
	res.render("index", {
		title: "取号"
	}); //控制器，用于控制MVC里面的MV
};

//返回当前目录文件列表
exports.fileList = function (req, res, next) {
	var dir;
	if (req.query.dir) dir = req.query.dir;
	else dir = "";
	exec("ls -l " + homeDir + dir, function (err, stdout, stderr) {
		if (!err) {
			console.log(stdout);
			var fileList = stdout.split("\n");
			fileList.splice(0, 1); // 删除多余信息total
			fileList.pop();
			console.log(fileList);
			for (var i = 0, j = fileList.length; i < j; i++) {
				fileList[i] = fileList[i].match(/[^\s]+/g);
			}
			res.json({
				fileList: fileList
			});
		}
	});
};

//删除选中文件
exports.delete = function (req, res, next) {
	var fileNames = req.body.fileNames.split("; ");
	for (var i = 0; i < fileNames.length; i++) {
		fileNames[i] = homeDir + fileNames[i];
	}
	exec("rm " + fileNames.join(" "), function (err, stdout, stderr) {
		if (err) {
			console.log(err);
			res.json({
				status: "0"
			});
		} else {
			res.json({
				status: "1"
			});
			console.log(stdout);
		}
	});
};
exports.rename = function (req, res, next) {
	var originalName = homeDir + req.body.originalName.trim();
	var currentName = homeDir + req.body.currentName.trim();
	exec("mv " + originalName + " " + currentName, function (err, stdout, stderr) {
		if (err) {
			console.log(err);
			res.json({
				status: "0"
			});
		} else {
			res.json({
				status: "1"
			});
			console.log(stdout);
		}
	});
};

exports.upload = function (req, res, next) {
	var file = req.file;
	var dir = req.body.dir;
	var sourceFile = path.join(config.basePath + "/uploads/", file.filename);
	var destPath = path.join(homeDir, dir, file.originalname);
	exec("mv " + sourceFile + " " + destPath, function (err, stdout, stderr) {
		if (err) {
			console.log(err);
			res.json({
				status: "0"
			});
		} else {
			res.json({
				status: "1"
			});
			console.log(stdout);
		}
	});
};
exports.download = function(req, res, next){
	var fileNames = req.query.fileNames.split("; ");
	for (var i = 0; i < fileNames.length; i++) {
		res.download(homeDir + fileNames[i]);
	}
}