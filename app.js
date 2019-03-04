var express = require('express');
var app = express();
var session = require('express-session');
var FileStore = require('session-file-store')(session);
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var upload = require('multer')({ dest: 'uploads/' });
var path = require('path');
var fs = require('fs');
var unzip = require("unzip");
var identityKey = 'skey';
var users = require('./users').items;

var deleteFolder = function(path) {
    var files = [];
    if( fs.existsSync(path) ) {
        files = fs.readdirSync(path);
        files.forEach(function(file,index){
            var curPath = path + "/" + file;
            if(fs.statSync(curPath).isDirectory()) { // recurse
                deleteFolder(curPath);
            } else { // delete file
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
};

var findUser = function (name, password) {
	return users.find(function (item) {
		return item[name] === password;
	});
};

var RegisterUser = function (name, password) {
	return users.find(function (item) {
		return item[name] = password;
	});
};

var isRegisterind = function (name) {
	return users.find(function (item) {
		return item[name];
	});
};

var GetAllWeb = function (name) {
	var database = [];
	fs.readdir(path.join(__dirname, "public", "user", name), function (err, files) {
		if (err) {
			return console.error(err);
		}
		files.forEach(function (file) {
			database[file] = file;
		});
	});
	//console.log(JSON.stringify(database));
	console.log(database);
	return database;
}

var arrTojson = function (arr) {
	if (!arr.length) return null;
	var len = arr.length,
		array = [];
	for (var i = 0; i < len; i++) {
		array.push({ "projectname": arr[i] });
	}
	return JSON.stringify(array);
}



app.set('views', 'views/');
app.set('view engine', 'ejs');

app.use(express.static(__dirname + '/public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(session({
	name: identityKey,
	secret: 'me66ccff',  // 用来对session id相关的cookie进行签名
	store: new FileStore(),  // 本地存储session（文本文件，也可以选择其他store，比如redis的）
	saveUninitialized: false,  // 是否自动保存未初始化的会话，建议false
	resave: false,  // 是否每次都重新保存会话，建议false
	cookie: {
		maxAge: 1000 * 1000  // 有效期，单位是毫秒
	}
}));



app.get('/', function (req, res, next) {
	//console.log("");
	var sess = req.session;
	var loginUser = sess.loginUser;
	var isLogined = !!loginUser;
	//console.log(isLogined);
	// res.render('index', {
	// 	isLogined: isLogined,
	// 	name: loginUser || ''
	// });

	// console.log(_tmp.length);
	// console.log(GetAllWeb(loginUser));
	//var database = {};
	// for(var i = 0;i<_tmp.length;i++){
	// 	database = AddNode(database,i,_tmp[i]);
	// }
	//console.log(database);
	if (!!isLogined) {
		// var param = {
		// 	name: loginUser || '',
		// 	test: "hello",
		// };
		// for (var i = 0; _tmp[i]; i++) {
		// 	param.push({ i: _tmp[i] })
		// }
		//console.log(JSON.parse(_tmp));
		//登陆以后显示的界面
		//_tmp = arrTojson(_tmp);
		var _tmp = new Array();
		fs.readdir(path.join(__dirname, "public", "user", loginUser), function (err, files) {
			if (err) {
				return console.error(err);
			}
			//console.log(files.length);
			//_tmp +="['";
			for (var i = 0; i < files.length; i++) {
				//_tmp+=files[i]+",'";
				//_tmp.push({i: files[i] });
				_tmp[i] = files[i];
				console.log(_tmp);
			}
			//_tmp += "']";
			res.render('Dashboard', {
				name: loginUser || '',
				"data": _tmp
			});
			//console.log(_tmp);
			// files.forEach(function (file) {
			// 	console.log(file);
			// 	_tmp.push({ file: file });
			// });
		});
		//_tmp = GetAllWeb(loginUser);
	} else {
		console.log("未登录时显示的界面");
		res.sendfile("./public/login.html");
		//res.render('login');
		//res.sendfile("./views/未登录.html");
	}
});

app.get('/login', function (req, res, next) {
	console.log("Login 路径被调用了");
	res.sendfile("./public/login.html");
});

app.get('/register', function (req, res, next) {
	console.log("Login 路径被调用了");
	res.sendfile("./public/register.html");
});

app.get('/Dashboard', function (req, res, next) {
	console.log("Dashboard 路径被调用了");
	var sess = req.session;
	var loginUser = sess.loginUser;
	var isLogined = !!loginUser;
	//console.log(isLogined);
	// res.render('index', {
	// 	isLogined: isLogined,
	// 	name: loginUser || ''
	// });

	// console.log(_tmp.length);
	// console.log(GetAllWeb(loginUser));
	//var database = {};
	// for(var i = 0;i<_tmp.length;i++){
	// 	database = AddNode(database,i,_tmp[i]);
	// }
	//console.log(database);
	if (!!isLogined) {
		// var param = {
		// 	name: loginUser || '',
		// 	test: "hello",
		// };
		// for (var i = 0; _tmp[i]; i++) {
		// 	param.push({ i: _tmp[i] })
		// }
		//console.log(JSON.parse(_tmp));
		//登陆以后显示的界面
		//_tmp = arrTojson(_tmp);
		var _tmp = new Array();
		fs.readdir(path.join(__dirname, "public", "user", loginUser), function (err, files) {
			if (err) {
				return console.error(err);
			}
			//console.log(files.length);
			//_tmp +="['";
			for (var i = 0; i < files.length; i++) {
				//_tmp+=files[i]+",'";
				//_tmp.push({i: files[i] });
				_tmp[i] = files[i];
				console.log(_tmp);
			}
			//_tmp += "']";
			res.render('Dashboard', {
				name: loginUser || '',
				"data": _tmp
			});
			//console.log(_tmp);
			// files.forEach(function (file) {
			// 	console.log(file);
			// 	_tmp.push({ file: file });
			// });
		});
		//_tmp = GetAllWeb(loginUser);



	} else {
		console.log("未登录时显示的界面");
		res.sendfile("./public/login.html");
		//res.render('login');
		//res.sendfile("./views/未登录.html");
	}
});

app.get('/test', function (req, res, next) {
	console.log("test 路径被调用了");
	res.sendfile("./views/未登录.html");
});

app.all("/public", function (req, res, next) {
	console.log("public 目录被访问");
});


app.post('/register', function (req, res, next) {
	console.log("register 接口被调用了");
	//console.log(!!isRegisterind(req.body.name));
	//查看用户名是否已存在
	if (isRegisterind(req.body.name)) {
		return res.json({ ret_code: 1, ret_msg: '注册失败，用户已存在' });
	} else {
		RegisterUser(req.body.name, req.body.password)
		//users.items[req.body.name] = req.body.password;
		console.log(users);
		fs.exists(path.join(__dirname, "public", "user", req.body.name), function(exists) {  
			if(!exists){
				fs.mkdirSync(path.join(__dirname, "public", "user", req.body.name));
			}
		});  
		return res.json({ ret_code: 0 });
	}
	// users.push({
	// 	"test1": "234678",
	// });
});


app.post('/login', function (req, res, next) {
	console.log("Login 接口被调用了");
	var isLogined = !!req.session.loginUser;
	var sess = req.session;
	var user = findUser(req.body.name, req.body.password);

	if (user) {
		req.session.regenerate(function (err) {
			if (err) {
				return res.json({ ret_code: 2, ret_msg: '登录失败' });
			}

			req.session.loginUser = req.body.name;
			res.json({ ret_code: 0, ret_msg: '登录成功' });
		});
	} else {
		res.json({ ret_code: 1, ret_msg: '账号或密码错误' });
	}
});

app.get('/logout', function (req, res, next) {

	req.session.destroy(function (err) {
		if (err) {
			res.json({ ret_code: 2, ret_msg: '退出登录失败' });
			return;
		}

		req.session.loginUser = null;
		res.clearCookie(identityKey);
		res.redirect('/');
	});
});

app.post('/del', function (req, res, next) {
	console.log("del 接口被调用了");
	var sess = req.session;
	var loginUser = sess.loginUser;
	var isLogined = !!loginUser;
	let username = req.session.loginUser;
	if (!!isLogined) {
		var pathImg = path.join(__dirname, "public", "user", username,req.body.name);
		deleteFolder(pathImg);
		return res.json({ ret_code: 0, ret_msg: '删除成功' });
	} else {
		return res.json({ ret_code: 1, ret_msg: '删除失败' });
	}

});

app.post('/upload', upload.single('test-upload'), (req, res) => {
	let username = req.session.loginUser;
	// 没有附带文件
	if (!req.file) {
		res.json({ ok: false });
		return;
	}
	// 输出文件信息
	console.log('===================== 上传文件信息 ===============================');
	console.log('fieldname: ' + req.file.fieldname);
	console.log('originalname: ' + req.file.originalname);
	console.log('encoding: ' + req.file.encoding);
	console.log('mimetype: ' + req.file.mimetype);
	console.log('size: ' + (req.file.size / 1024).toFixed(2) + 'KB');
	console.log('destination: ' + req.file.destination);
	console.log('filename: ' + req.file.filename);
	console.log('path: ' + req.file.path);

	// 重命名文件
	let oldPath = path.join(__dirname, req.file.path);
	let newPath = path.join(__dirname, 'uploads/' + req.file.originalname);
	fs.rename(oldPath, newPath, (err) => {
		if (err) {
			res.json({ ok: false });
			console.log(err);
		} else {
			res.json({ ok: true });
		}
	});
	console.log('===================== 文件上传成功 ===============================');
	fs.createReadStream(newPath).pipe(unzip.Extract({ path: path.join(__dirname, "public", "user", username) }));
	console.log('===================== 文件解压成功 ===============================');
	fs.unlinkSync(newPath);
	console.log('==================== 临时文件已删除 ===============================');
	console.log(GetAllWeb(username));
});
app.listen(80);