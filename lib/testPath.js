/**
 * Created by Administrator on 2017/2/13.
 */
var path = require("path");

console.log(path.resolve('./'));
console.log(path.resolve(__dirname));//被运行的代码所在目录
console.log(process.cwd()); //不是指JS代码所在的目录，而是启动Node的目录
console.log(process.execPath)//node.exe的路径
