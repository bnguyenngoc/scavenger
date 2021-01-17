const { composeMongoose } = require("graphql-compose-mongoose");
const Team = require("./model");
const { UserTC } = require("../user/schema");
const { authOnly, adminOnly } = require("../../middleware/wrapper");

const customizationOptions = {};
const TeamTC = composeMongoose(Team, customizationOptions);

// Verify only captains of a team or admins can update or delete a team
function isCaptain(resolvers) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      rp.beforeRecordMutate = async function (doc, rp) {
        if (doc.captain !== rp.context.req.userId && rp.context.req.role !== "admin") {
          throw new Error("Only captains or admins can modify this team");
        }
        return doc;
      };
      return next(rp);
    });
  });
  return resolvers;
}

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
  teamCount: TeamTC.mongooseResolvers.count(),
  teamPagination: TeamTC.mongooseResolvers.pagination(),
};

//TODO Create team application model so users can apply for a team and
// captain can accept or refuse an application
const teamMutation = {
  ...authOnly({
    teamCreateOne: TeamTC.mongooseResolvers.createOne(),
    teamCreateMany: TeamTC.mongooseResolvers.createMany(),
  }),
  ...isCaptain({
    teamUpdateById: TeamTC.mongooseResolvers.updateById(),
    teamUpdateOne: TeamTC.mongooseResolvers.updateOne(),
    teamRemoveById: TeamTC.mongooseResolvers.removeById(),
    teamRemoveOne: TeamTC.mongooseResolvers.removeOne(),
    teamRemoveMany: TeamTC.mongooseResolvers.removeMany(),
  }),
  ...adminOnly({
    teamUpdateMany: TeamTC.mongooseResolvers.updateMany(),
  }),
};

module.exports = {
  teamQuery,
  teamMutation,
  TeamTC,
};
