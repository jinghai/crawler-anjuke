/**
 * Created by Administrator on 2017/1/6.
 */
var mongoose = require('mongoose');
mongoose.set('debug', true);
//使用环境自己的Promise
mongoose.Promise = global.Promise;

var dburl = 'mongodb://192.168.2.67/test';
var tableName = 'Cat';
var db = mongoose.createConnection(dburl);

var Schema = {
    name:String,
    price:Number,
}
//http://www.nodeclass.com/api/mongoose.html#schema_Schema
var schema = new mongoose.Schema(Schema, {strict: true});
var model = db.model(tableName, schema);
model
    .findOne({name:'kitty2'})
    .then(function(doc){
        console.log(doc);
        if(!doc){
            var entity = new model({
                name:'kitty2',
                price:1,
                ppp:222
            });
            entity.save().then(function(){console.log("save ok")});
        }else{
            doc.price = ++doc.price;
            var entity = new model(doc);
            entity.save().then(function(){console.log("update ok")});
        }
    })



/*mongoose.connection.on('connected', function(){
  console.log('Connection success!');
});
mongoose.connection.on('error', function(err){
  console.log('Connection error: ' + err);
});
mongoose.connection.on('disconnected', function(){
  console.log('Connection disconnected');
});*/

/*mongoose
  .connect('mongodb://192.168.2.67/test')
  .then(function(){
    console.log("Connectioned");
    mongoose.disconnect();
  })
  .catch(function(err){
    console.log("conn err:",err);
  });*/

/*var date = new Date();
var year = date.getYear();
var month = date.getMonth();


var area = new mongoose.Schema({
  title:  String,
  author: String,
  body:   String,
  comments: [{ body: String, date: Date }],
  date: { type: Date, default: Date.now },
  hidden: Boolean,
  meta: {
    votes: Number,
    favs:  Number
  }
});*/


/*var Cat = mongoose.model('Cat', {
  名称: String ,
  售价:Number
});

var kitty = new Cat({
  名称: 'kitty',
  售价:10
});
kitty
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

/*
Cat.findOne({名称:"Zildjian",售价:{$ne:null}})
  .exec(function(err,doc){
    Cat.update({_id:doc._id},{$set:{"售价.2016.3":2000}})
      .then(function(doc){
        console.log("update :",doc)
      });
  });*/
