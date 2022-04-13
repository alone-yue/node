var express = require('express');
var app = express();

//调用java代码
var exec = require('child_process').exec;
TextFilePath = "/Users/bytedance/IdeaProjects/Compiler/src/com/company/input/txt";
ProductionPath = "/Users/bytedance/IdeaProjects/Compiler/src/com/company/input/production";
tokenPath = "/Users/bytedance/IdeaProjects/Compiler/src/com/company/output/token";
treePath = "/Users/bytedance/IdeaProjects/Compiler/src/com/company/output/tree";
LL1Path = "/Users/bytedance/IdeaProjects/Compiler/src/com/company/output/LL1";
var cmd = "java -jar Compiler.jar" + " "+ TextFilePath+ " "+ ProductionPath+ " "+ tokenPath+ " "+ treePath+ " "+ LL1Path;
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
app.use('/',express.static('./'))

//文件相关
var fs = require("fs");
function callBackWrite(err) {
  if (err) {
      return console.error(err);
  }
}

//handler方法
app.post('/process_post' ,function (req, res) {
  //req获取数据写入文件---两个输入框
  // fs.writeFileSync(TextFilePath, req.body.textData);
  // fs.writeFileSync(ProductionPath, req.body.productionData);
  fs.writeFileSync('./textData', req.body.textData);
  fs.writeFileSync('./productionData', req.body.productionData);

  console.log(req.body)
  //调用java逻辑，生成输出到文件中
  // execute();

  //读取java生成的文件
  // var token = fs.readFileSync(tokenPath, 'utf8');
  // var tree = fs.readFileSync(treePath, 'utf8');
  // var LL1 = fs.readFileSync(LL1Path, 'utf8');

  result = {
    textData:req.body.textData,
    productionData : req.body.productionData,
    token:'token',
    tree:'tree',
    LL1:'LL1'
  }
  //把读取到的文件返回给前端---三个输出框
  res.end(JSON.stringify(result))
})
 
//监听端口
var server = app.listen(8081, function () {
  var host = server.address().address
  var port = server.address().port
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
})
