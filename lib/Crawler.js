/**
 * Created by Administrator on 2017/1/17.
 */
let SimpleCrawler = require("simplecrawler");


let Crawler =(function(){

  function initConfig(){

  }

  class Crawler extends SimpleCrawler {

    constructor(initialURL) {
      super(initialURL);

    }

    initConfig(){

    }

    initDb(){

    }

    initHandler(){

    }

    initEvents(){

    }


    stop(abortRequestsInFlight){
      super.stop(abortRequestsInFlight);
      this.emit("stop");
    }


  }

  return Crawler;
})();


module.exports = Crawler;
