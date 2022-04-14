var express = require('express');
var app = express();

//调用java代码
var exec = require('child_process').exec;
basePath = "/Users/bytedance/Desktop/node/"
TextFilePath = basePath + "config/text";
ProductionPath = basePath + "config/production";
tokenPath = basePath + "config/token";
treePath = basePath + "config/tree";
LL1Path = basePath + "config/LL1";
var cmd = "java -jar config/Compiler.jar" + " "+ TextFilePath+ " "+ ProductionPath+ " "+ tokenPath+ " "+ treePath+ " "+ LL1Path;
function execute(){
  exec(cmd, function(err, stdout, stderr) {
    // 获取命令执行的输出
    if(err) {
      throw err;
    }
    console.log(stdout);  // stdout为执行命令行操作后返回的正常结果
    console.log(stderr);  // stderr为执行命令行操作后返回的错误提示
  });
}

//中间件
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use('/',express.static('./front_end'))

//handler
app.post('/process_post' ,function (req, res) {
  //req->code
  var fs = require("fs");
  fs.writeFileSync(TextFilePath, req.body.textData);

  //调用java逻辑，生成输出到文件中
  execute();

  //读取java生成的文件
  var token = fs.readFileSync(tokenPath, 'utf8');
  var tree = fs.readFileSync(treePath, 'utf8');
  var LL1 = fs.readFileSync(LL1Path, 'utf8');

  //返回
  result = {
    token: token,
    tree: tree,
    LL1: LL1
  }
  res.end(JSON.stringify(result))
})
 
//监听端口
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
