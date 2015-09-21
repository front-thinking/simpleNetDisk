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

exports.newfolder = function (req, res, next) {
	var dir = req.body.dir ? req.body.dir : "";
	console.log(dir);
	var mkdirCmd = "mkdir " + homeDir + dir + "newfolder";
	exec(mkdirCmd, function (err, stdout, stderr) {
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

//删除选中文件
exports.delete = function (req, res, next) {
	var fileNames = req.body.fileNames.split("; "),
		fileToDel = [],
		dirToDel = [];

	//拼接完整路径
	for (var i = 0, j = fileNames.length; i < j; i++) {
		fileNames[i] = homeDir + fileNames[i];
	}

	//区分删除文件还是文件夹
	for(var i = 0, j = fileNames.length; i < j; i++ ) {
		if(fileNames[i].indexOf("-type-d") != -1){
			dirToDel.push(fileNames[i].replace("-type-d",""));
		}else {
			fileToDel.push(fileNames[i]);
		}
	}

	//拼接删除文件和文件夹命令
	var fileCmdStr = (fileToDel.length) !== 0 ? "rm " + fileToDel.join(" ") : "";
	var dirCmdStr = (dirToDel.length) !== 0 ? "rm -rf " + dirToDel.join(" ") : "";
	var delCmd;
	if ( fileCmdStr == "" ) {
		delCmd = dirCmdStr;
	} else if ( dirCmdStr == "" ) {
		delCmd = fileCmdStr;
	} else {
		delCmd = dirCmdStr + " && " + fileCmdStr;
	}


	console.log(delCmd);

	exec(delCmd, function (err, stdout, stderr) {
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

//复制选中文件
exports.copy = function (req, res, next) {

	var originalFile = homeDir + req.body.fileName;

	var destFile, copyCmd;

	if (originalFile.indexOf("-type-d") != -1) {
		destFile = originalFile.replace("-type-d", "副本");
		originalFile = originalFile.replace("-type-d", "");
		copyCmd = "cp -av " + originalFile + " " + destFile;
	} else {
		originalFile = originalFile.split(".");
		destFile = originalFile[0] + "副本." + originalFile[1];
		originalFile = originalFile.join(".");
		copyCmd = "cp " + originalFile + " " + destFile
	}

	exec(copyCmd, function (err, stdout, stderr) {
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

//重命名
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

//文件下载
exports.download = function(req, res, next){
	var fileName = req.query.fileName.slice();

	//下载单个文件夹
	if (fileName.indexOf("-type-d") != -1) {
		var dirName = fileName.slice(0, fileName.indexOf("-type-d"));
		var zipfileName = dirName.slice(1).slice(dirName.lastIndexOf("/"));
		var cdCmd = "cd " + homeDir + dirName.slice(0, dirName.lastIndexOf("/"));
		var zipCmd = "zip -r " + zipfileName + ".zip " + zipfileName + "/";
		var cdAndZipCmd = cdCmd + " && " + zipCmd;
		console.log(cdAndZipCmd);
		exec(cdAndZipCmd, function (err, stdout, stderr) {
			if (err) {
				console.log(err);
			} else {
				res.download(homeDir + dirName + ".zip", function (err) {
					if (err) return;
					exec("rm " + homeDir + dirName + ".zip");//delete the zipfile generated
				});
			}
		});

	} else {
		//下载单个文件
		res.download(homeDir + fileName);
	}

}