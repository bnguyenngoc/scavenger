const { SchemaComposer } = require("graphql-compose");
const { challengeMutation, challengeQuery } = require("./challenge/schema");
const { userMutation, userQuery } = require("./user/schema");
const { teamMutation, teamQuery } = require("./team/schema");
const { teamChallengeMutation, teamChallengeQuery } = require("./teamChallenge/schema");

const graphQLComposer = new SchemaComposer();
graphQLComposer.Query.addFields({
  ...challengeQuery,
  ...userQuery,
  ...teamQuery,
  ...teamChallengeQuery,
});
graphQLComposer.Mutation.addFields({
  ...challengeMutation,
  ...userMutation,
  ...teamMutation,
  ...teamChallengeMutation,
});

const schema = graphQLComposer.buildSchema();

module.exports = schema;
