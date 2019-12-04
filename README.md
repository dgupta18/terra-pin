
# TerraPin

---

Name: Divya Gupta, Tiffany Tran, Anna Mazzanti

Date: Nov 2, 2019

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

1. GET endpoint route: `/api/getTerraPins`
2. GET endpoint routes: 
`/api/OnCampus`, *
`/api/OffCampus`, *
`/api/Categories`, *
`/api/Categories/:subgroup`, *
`/api/Ranking`, *
`/api/Tags/`, *
`/api/Tags/:subgroup`, *
`/api/Users`, *
`/api/Random` *
3. POST endpoint routes:
`/api/create`, *
`/api/???`
4. DELETE endpoint routes:
`/api/???`,
`/api/???`

### 4. Search Data

Search Field: `name of TerraPin`
GET search api: `/search/:query` *

### 5. Navigation Pages

Navigation Filters
1. Categories -> `  /Categories  ` *
2. Ranking -> `  /Ranking  ` *
3. Tags -> `  /Tags  ` *
4. Random -> `  /Random  ` *
5. Create -> `  /Create  ` *
6. About -> `  /About  ` *