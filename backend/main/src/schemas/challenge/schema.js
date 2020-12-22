const { composeMongoose } = require("graphql-compose-mongoose");
const Challenge = require("./model");

const customizationOptions = {}; // to be added in case of more options
const ChallengeTC = composeMongoose(Challenge, customizationOptions);

function updateDate(resolvers) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      // extend resolve params with hook
      rp.beforeRecordMutate = async function (doc, rp) {
        doc.updatedAt = new Date();
        return doc;
      };

      return next(rp);
    });
  });
  return resolvers;
}

const challengeQuery = {
  challengeById: ChallengeTC.mongooseResolvers.findById(),
  challengeByIds: ChallengeTC.mongooseResolvers.findByIds(),
  challengeOne: ChallengeTC.mongooseResolvers.findOne(),
  challengeMany: ChallengeTC.mongooseResolvers.findMany(),
  challengeMany: ChallengeTC.mongooseResolvers.findMany(),
  challengeDataLoader: ChallengeTC.mongooseResolvers.dataLoader(),
  challengeDataLoaderMany: ChallengeTC.mongooseResolvers.dataLoaderMany(),
  //   challengeByIdLean: ChallengeTC.mongooseResolvers.findByIDLean(),
  //   challengeByIdsLean: ChallengeTC.mongooseResolvers.findByIdsLean(),
  //   challengeOneLean: ChallengeTC.mongooseResolvers.findOneLean(),
  //   challengeManyLean: ChallengeTC.mongooseResolvers.findManyLean(),
  //   challengeDataLoaderLean: ChallengeTC.mongooseResolvers.dataLoaderLean(),
  //   challengeDataLoaderManyLean: ChallengeTC.mongooseResolvers.dataLoaderManyLean(),
  challengeCount: ChallengeTC.mongooseResolvers.count(),
  challengeConnection: ChallengeTC.mongooseResolvers.connection(),
  challengePagination: ChallengeTC.mongooseResolvers.pagination(),
};

const challengeMutation = {
  challengeCreateOne: ChallengeTC.mongooseResolvers.createOne(),
  challengeCreateMany: ChallengeTC.mongooseResolvers.createMany(),
  ...updateDate({
    challengeUpdateById: ChallengeTC.mongooseResolvers.updateById(),
    challengeUpdateOne: ChallengeTC.mongooseResolvers.updateOne(),
    challengeUpdateMany: ChallengeTC.mongooseResolvers.updateMany(),
  }),
  challengeRemoveById: ChallengeTC.mongooseResolvers.removeById(),
  challengeRemoveOne: ChallengeTC.mongooseResolvers.removeOne(),
  challengeRemoveMany: ChallengeTC.mongooseResolvers.removeMany(),
};

module.exports = {
  challengeQuery,
  challengeMutation,
};
