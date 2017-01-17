/**
 * Created by Administrator on 2017/1/17.
 */

//import Task from './Task.js';

let Task = require("./Task.js");
class CrawlTask extends Task {
  constructor(name) {
    super(name);
  }
}



module.exports = Task;

new CrawlTask("aaa").getName();
