const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/");

require("./intializers/DBInitializer");

app.use(cors());
app.use(bodyParser.json());

// log only 4xx and 5xx responses to console
app.use(
  morgan("dev", {
    skip: function (req, res) {
      return res.statusCode < 400;
    },
  })
);

// Routes
app.use("/api/v1", routes);

// Error Handlers
app.use((err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    error: {
      status: err.status,
      message: err.message,
    },
  });
});

// Run Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
