/**
 * Created by Administrator on 2017/1/6.
 */
var mongoose = require('mongoose');
//使用环境自己的Promise
mongoose.Promise = global.Promise;
mongoose.connection.on('connected', function(){
  console.log('Connection success!');
});
mongoose.connection.on('error', function(err){
  console.log('Connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Connection disconnected');
});

mongoose
  .connect('mongodb://192.168.22.67/test')
  .then(function(){
    console.log("Connectioned");
  })
  .catch(function(err){
    console.log("conn err:",err);
  });

console.log("aaa");

var Cat = mongoose.model('Cat', { name: String });
console.log("bbb");
var kitty = new Cat({ name: 'Zildjian' });
kitty
  .save()
  .then(function(doc){
    console.log(doc.name," save ok");
  })
  .catch(function(err){
    console.log("save err:",err);
  });
console.log("ccc");