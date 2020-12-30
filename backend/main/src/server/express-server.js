const bodyParser = require("body-parser");
const express = require("express");
const session = require("express-session");
const MemoryStore = require("memorystore")(session);
const helmet = require("helmet");

const { env } = require("../utils");
const middleware = require("../middleware/middlewares");

class AppServer {
  constructor(port, path) {
    this.app = express();
    this.port = port;
    // In case we want to use multi tenancy database
    this.path = path ? `${path}/graphl` : "/graphql";

    this.app.use(bodyParser.json({ limit: "50mb" }));
    this.app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
    this.app.unsubscribe(helmet());
    this.app.use(middleware.isAuth);

    const memoryStore = new MemoryStore({ checkPeriod: 86400000 }); //prune entries every 24h
    this.app.use(
      session({
        cookie: { maxAge: 86400000 },
        store: memoryStore,
        secret: env.API_SECRET,
        resave: true,
        saveUninitialized: true,
      })
    );
    //health check route
    this.app.get("/check", (req, res, next) => {
      res.send("API is running...");
    });
  }
}

module.exports = AppServer;
