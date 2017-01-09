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

/*Cat.find({名称:"Zildjian",售价:{$ne:null}})
.where('售价.2016.01!=null')
  .select('售价.2016.1')
  .exec(function(err,doc){
  console.log(doc);
});*/

Cat.findOne({名称:"Zildjian",售价:{$ne:null}})
  .exec(function(err,doc){
    Cat.update({_id:doc._id},{$set:{"售价.2016.3":2000}})
      .then(function(doc){
        console.log("update :",doc)
      });
  });