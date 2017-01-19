/**
 * Created by Administrator on 2017/1/19.
 */
var path = require("path");
//路径测试
 console.log(path.resolve(".")) //运行[启动]目录
 console.log(__dirname);        //文件所在目录
 console.log(__filename);       //文件所在目录及当前文件名
 console.log(process.cwd());    //运行[启动]目录
 console.log(path.resolve('./'));//运行[启动]目录
