/**
 * Created by Administrator on 2017/1/17.
 */
let SimpleCrawler = require("simplecrawler");

class Crawler extends SimpleCrawler {
  constructor(initialURL) {
    super(initialURL);
  }
  stop(abortRequestsInFlight){
    super.stop(abortRequestsInFlight);
    this.emit("stop");
  }
}

module.exports = Crawler;