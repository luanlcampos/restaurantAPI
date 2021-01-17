const express = require("express");
const bodyParser = require('body-parser');

const cors = require('cors')
const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Add support for incoming JSON entities
app.use(bodyParser.json());
// Add support for CORS
app.use(cors());

// ROUTES
app.get("/", (req, res) => {
    res.json({message: "API Listening"});
});


app.listen(HTTP_PORT, () => {
    console.log("Ready to handle requests on port " + "http://localhost:"+ HTTP_PORT);
});
