const { composeMongoose } = require("graphql-compose-mongoose");
const TeamChallenge = require("./model");
const { TeamTC } = require("../team/schema");
const { ChallengeTC } = require("../challenge/schema");
const { authOnly, judgeOrAdminOnly } = require("../../middleware/wrapper");

const customizationOptions = {};
const TeamChallengeTC = composeMongoose(TeamChallenge, customizationOptions);

// Check if user is member of team when updating or judge or admin
function isMember(resolvers) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      rp.beforeRecordMutate = async function (doc, rp) {
        if (rp.context.req.team !== doc._id && rp.context.req.role !== "judge" && rp.context.req.role !== "admin") {
          throw new Error("You are not authorized to update this challenge");
        }
        if (rp.args.record.score && rp.context.req.role !== "judge" && rp.context.req.role !== "admin") {
          delete rp.args.record["score"];
        }
        return doc;
      };

      return next(rp);
    });
  });
  return resolvers;
}

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
  ...authOnly({
    teamChallengeCreateOne: TeamChallengeTC.mongooseResolvers.createOne(),
    teamChallengeCreateMany: TeamChallengeTC.mongooseResolvers.createMany(),
  }),
  ...isMember({
    teamChallengeUpdateById: TeamChallengeTC.mongooseResolvers.updateById(),
  }),
  ...judgeOrAdminOnly({
    teamChallengeRemoveById: TeamChallengeTC.mongooseResolvers.removeById(),
    teamChallengeRemoveOne: TeamChallengeTC.mongooseResolvers.removeOne(),
    teamChallengeRemoveMany: TeamChallengeTC.mongooseResolvers.removeMany(),
  }),
};

module.exports = {
  teamChallengeQuery,
  teamChallengeMutation,
  TeamChallengeTC,
};
