const mongoose = require("mongoose");
const { env } = require("../utils");

const opts = {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useFindAndModify: false,
  dbName: env.MONGODB_DB,
  user: env.MONGODB_USER,
  pass: env.MONGODB_PWD,
};
//set mongoose globally so we won't need to require it in our modules
mongoose.Promise = global.Promise;
mongoose
  .connect(`mongodb://${env.MONGODB_ADDR}`, opts)
  .then(() => console.log("Mongodb connected!"))
  .catch((err) => console.log(`Unable to connect to database. Error: ${err}`));

module.exports = mongoose;
