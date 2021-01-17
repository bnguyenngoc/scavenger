const jwt = require("jsonwebtoken");
const { env } = require("../utils");

module.exports = {
  isAuth: function (req, res, next) {
    let token = req.headers["x-auth-token"] || req.headers["authorization"];
    if (!token || token === "") {
      req.isAuth = false;
      return next();
    }
    if (token.startsWith("Bearer ")) {
      token = token.slice(7, token.length);
    }
    // decode Token
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      req.isAuth = false;
      return next();
    }

    // Check if token is expired
    if (decodedToken.exp < new Date().getTime() / 1000) {
      throw new Error("Token is Expired");
    }
    req.isAuth = true;
    req.role = decodedToken.role;
    req.userId = decodedToken.userId;
    req.team = decodedToken.team;
    next();
  },
};
