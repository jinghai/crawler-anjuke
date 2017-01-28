/**
 * Created by yneos on 2017/1/29.
 */
var request = require('request');
var cheerio = require('cheerio');
var loader =  require('./loader.js');
var urls = [
    'http://www.xicidaili.com/nn/',
    'http://www.kuaidaili.com/free/inha/'
]
class Proxys {
    constructor() {

    }

    testServer(hosts){
        console.log(hosts)
        for(var i=0;i<hosts.length;i++){
            var host = hosts[i].host;
            var port = hosts[i].port;
            request.get('http://www.baidu.com/',{host:host,port:port,timeout:1500,headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Accept-Language': 'zh-CN,zh;q=0.8',
                'Connection': 'close'
            }},function(error, response, body){
                if (!error && response.statusCode == 200) {
                    console.log(i,host,port,"ok");
                }else{
                    console.log(i,host,port,"no");
                }
            })

        }
    }

    getProxyServers() {
        var self = this;
        request.get(urls[0],{timeout:1500,headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 6.1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/45.0.2454.93 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'zh-CN,zh;q=0.8',
            'Connection': 'close'
        }},function(error, response, body){
            var $ = cheerio.load(body);
            var rows = $('tr');
            var hosts = [];
            for(var i=0,len=rows.length;i<len;i++){
                var cells = $(rows[i]).find('td');
                var obj = {
                    host:$(cells[1]).text(),
                    port:$(cells[2]).text(),
                }
                hosts.push(obj)
            }
            self.testServer(hosts)

        })

        /*loader
            .getDOM(urls[1]).then(function($){
                //var rows = $('tr').text();
                //console.log(rows)
            }).catch(function(e) {
                console.log(e)
            })*/

    }
}
module.exports = Proxys;

var p = new  Proxys();
p.getProxyServers();