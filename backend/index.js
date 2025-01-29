const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes/index");
require("dotenv").config();
const cors = require("cors");

const corsOptions = {
  origin: "http://localhost:3000", // Your frontend's URL
  methods: "GET,POST,PUT,DELETE", // Allowed HTTP methods
  credentials: true, // Allow cookies/auth headers if needed
};

const app = express();
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use("/api", routes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
