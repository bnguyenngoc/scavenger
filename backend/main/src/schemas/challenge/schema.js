const { composeMongoose } = require("graphql-compose-mongoose");
const Challenge = require("./model");
const { adminOnly } = require("../../middleware/wrapper");

const customizationOptions = {}; // to be added in case of more options
const ChallengeTC = composeMongoose(Challenge, customizationOptions);

const challengeQuery = {
  challengeById: ChallengeTC.mongooseResolvers.findById(),
  challengeByIds: ChallengeTC.mongooseResolvers.findByIds(),
  challengeOne: ChallengeTC.mongooseResolvers.findOne(),
  challengeMany: ChallengeTC.mongooseResolvers.findMany(),
  challengeCount: ChallengeTC.mongooseResolvers.count(),
  challengeConnection: ChallengeTC.mongooseResolvers.connection(),
  challengePagination: ChallengeTC.mongooseResolvers.pagination(),
};

const challengeMutation = {
  ...adminOnly({
    challengeCreateOne: ChallengeTC.mongooseResolvers.createOne(),
    challengeCreateMany: ChallengeTC.mongooseResolvers.createMany(),
    challengeUpdateById: ChallengeTC.mongooseResolvers.updateById(),
    challengeUpdateOne: ChallengeTC.mongooseResolvers.updateOne(),
    challengeUpdateMany: ChallengeTC.mongooseResolvers.updateMany(),
    challengeRemoveById: ChallengeTC.mongooseResolvers.removeById(),
    challengeRemoveOne: ChallengeTC.mongooseResolvers.removeOne(),
    challengeRemoveMany: ChallengeTC.mongooseResolvers.removeMany(),
  }),
};

module.exports = {
  challengeQuery,
  challengeMutation,
  ChallengeTC,
};
