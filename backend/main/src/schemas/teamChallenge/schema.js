const { composeMongoose } = require("graphql-compose-mongoose");
const TeamChallenge = require("./model");
const { TeamTC } = require("../team/schema");
const { ChallengeTC } = require("../challenge/schema");

const customizationOptions = {};
const TeamChallengeTC = composeMongoose(TeamChallenge, customizationOptions);

TeamChallengeTC.addRelation("team", {
  resolver: () => TeamTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.team,
    skip: null,
    sort: null,
  },
  projection: { team: 1 },
});
TeamChallengeTC.addRelation("challenge", {
  resolver: () => ChallengeTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.challenge,
    skip: null,
    sort: null,
  },
  projection: { challenge: 1 },
});

const teamChallengeQuery = {
  teamChallengeById: TeamChallengeTC.mongooseResolvers.findById(),
  teamChallengeByIds: TeamChallengeTC.mongooseResolvers.findByIds(),
  teamChallengeOne: TeamChallengeTC.mongooseResolvers.findOne(),
  teamChallengeMany: TeamChallengeTC.mongooseResolvers.findMany(),
  teamChallengeDataLoader: TeamChallengeTC.mongooseResolvers.dataLoader(),
  teamChallengeDataLoaderMany: TeamChallengeTC.mongooseResolvers.dataLoaderMany(),
  teamChallengeCount: TeamChallengeTC.mongooseResolvers.count(),
  teamChallengePagination: TeamChallengeTC.mongooseResolvers.pagination(),
};

const teamChallengeMutation = {
  teamCreateOne: TeamChallengeTC.mongooseResolvers.createOne(),
  teamCreateMany: TeamChallengeTC.mongooseResolvers.createMany(),
  teamUpdateById: TeamChallengeTC.mongooseResolvers.updateById(),
  teamUpdateOne: TeamChallengeTC.mongooseResolvers.updateOne(),
  teamUpdateMany: TeamChallengeTC.mongooseResolvers.updateMany(),
  teamRemoveById: TeamChallengeTC.mongooseResolvers.removeById(),
  teamRemoveOne: TeamChallengeTC.mongooseResolvers.removeOne(),
  teamRemoveMany: TeamChallengeTC.mongooseResolvers.removeMany(),
};

module.exports = {
  teamChallengeQuery,
  teamChallengeMutation,
  TeamChallengeTC,
};
