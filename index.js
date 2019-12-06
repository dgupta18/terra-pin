var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var _ = require("underscore");
var schema = require('./models/Schema');
var moment = require('moment');
// exphbs.registerHelper('times', function(n, block) {
//     var accum = '';
//     n = parseInt(n)
//     for(var i = 0; i < n; ++i)
//         accum += block.fn(i);
//     return accum;
// });
// var http = require('http').Server(app);
// var io = require('socket.io')(http);

// Connect to MongoDB
console.log(process.env.MONGODB)
mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB, { useNewUrlParser: true , useUnifiedTopology: true});
mongoose.connection.on('error', function () {
    console.log('MongoDB Connection Error. Please make sure that MongoDB is running.');
    process.exit(1);
});

// var _DATA = dataUtil.loadData().terraPins;
//dotenv.load();
var _DATA = {}
var app = express();

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/", helpers:{
            times: function(n, block) {
                var accum = '';
                //console.log(n)
                n = parseInt(n)
                for(var i = 0; i < n; ++i)
                    accum += block.fn(i);
                return accum;
            }
        }}))
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));


/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

// NAV: home page


app.get('/',function(req,res){
    schema.Pin.find({}, function(err, pins) {
        // res.render(<handlebarspage>, <variableNameForData: actualData>)
        return res.render('home', { data: pins });
    });
});

// API: get, get raw data
app.get('/api/getTerraPins', function(req,res){
    schema.Pin.find({}, function (err, pins) {
        res.json(JSON.parse(JSON.stringify(pins)))
    })
});



// ************* CREATE *************
// NAV: create pin (render)
app.get("/create", function (req, res) {
    res.render('create', {
        onCreate: true,
        nHome: false
    });
});

// NAV: create pin (post req)
app.post("/create", function (req, res) {
    var body = req.body;
    console.log(body.description)

    var pin = new schema.Pin({
        name: body.name,
        onCampus: body.onCampus === "true",
        tags: body.tags.toString().split(" "),
        user: body.user,
        image: body.image,
        description: body.description,
        recommendations: [],
        reviews: []
    })

    pin.save(function (err) {
        if (err) throw err;
        //return res.send("Pin added!")
    })

    res.redirect("/");
});

//DONE
// API: post, create pin
app.post("/api/pin", function (req, res) {
    var body = req.body;

    var pin = new schema.Pin({
        name: body.name,
        description: body.description,
        onCampus: body.onCampus === "true",
        image: body.image,
        tags: body.tags.toString().split(" "),
        user: body.user,
        reviews: [],
        recommendations: []
    })


    pin.save(function (err) {
        if (err) throw err
        res.send("Pin added!")
    })
});

//DONE
// API: post, create review
app.post("/api/create/pin/:name/review", function (req, res) {
    var body = req.body;

    // add a review to a pin
    schema.Pin.findOne({ name: req.params.name }, function (err, currPin) {
        if (err) throw err
        if (!currPin) return res.send("No pin of name given exists")
        
        var review = {
            rating: parseInt(req.body.rating),
            comment: req.body.comment,
            author: req.body.author,
            timestamp : moment().format('LLL')
        }
        currPin.reviews = currPin.reviews.concat([review])
        currPin.save(function (err) {
            if (err) throw err
            return res.send("pin review added!")
        })


        // save new pin avg rating
    
    });



});



// ************* DELETE *************
// API: delete, del pin
app.delete('/api/delete/pin/:name', function (req, res) {
    schema.Pin.findOneAndRemove({ name: req.params.name }, function (err, currPin) {
        if (!currPin) res.send("no pin with this name exists!")
    })

    schema.Pin.updateMany({ 'recommendations.location': req.params.name }, { $pull: { 'recommendations': { 'location': req.params.name } } }, function(err,unknown){
        if (err) throw err
        return res.send("deleted the pin!")
    })
});

// API: delete, del review
app.delete('/pin/:name/review/last', function (req, res) {
    var name = req.params.name


});

// ************* RECOMMENDATIONS *************
app.post('/api/create/pin/recommendation/:for/:of', function (req, res) {
    schema.Pin.findOne({ name: req.params.for }, function (err, currPinFor) {

        if (err) throw err
        if (!currPinFor) return res.send("No pin of name given exists")

        var recommendation = {
            user: req.body.user,
            location: req.params.of,
            reason: req.body.reason
        }
        
        currPinFor.recommendations = currPinFor.recommendations.concat([recommendation])
        currPinFor.save(function(err){
            if (err) throw err
            return res.send("pin recommendation added!")
        })
        
        // schema.Pin.findOne({ name : req.params.of}, function(err, currPinnOf ){
        //     if (err) throw err
        //     if (!currPinnOf) return res.send("No pin found to recommend")
            
        //     var recommendation = {
        //         user: req.body.user,
        //         location: currPinnOf,
        //         reason: req.body.reason,
        //     }
        //     currPinFor.recommendations = currPinFor.recommendations.concat([recommendation])
        //     currPinFor.save(function (err) {
        //         if (err) throw err
        //         return res.send("pin recommendation added!")
        //     });
        // });
    });
});



// ************* TAGS *************
// NAV: Tags 
app.get("/Tags", function(req,res){
    var tagSet = new Set();
    schema.Pin.find({}, function(err, pinGroup){
        if (err) throw err
        _.each(pinGroup, function(pin){
            _.each(pin.tags, function(tag){
                tagSet.add(tag)
            })
        })
        console.log(tagSet)
        res.render('home', {
            data: Array.from(tagSet),
            filter: "Tags",
            navitem: true,
            onHome: false,
            onCreate: false,
            tag: true
          });
    })
});

// NAV: Tags - specific tag
app.get("/Tags/:tag", function (req, res) {
    var tag = req.params.tag;
    schema.Pin.find({tags: [tag]}, function(err, pins) {
        res.render('home', {
            data: pins,
            filter: tag,
            onHome: false,
            onCreate: false
        });
    }) 
});

// API: get, get tags
app.get("/api/Tags", function (req, res) {
    schema.Pin.find({}, function(err, pinGroup){
        if (err) throw err
        var tagSet = new Set();
        _.each(pinGroup, function(pin){
            _.each(pin.tags, function(tag){
                tagSet.add(tag)
            })
        })
        res.json(Array.from(tagSet))
    })
});

// API: get, get specific given tag
app.get("/api/Tags/:tag", function (req, res) {
    var tag = req.params.tag;

    schema.Pin.find({tags: [tag]}, function(err, pins) {
        res.json(pins);
    })
});





// ************* ON/OFF CAMPUS *************
// API: get, onCampus
app.get("/api/OnCampus", function(req,res){
  var retArr = [];
  
  schema.Pin.find({}, function(err, pins) {
    _.each(pins, function(elem){
        if (elem.onCampus) {
          retArr.push(elem);
        }
      })
      res.json(retArr)
  })
})

// API: get, offCampus
app.get("/api/OffCampus", function (req, res) {
  var retArr = [];

  schema.Pin.find({}, function(err, pins) {
    _.each(pins, function(elem){
        if (!elem.onCampus) {
          retArr.push(elem);
        }
      })
      res.json(retArr)
  })
})




// ************* RANKING *************
// NAV: ranking
app.get("/Ranking", function(req,res){
  var retArr = _.clone(_DATA);
  retArr.sort(function(b,a){
    return a.ranking > b.ranking ? 1 : (a.ranking === b.ranking) ? ((a.name > b.name) ? 1 : -1) : -1 ;
  });

  res.render('home', {
    data: retArr,
    filter: "Ranking",
    onHome: false,
    onCreate: false
  });
})

// API: get, ranking
app.get("/api/Ranking", function(req,res){
  var retArr = _.clone(_DATA);
  retArr.sort(function (b, a) {
      return a.ranking > b.ranking ? 1 : (a.ranking === b.ranking) ? ((a.name > b.name) ? 1 : -1) : -1;
  });
  
  res.json(retArr);
})



// ************* RANDOM *************
// NAV: Random

app.get("/Random", function (req, res) {
    // var rand = _DATA[Math.floor(Math.random() * _DATA.length)];
    schema.Pin.findOneRandom(function(err, result) {
        if (!err) {
            res.render('home', {
                data: [result],
                filter: "Random",
                onHome: false,
                onCreate: false,
              });
        } else {
            res.send("No Pins available");
        }
      });

});

// API: get, get random pin
app.get("/api/Random", function(req,res){

    schema.Pin.findOneRandom(function(err, result) {
        if (!err) {
          console.log(result); // 1 element
          res.json(result)
        } else {
            res.send("No Pins available");
        }
      });
})

// ************* ABOUT *************
// NAV: About
app.get("/About", function (req, res) {
    var about = true

    res.render('home', {
        filter: "About",
        navitem: true,
        onHome: false,
        onCreate: false,
        about: about
    });
});



// ************* SEARCH *************
app.get("/search/:query", function(req,res){
  var _query = req.params.query.toLowerCase();
  var retArr = [];

  console.log("QUERY: " + _query)

  _.each(_DATA, function(elem){
    if (elem.name.toLowerCase().startsWith(_query)) {
      retArr.push(elem);
    }
  })

  console.log(retArr);

  res.send(retArr);
})



// ************* SETUP *************
app.listen(3000, function() {
    console.log('Example app listening on port 3000!');
});
