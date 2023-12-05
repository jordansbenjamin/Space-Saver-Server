// Make the .env data ready for use.
const dotenv = require("dotenv");
dotenv.config();

// Import the Express package and configure some needed data.
const express = require("express");
const app = express();
// If no process.env.X is found, assign a default value instead.
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 3000;

// Configure some basic Helmet settings on the server instance.
const helmet = require("helmet");
app.use(helmet());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: ["'self'"],
        },
    })
);

// configure CORS settings
const cors = require("cors");
var corsOptions = {
    origin: "*",
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// API-friendly request data formatting.
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const mongoose = require("mongoose");
// set connection URL
var databaseURL = "";
switch (process.env.NODE_ENV.toLowerCase()) {
    case "test":
        databaseURL = "mongodb://localhost:27017/SpaceSaver-dev";
        break;
    case "development":
        databaseURL = "mongodb://localhost:27017/SpaceSaver-dev";
        break;
    case "production":
        databaseURL = process.env.DATABASE_URL;
        break;
    default:
        console.error("Incorrect JS environment specified, database will not be connected.");
        break;
}

const { databaseConnector } = require("./database");
databaseConnector(databaseURL)
    .then(() => {
        console.log(`Database connected successfully! \n Host: ${HOST} \n Port: ${PORT}`);
    })
    .catch((error) => {
        console.log(`
    ERROR occurred connecting to the database! It was:\n
    ${JSON.stringify(error)}
    `);
    });


// test route
app.get("/", (request, response) => {
    response.json({
        message: "Hello world!",
    });
});

// handle all other routes --> leave at bottom of page
app.get("*", (request, response) => {
    response.status(404).json({
        message: "No route with that path found!",
        attemptedPath: request.path,
    });
});

module.exports = {
    HOST,
    PORT,
    app,
};