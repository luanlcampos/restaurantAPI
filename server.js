//web422:web422a1
/*********************************************************************************
Name: Luan Lima Campos 
Student ID: 119386191 
Date: 2021-01-18
Heroku Link:  https://dry-lowlands-75857.herokuapp.com/
*********************************************************************************/

const express = require("express");
const bodyParser = require("body-parser");
//validate post/put requests data
const { body, validationResult, checkSchema } = require("express-validator");
const RestaurantDB = require("./modules/restaurantDB.js");
// Load the dotenv module and have it read your .env file
require('dotenv').config()
// Obtain the value of the MONGODB_CONN_STRING from the environment
const { MONGODB_CONN_STRING } = process.env
const db = new RestaurantDB(
  MONGODB_CONN_STRING
);

const cors = require("cors");
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

// ROUTES
//root route
app.get("/", (req, res) => {
  res.json({ message: "API Listening" });
});

//Get all restaurants
app.get("/api/restaurants", (req, res) => {
  //Get 3 parameters from the query and pass it to the getAllRestaurants Functions
  //Parameters example: /api/restaurants?page=1&perPage=5&borough=Bronx
  //page, perPage and borough
  const { page, perPage, borough } = req.query;
  if ( page > 0 && perPage > 3){
    db.getAllRestaurants(req.query.page, req.query.perPage, req.query.borough)
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
});

//Get restaurant by id
app.get("/api/restaurants/:id", (req, res) => {
  db.getRestaurantById(req.params.id)
    .then((data) => {
      if (!data) {
        res
          .status(400)
          .json({ message: "Error: ID Not Found! Please, Try Again." });
      }
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: `Error: ${err}` });
    });
});

//Add a new restaurant
app.post(
  "/api/restaurants",
  //Input Validation
  body("address.building")
    .isLength({ min: 1 })
    .withMessage("Wrong Building Data"),
  body("address.street")
    .isLength({ min: 1 })
    .withMessage("Wrong Street Address"),
  body("address.zipcode").isLength({ min: 1 }).withMessage("Wrong Postal Code"),
  body("borough").isLength({ min: 1 }).withMessage("Wrong Borough Data"),
  body("cuisine").isLength({ min: 1 }).withMessage("Wrong Cuisine Data"),
  body("grades.*.grade").isLength({ min: 1 }).withMessage("Wrong Grade Data"),
  body("grades.*.score").isInt().withMessage("Score should be an integer"),
  body("name").isLength({ min: 1 }).withMessage("Wrong Restaurant Name Data"),
  body("restaurant_id").isLength({ min: 1 }).withMessage("Wrong Restaurant ID"),
  (req, res) => {
    //store validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
    }
    db.addNewRestaurant(req.body)
      .then((data) => {
        //201 Resource Created
        res.status(201).json({
          message: "Restaurant " + data.name + " added successfully!",
        });
      })
      //Catching Internal Server Errors
      .catch((err) => {
        res.status(500).json({ message: err });
      });
  }
);

//Update a restaurant based on _id
app.put(
  "/api/restaurants/:id",
  //All input validation here is optional as the user can update just one field
  body("address.building")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Building Data"),
  body("address.street")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Street Address"),
  body("address.zipcode")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Postal Code"),
  body("borough")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Borough Data"),
  body("cuisine")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Cuisine Data"),
  body("grades.*.grade")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Grade Data"),
  body("grades.*.score")
    .optional()
    .isInt()
    .withMessage("Score should be an integer"),
  body("name")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Restaurant Name Data"),
  body("restaurant_id")
    .optional()
    .isLength({ min: 1 })
    .withMessage("Wrong Restaurant ID"),
  (req, res) => {
    //If users try to pass an empty object
    if (Object.keys(req.body).length === 0) {
      res
        .status(400)
        .json({ message: "You did not entered any data. Please, try again!" });
    }
    //store validation errors
    const errors = validationResult(req);
    //if users enter invalid data
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    db.updateRestaurantById(req.body, req.params.id)
      .then((data) => {
        res.status(201).json({ message: data });
      })
      .catch((err) => {
        //Catching Internal Server Errors
        res.status(500).json({ message: err });
      });
  }
);

//Delete a restaurant based on _id
app.delete("/api/restaurants/:id", (req, res) => {
  db.deleteRestaurantById(req.params.id)
    .then(() => {
      res.status(204).json({ message: "Restaurant deleted successfully!" });
    })
    .catch((err) => {
      //Catching Wrong ID errors
      res
        .status(404)
        .json({ message: "Error: ID Not Found! Please, Try Again." });
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
