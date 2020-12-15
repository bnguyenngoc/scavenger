const envalid = require("envalid");
const { str, port, num } = envalid;

const env = envalid.cleanEnv(process.env, {
  API_TIMEOUT: num({ default: 30000 }),
  API_SECRET: str({ default: "supersecretkey" }),
  GRAPHQL_PORT: port({ default: 8080 }),
});

module.exports = env;
