var application_root = __dirname,
    express = require("express"),
    path = require("path"),
    mongoose = require('mongoose');

var app = express.createServer();

// Database

mongoose.connect('mongodb://localhost/geosocial_database');

// Config

app.configure(function () {
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(application_root, "public")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));


});
  
  var Schema = mongoose.Schema;


   var Post = new Schema({  
    texto: { type: String, required: true },  
    latitude: { type: String, required: true },  
    longitude: { type: String, required: true },  
    created: { type: Date, default: Date.now }
	});

 
  var PostModel = mongoose.model('Post', Post);  

app.get('/api', function (req, res) {
  res.send('Ecomm API is running');
});

app.get('/posts', function (req, res){
  return PostModel.find(function (err, Posts) {
    if (!err) {
      return res.send(Posts);
    } else {
      return console.log(err);
    }
  });
});

app.post('/posts', function (req, res){
  var post;
  console.log("POST: ");
  console.log(req.body);
  post = new PostModel({
    texto: req.body.texto,
    latitude: req.body.latitude,
    longitude: req.body.longitude
  });
  post.save(function (err) {
    if (!err) {
      return console.log("created");
    } else {
      return console.log(err);
    }
  });
  return res.send(post);
});


app.get('/posts/:id', function (req, res){
  return PostModel.findById(req.params.id, function (err, post) {
    if (!err) {
      return res.send(post);
    } else {
      return console.log(err);
    }
  });
});

app.put('/posts/:id', function (req, res){
  return PostModel.findById(req.params.id, function (err, post) {
    post.texto = req.body.texto;
    post.latitude = req.body.latitude;
    post.longitude = req.body.longitude;
    return Post.save(function (err) {
      if (!err) {
        console.log("updated");
      } else {
        console.log(err);
      }
      return res.send(Post);
    });
  });
});

app.delete('/posts/:id', function (req, res){
  return PostModel.findById(req.params.id, function (err, post) {
    return post.remove(function (err) {
      if (!err) {
        console.log("removed");
        return res.send('');
      } else {
        console.log(err);
      }
    });
  });
});



// Launch server

app.listen(4242);