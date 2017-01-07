/**
 * Created by Administrator on 2017/1/6.
 */
var mongoose = require('mongoose');
mongoose.set('debug', true);
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
  .connect('mongodb://192.168.2.67/test')
  .then(function(){
    console.log("Connectioned");
  })
  .catch(function(err){
    console.log("conn err:",err);
  });



var Cat = mongoose.model('Cat', {
  名称: String ,
  售价:{}
});

var kitty = new Cat({
  名称: 'Zildjian',
  售价:{2016:{01:3000,02:3500}}
});
/*kitty
  .save()
  .then(function(doc){
    console.log(doc.name," save ok");
  })
  .catch(function(err){
    console.log("save err:",err);
  });*/


//db.cats.find({名称:"Zildjian",售价:{2016:{1:{$exists:true}}}})
//db.cats.find({名称:"Zildjian",售价:{$ne:null}})

Cat.findOne({名称:"Zildjian",售价:{$ne:null}})
.where('售价.2016.1!=null')
  .select('售价.2016')
  .exec(function(err,doc){
  console.log(doc);
});