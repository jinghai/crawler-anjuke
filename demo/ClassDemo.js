/**
 * Created by Administrator on 2017/1/17.
 */
let SimpleCrawler = require("simplecrawler");

let Crawler =(function(){

  let _name = ""; //私有变量
  class Crawler extends SimpleCrawler {

    constructor(initialURL) {
      super(initialURL);
      _name = "aaa";
    }
    stop(abortRequestsInFlight){
      super.stop(abortRequestsInFlight);
      this.emit("stop");
    }

    get name(){
      return _name;
    }
    set name(name){
      _name = name;
    }


    static haha(){//静态方法只能在类上调用，实例中无此方法
      console.log("haha")
    }
  }
  return Crawler;
})();


module.exports = Crawler;