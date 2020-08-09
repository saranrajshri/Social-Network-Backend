const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/");
const {
  errorHandler,
  initUnhandledExceptions,
} = require("./middlewares/errorHandlers");

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
app.use(errorHandler);

// Unhandled Exceptions and rejections handler
initUnhandledExceptions();

// Run Server
const PORT = 8000;
app.listen(PORT, () => {
  console.log(`Server running at ${PORT}`);
});
