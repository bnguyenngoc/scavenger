const { composeMongoose } = require("graphql-compose-mongoose");
const Team = require("./model");
const { UserTC } = require("../user/schema");

const customizationOptions = {};
const TeamTC = composeMongoose(Team, customizationOptions);

// Add relation between teams and users
/**
 * In case somebody reads this and is as dumb as me, projection here is used to
 * project the resolver back into the corresponding key. 1 = true. read more
 * about projections here:
 * https://docs.mongodb.com/manual/tutorial/project-fields-from-query-results/
 *
 */
TeamTC.addRelation("captain", {
  resolver: () => UserTC.mongooseResolvers.findById(),
  prepareArgs: {
    _id: (source) => source.captain,
    skip: null,
    sort: null,
  },
  projection: { captain: 1 },
});

TeamTC.addRelation("members", {
  resolver: () => UserTC.mongooseResolvers.dataLoaderMany(),
  prepareArgs: {
    _ids: (source) => source.members,
  },
  projection: { members: 1 },
});

const teamQuery = {
  teamById: TeamTC.mongooseResolvers.findById(),
  teamByIds: TeamTC.mongooseResolvers.findByIds(),
  teamOne: TeamTC.mongooseResolvers.findOne(),
  teamMany: TeamTC.mongooseResolvers.findMany(),
  teamDataLoader: TeamTC.mongooseResolvers.dataLoader(),
  teamDataLoaderMany: TeamTC.mongooseResolvers.dataLoaderMany(),
  teamCount: TeamTC.mongooseResolvers.count(),
  teamPagination: TeamTC.mongooseResolvers.pagination(),
};

const teamMutation = {
  teamCreateOne: TeamTC.mongooseResolvers.createOne(),
  teamCreateMany: TeamTC.mongooseResolvers.createMany(),
  teamUpdateById: TeamTC.mongooseResolvers.updateById(),
  teamUpdateOne: TeamTC.mongooseResolvers.updateOne(),
  teamUpdateMany: TeamTC.mongooseResolvers.updateMany(),
  teamRemoveById: TeamTC.mongooseResolvers.removeById(),
  teamRemoveOne: TeamTC.mongooseResolvers.removeOne(),
  teamRemoveMany: TeamTC.mongooseResolvers.removeMany(),
};

module.exports = {
  teamQuery,
  teamMutation,
  TeamTC,
};
