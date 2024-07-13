const morgan = require("morgan");
const logger = require("./logger");

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, request, response, next) => {
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformed id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  } else if (
    error.name === "MongoServerError" &&
    error.message.includes("E11000 duplicate key error")
  ) {
    return response
      .status(400)
      .json({ error: "expected `username` to be unique" });
  }

  next(error);
};

morgan.token("body", (req) => JSON.stringify(req.body));
const format =
  ":method :url :status :res[content-length] - :response-time ms :body";

const requestLogger = morgan(format);

module.exports = { unknownEndpoint, errorHandler, requestLogger };
