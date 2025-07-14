// Import Packages
const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");

// For Vercel
const serverless = require("serverless-http"); 

// ENV Setup
dotenv.config({ path: ".env" });

// Create Express Name
var app = express();

// DB Connection
require("./db/connection");

// Import Route Main File
const mainroute = require("./routes/Index");

// Use The Packages
app.use(express.json());
app.use(cors());

// Import Routes
mainroute(app);

// PORT Set
const PORT = process.env.PORT || 8080;

// Create Server
app.get("/", (req, res) => {
  res.status(201).json(`Server Created`);
});

// PORT 8000
// app.listen(PORT, () => {
//   console.log(`Server On ${PORT}`);
// });

// Export for Vercel
module.exports = app;
module.exports.handler = serverless(app);