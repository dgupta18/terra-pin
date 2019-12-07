
# TerraPin

---

Name: Divya Gupta, Tiffany Tran, Anna Mazzanti

Date: Dec 6, 2019

Project Topic: Website where users can upload and browse TerraPins (hotspots) on and around UMD's campus. Each pin is categorized, and users can browse through categories or look at random new pins!

URL: https://terra-pin.herokuapp.com/

---


### 1. Data Format and Storage

Pin data point fields:
- `Field 1`: Name                `Type: String`
- `Field 2`: On or off campus    `Type: Boolean`
- `Field 3`: Category            `Type: String`
- `Field 4`: Tags                `Type: [String]`
- `Field 5`: User                `Type: String`
- `Field 6`: Link to image       `Type: String`

Pin Schema: 
```javascript
{
   name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    onCampus: {
        type: Boolean,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    user: {
        type: String,
        required: true
    },
    avgRating: {
        type: Number,
        required: false
    },
    reviews: [reviewSchema],
    recommendations: [recommendationSchema]
}
```

Review data point fields:
- `Field 1`: Rating (*/5)        `Type: Number`
- `Field 2`: Comment             `Type: String`
- `Field 3`: Author              `Type: String`
- `Field 4`: TimeCreated         `Type: Date`

Review Schema:
```javascript
{
    rating: {
        type: Number,
        min: 0,
        max: 5,
        required: true
    },
    comment: {
        type: String
    },
    author: {
        type: String,
        required: true
    },
    timeCreated: {
        type: String,
    }
}
```

Recommendation data point fields:
- `Field 1`: User (*/5)           `Type: String`
- `Field 2`: Location             `Type: String`
- `Field 3`: Reason               `Type: String`

Recommendation Schema:
```javascript
{
   user: {
        type: String,
        required: true
    },
    location: String,
    reason: {
        type: String,
        required: true
    } 
}
```

### 2. Add New Data

HTML form route: `/create`

POST endpoint route: `/api/create`

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create/pin',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        name: "Kung Fu Tea",
        onCampus: false,
        category: "food",
        tags: ["boba", "chill"],
        user: "Divya",
        image: "https://s3-media4.fl.yelpcdn.com/bphoto/R-39C7cpyh5nu7VK-pDdiQ/o.jpg",
        rating: 5
    } 
};

request(options, function (error, response, body) {
  if (error) throw new Error(error);

  console.log(body);
});
```

HTML form route: `/createReview`

POST endpoint route: `/api/create/pin/:name/review`
(:name is the exact string of a location)

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create/pin/:name/review',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        author: "Anna",
        rating: 5,
        comment: "Bubbliest bubbles"
    } 
};
```

HTML form route: `/createRecommendation`

POST endpoint route: `/api/create/pin/recommendation/:for/:of`
(ex. creating a reccomendation OF Starbucks FOR Dunkin Donuts)

Example Node.js POST request to endpoint: 
```javascript
var request = require("request");

var options = { 
    method: 'POST',
    url: 'http://localhost:3000/api/create/pin/recommendation/:for/:of',
    headers: { 
        'content-type': 'application/x-www-form-urlencoded' 
    },
    form: { 
        user: "Anna",
        reason: "Recommending Starbucks for Dunkin because they have great coffee"
    } 
};
```


### 3. View Data

* GET endpoint route: `/api/getTerraPins`
* GET endpoint routes: 
   - `/api/OnCampus`, *
   - `/api/OffCampus`, *
   - `/api/Ranking`, *
   - `/api/Tags/:subgroup`, *
   - `/api/Random` *
* POST endpoint routes:
   - `/api/create/pin`,
   - `/api/create/pin/:name/review`,
   - `/api/create/pin/recommendation/:for/:of` 
* DELETE endpoint routes:
   - `/api/delete/pin/:name`, (will delete pin of name :name, and from all reccomendations)
   - `/api/delete/pin/:name/lastreview` (will delete last recommendation added to that pin)


### 4. Navigation Pages

Navigation Filters
1. On Campus -> `  /OnCampus  ` *
2. Ranking -> `  /Ranking  ` *
3. Tags -> `  /Tags  ` *
4. Random -> `  /Random  ` *
5. Create -> `  /Create  ` *
6. About -> `  /About  ` *


### 5. NPM Packages
1. Moment.js
2. Mongoose-Simple-Random

### 6. Modules
1. Schema.js
2. sardify.js
