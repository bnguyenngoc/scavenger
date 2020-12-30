const jwt = require("jsonwebtoken");
const { env } = require("../utils");

module.exports = {
  isAuth: function (req, res, next) {
    const token = req.headers["x-auth-token"];
    if (!token || token === "") {
      req.isAuth = false;
      return next();
    }
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, env.JWT_SECRET);
    } catch (err) {
      req.isAuth = false;
      return next();
    }
    req.isAuth = true;
    req.appRoles = decodedToken.appRoles;
    req.userId = decodedToken.userId;
    next();
  },
};
