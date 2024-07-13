const morgan = require("morgan");
const logger = require("./logger");

const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, req, res, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return res.status(400).send({ error: "malformed id!" });
  } else if (error.name === "ValidationError") {
    return res.status(400).json({ error: error.message });
  }

  next(error);
};

morgan.token("body", (req) => JSON.stringify(req.body));
const format =
  ":method :url :status :res[content-length] - :response-time ms :body";

const requestLogger = morgan(format);

module.exports = { unknownEndpoint, errorHandler, requestLogger };
