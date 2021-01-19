//web422:web422a1
/*********************************************************************************
Name: Luan Lima Campos 
Student ID: 119386191 
Date: 2021-01-18
Heroku Link: _______________________________________________________________
*********************************************************************************/

const express = require("express");
const bodyParser = require("body-parser");
const RestaurantDB = require("./modules/restaurantDB.js");
const db = new RestaurantDB(
  "mongodb+srv://web422:web422a1@cluster0.bn3vq.mongodb.net/sample_restaurants?retryWrites=true&w=majority"
);

const cors = require("cors");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

app.get("/api/restaurants", (req, res) => {
  //Get 3 parameters from the query and pass it to the getAllRestaurants Functions
  //Parameters example: /api/restaurants?page=1&perPage=5&borough=Bronx
  //page, perPage and borough
  db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.get("/api/allrestaurants", (req, res) => {
  db.getAllRestaurants2().then((data) => {
    res.json(data);
  })
  .catch((err) => {
    res.status(500).json({message: `Error: ${err}`})
})
});

app.get("/api/restaurants/:id", (req, res) => {
  db.getRestaurantById(req.params.id).then((data) => {
    res.json(data);
  })
  .catch((err) => {
      res.status(500).json({message: `Error: ${err}`})
  })
});

app.post("/api/restaurants", (req, res) => {
  db.addNewRestaurant(req.body)
    .then((data) => {
      //201 Resource Created
      res
        .status(201)
        .json({ message: "Restaurant" + data.name + "added successfully!" });
    })
    //Catching Internal Server Errors
    .catch((err) => {
      res.status(500).json({ message: err });
    });
});

app.put("/api/restaurants/:id", (req, res) => {
  db.updateRestaurantById(req.params.id)
    .then((data) => {
      //204 No Content Response
      res
        .status(204)
        .json({ message: "Restaurant" + data.name + "updated successfully!" });
    })
    .catch((err) => {
      //Catching Internal Server Errors
      res.status(500).json({ message: err });
    });
});

app.delete("/api/restaurants/:id", (req, res) => {
  db.deleteRestaurantById(req.params.id)
    .then(() => {
      res.status(204).json({ message: "Restaurant deleted successfully!" });
    })
    .catch((err) => {
      //Catching Internal Server Errors
      res.status(500).json({ message: `Error: ${err}` });
    });
});

db.initialize()
  .then(() => {
    app.listen(HTTP_PORT, () => {
      console.log(
        "Ready to handle requests on port " + "http://localhost:" + HTTP_PORT
      );
    });
  })
  .catch((err) => {
    console.log(err);
  });
