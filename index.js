var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();
var logger = require('morgan');
var exphbs = require('express-handlebars');
var dataUtil = require("./data-util");
var _ = require("underscore");
var schema = require('./models/Schema');

// Connect to MongoDB
//console.log(process.env)
console.log(process.env.MONGODB,)
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
app.engine('handlebars', exphbs({ defaultLayout: 'main', partialsDir: "views/partials/" }));
app.set('view engine', 'handlebars');
app.use('/public', express.static('public'));

/* Add whatever endpoints you need! Remember that your API endpoints must
 * have '/api' prepended to them. Please remember that you need at least 5
 * endpoints for the API, and 5 others.
 */

// NAV: home page
app.get('/',function(req,res){
    res.render('home', {
        data: _DATA,
        onHome: true,
    });
});

// API: get, get raw data
app.get('/api/getTerraPins', function(req,res){
    res.json(_DATA)
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

    var pin = new schema.Pin({
        name: body.name,
        onCampus: body.onCampus === "true",
        category: body.category,
        tags: body.tags,
        user: body.user,
        image: body.image,
        rating: parseInt(body.rating),
        reviews: []
    })

    pin.save(function (err) {
        if (err) throw err
        res.send("Pin added!")
    })

    res.redirect("/");
});

// API: post, create pin
app.post("/api/pin", function (req, res) {
    var body = req.body;

    var pin = new schema.Pin({
        name: body.name,
        onCampus: body.onCampus === "true",
        category: body.category,
        tags: body.tags,
        user: body.user,
        image: body.image,
        rating: parseInt(body.rating),
        reviews: []
    })

    pin.save(function (err) {
        if (err) throw err
        res.send("Pin added!")
    })

    schema.GroupPins.findOne({ name: body.category }, function (err,group) {
        if (err) throw err
        if (!group) {
            var newGroup = new schema.GroupPins({
                name: body.category,
                pins: [body.name]
            });
            newGroup.save(function(err) {
                if (err) throw err
                return res.send("GroupPins added!")
            });
        } else {
            group.pins = groups.pins.concat([body.name])
            group.save(function (err) {
                if (err) throw err
                return res.send("Pin added to GroupPins!")
            });
        }
    });
});

// API: post, create review
app.post("/api/pin:name:review", function (req, res) {
    var body = req.body;

    schema.Pin.findOne({ name: req.params.name }, function (err, pin) {
        if (err) throw err
        if (!pin) return res.send("No pin of name given exists")
        var review = {
            rating: parseInt(req.body.rating),
            comment: req.body.comment,
            author: req.body.author
        }
        pin.reviews = pin.reviews.concat([review])
        pin.save(function (err) {
            if (err) throw err
            return res.send("pin review added!")
        })
    });
});



// ************* DELETE *************
// API: delete, del pin
app.delete('/pin/:name', function (req, res) {
    var category = ""

    schema.Pin.findOneAndRemove({ name: req.params.name }, function (err, pin) {
        if (!pin) res.send("Not Deleted")
        category = pin.category
        res.send("Deleted")
    })

    schema.GroupPins.update({ name: category }, { $pull: { pins: [req.params.name] } } );
});

// API: delete, del review
app.delete('/pin/:name/review/last', function (req, res) {
    // Delete last review

});



// ************* CATEGORIES *************
// NAV: Categories 
app.get("/Category", function (req, res) {
    var categories = dataUtil.getAllCategories(_DATA); //need to impl this function
    console.log(categories);
    var category = true;

    console.log(category);

    res.render('home', {
        data: categories,
        filter: "Category",
        navitem: true,
        onHome: false,
        onCreate: false,
        category: category
    });
});

// NAV: Categories - specific category
app.get("/Category/:subgroup", function (req, res) {
    var retArr = [];
    var _subgroup = req.params.subgroup;

    _.each(_DATA, function (elem) {
        if (elem.category === _subgroup) {
            retArr.push(elem);
        }
    })

    res.render('home', {
        data: retArr,
        filter: _subgroup,
        onHome: false,
        onCreate: false
    });
});

// API: get, get categories
app.get("/api/Category", function (req, res) {
    var categories = dataUtil.getAllCategories(_DATA);
    res.json(categories);
});

// API: get, get specific given category
app.get("/api/Category/:subgroup", function (req, res) {
    var _subgroup = req.params.subgroup;
    var retArr = [];

    _.each(_DATA, function (elem) {
        if (elem.category === _subgroup) {
            retArr.push(elem);
        }
    })

    res.json(retArr);
});



// ************* TAGS *************
// NAV: Tags 
app.get("/Tags", function(req,res){
  var tags = dataUtil.getAllTags(_DATA);
  console.log(tags);
  var tag = true;
  
  console.log(tag);

  res.render('home', {
    data: tags,
    filter: "Tags",
    navitem: true,
    onHome: false,
    onCreate: false,
    tag: tag
  });
});

// NAV: Tags - specific tag
app.get("/Tags/:subgroup", function (req, res) {
    var retArr = [];
    var _subgroup = req.params.subgroup;

    _.each(_DATA, function (elem) {
        if (elem.tags.includes(_subgroup)) {
            retArr.push(elem);
        }
    })

    res.render('home', {
        data: retArr,
        filter: _subgroup,
        onHome: false,
        onCreate: false
    });
});

// API: get, get tags
app.get("/api/Tags", function (req, res) {
    var tags = dataUtil.getAllTags(_DATA);
    res.json(tags);
});

// API: get, get specific given tag
app.get("/api/Tags/:subgroup", function (req, res) {
    var _subgroup = req.params.subgroup;
    var retArr = [];

    _.each(_DATA, function (elem) {
        if (elem.tags.includes(_subgroup)) {
            retArr.push(elem);
        }
    })

    res.json(retArr);
});



// ************* USERS *************
app.get("/api/Users", function (req, res) {
  var users = new Set();
  _.each(_DATA, function (elem) {
    users.add(elem.user);
  })

  res.json(Array.from(users));
})



// ************* ON/OFF CAMPUS *************
// API: get, onCampus
app.get("/api/OnCampus", function(req,res){
  var retArr = [];
  
  _.each(_DATA, function(elem){
    if (elem.onCampus) {
      retArr.push(elem);
    }
  })

  retArr.push(retArr)
})

// API: get, offCampus
app.get("/api/OffCampus", function (req, res) {
  var retArr = [];

  _.each(_DATA, function (elem) {
    if (!elem.onCampus) {
      retArr.push(elem);
    }
  })

  res.json(retArr);
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
  var rand = _DATA[Math.floor(Math.random() * _DATA.length)];

  res.render('home', {
    data: [rand],
    filter: "Random",
    onHome: false,
    onCreate: false,
  });
});

// API: get, get random pin
app.get("/api/Random", function(req,res){
  var rand = _DATA[Math.floor(Math.random() * _DATA.length)];

  res.json(rand);
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
app.listen(process.env.PORT || 3000, function() {
    console.log('Listening on port 3000!');
});
