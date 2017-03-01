/**
 * Created by yneos on 2017/3/1.
 */
var util = require('util');
//返回进程的当前工作目录
console.log('Current directory: ' + process.cwd());
//该进程的环境中指定的键/值对
console.log('Environment Settings: ' + JSON.stringify(process.env));
//用于启动Node.js应用程序的命令参数
console.log('Node Args: ' + process.argv);
//Node。js从中启动的绝对路径
console.log('Execution Path: ' + process.execPath);
//用于启动应用程序的特定节点的命令行选项
console.log('Execution Args: ' + JSON.stringify(process.execArgv));
//Node.js版本号
console.log('Node Version: ' + process.version);
//提供一个对象,包含Node.js应用程序所需的模块和版本
console.log('Module Versions: ' +  JSON.stringify(process.versions));
//用于编译当前节点可执行程序的配置选项
console.log('Node Config: ' +  JSON.stringify(process.config));
//当前进程ID
console.log('Process ID: ' + process.pid);
//当前进程标题
console.log('Process Title: ' + process.title);
//操作系统
console.log('Process Platform: ' + process.platform);
//进程正在运行的处理器体系结构
console.log('Process Architecture: ' + process.arch);
//Node.js进程的当前内存使用情况可使用util.inspect()读取
console.log('Memory Usage: ' + util.inspect(process.memoryUsage()));
//返回一个高精确的时间
var start = process.hrtime();
setTimeout(function() {
    var delta = process.hrtime(start);
    console.log('High-Res timer took %d seconds and %d nanoseconds',
        delta[0], + delta[1]);
    console.log('Node has been running %d seconds', process.uptime());
}, 1000);
process.on('SIGINT', function() {
    console.log('Got SIGINT.  Press Control-D/Control-C to exit.');
});