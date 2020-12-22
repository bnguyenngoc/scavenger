const { SchemaComposer } = require("graphql-compose");
const { challengeMutation, challengeQuery } = require("./challenge/schema");

const graphQLComposer = new SchemaComposer();
graphQLComposer.Query.addFields({ ...challengeQuery });
graphQLComposer.Mutation.addFields({
  ...challengeMutation,
});

const schema = graphQLComposer.buildSchema();

module.exports = schema;
