const envalid = require("envalid");
const { str, port, num } = envalid;

const env = envalid.cleanEnv(process.env, {
  API_TIMEOUT: num({ default: 30000 }),
  API_SECRET: str({ default: "supersecretkey" }),
  GRAPHQL_PORT: port({ default: 8080 }),
  MONGODB_USER: str({ default: "root" }),
  MONGODB_PWD: str({ default: "dev" }),
  MONGODB_ADDR: str({ default: "http://mongodb:27017" }),
  MONGODB_DB: str({ default: "scavenger" }),
  JWT_SECRET: str({ default: "ThisIsALegitJWTSecret" }),
});

module.exports = env;
