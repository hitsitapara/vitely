const express = require("express");
const bodyParser = require("body-parser");
const routes = require("./src/routes/index");
require("dotenv").config();
const cors = require('cors')

const corsOptions = {
    origin: 'http://localhost:3001',
    optionsSuccessStatus: 200,
  };

const app = express();
app.use(cors(corsOptions))
app.use(bodyParser.json());
app.use("/api", routes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
