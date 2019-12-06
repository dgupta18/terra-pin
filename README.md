
# TerraPin

---

Name: Divya Gupta, Tiffany Tran, Anna Mazzanti

Date: Dec 6, 2019

Project Topic: Website where users can upload and browse TerraPins (hotspots) on and around UMD's campus. Each pin is categorized, and users can browse through categories or look at random new pins!

URL: https://terra-pin.herokuapp.com/

---


### 1. Data Format and Storage

Data point fields:
- `Field 1`: Name                `Type: String`
- `Field 2`: On or off campus    `Type: Boolean`
- `Field 3`: Category            `Type: String`
- `Field 4`: Tags                `Type: [String]`
- `Field 5`: User                `Type: String`
- `Field 6`: Link to image       `Type: String`
- `Field 7`: Rating (*/5)        `Type: Integer`

Schema: 
```javascript
{
  name: String,
  onCampus: Boolean,
  category: String,
  tags: [String],
  user: String,
  image: String,
  rating: Number,
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
    url: 'http://localhost:3000/api/create',
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
   - `/api/create/pin/:name/recommendation` 
* DELETE endpoint routes:
   - `/api/delete/pin/:name`,
   - `/api/delete/pin/:name/latestreview` (will delete last recommendation added to that pin)


### 4. Navigation Pages

Navigation Filters
1. On Campus -> `  /OnCampus  ` *
2. Ranking -> `  /Ranking  ` *
3. Tags -> `  /Tags  ` *
4. Random -> `  /Random  ` *
5. Create -> `  /Create  ` *
6. About -> `  /About  ` *


### 5. Modules
1. Moment.js
2. GraphicsMagick
