const { makeExecutableSchema } = require("apollo-server");

const typeDefs = require("./typedefs");
const resolvers = require("./resolvers");

const schema = makeExecutableSchema({
  typeDefs,
  resolvers,
});

module.exports = schema;
