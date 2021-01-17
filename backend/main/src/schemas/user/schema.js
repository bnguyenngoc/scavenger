const { composeMongoose } = require("graphql-compose-mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./model");
const Team = require("../team/model");
const { env } = require("../../utils");

const customizationOptions = {};
const UserTC = composeMongoose(User, customizationOptions);

// function to encrypt user password using bcrypt
function encryptPassword(resolvers) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      rp.beforeRecordMutate = async function (doc, rp) {
        // if updating, we need to modity the args and not the doc
        // the doc will be the data from the db
        if (rp.info.fieldName === "userUpdateById") {
          if (rp.context.req.userId != doc._id && rp.context.req.role !== "admin") {
            throw new Error("You cannot update another user");
          }
          let password = rp.args.record.password;
          if (password) {
            rp.args.record.password = bcrypt.hashSync(password, 8);
          }
          if (rp.args.record.role && rp.context.req.role && rp.context.req.role !== "admin") {
            delete rp.args.record["role"];
          }
        }
        // we are creating a doc and therefore doc is the user input data
        else {
          doc.password = bcrypt.hashSync(doc.password, 8);
        }
        return doc;
      };

      return next(rp);
    });
  });
  return resolvers;
}

UserTC.removeField("role");

// Add Token as a field on the Type Composer level, since we don't want to
// save it in the db, only query it on the GraphQL api level
UserTC.addFields({
  token: {
    type: "String",
    description: "Token of authenticated user.",
  },
});

UserTC.addResolver({
  kind: "query",
  name: "login",
  args: {
    email: "String!",
    password: "String!",
  },
  type: UserTC,
  resolve: async ({ args, context }) => {
    let user = await User.findOne({ email: args.email });
    if (!user) {
      throw new Error("User does not exists"); // for testing purposes
    }
    const isEqual = bcrypt.compareSync(args.password, user.password);
    if (!isEqual) {
      throw new Error("Password is not correct"); // again, for testing purposes
    }
    const team = await Team.findOne({ members: user._id });
    const token = jwt.sign({ userId: user._id, role: user.role, team: team ? team._id : "" }, env.JWT_SECRET, {
      expiresIn: "24h",
    });
    user.token = token;
    return user;
  },
});

const userQuery = {
  userById: UserTC.mongooseResolvers.findById(),
  userByIds: UserTC.mongooseResolvers.findByIds(),
  userOne: UserTC.mongooseResolvers.findOne(),
  userMany: UserTC.mongooseResolvers.findMany(),
  userDataLoader: UserTC.mongooseResolvers.dataLoader(),
  userDataLoaderMany: UserTC.mongooseResolvers.dataLoaderMany(),
  userCount: UserTC.mongooseResolvers.count(),
  userConnection: UserTC.mongooseResolvers.connection(),
  userPagination: UserTC.mongooseResolvers.pagination(),
  login: UserTC.getResolver("login"),
};

//TODO Cascade user deletion on all other documents
const userMutation = {
  ...encryptPassword({
    userCreateOne: UserTC.mongooseResolvers.createOne(),
    userUpdateById: UserTC.mongooseResolvers.updateById(),
  }),
  userRemoveById: UserTC.mongooseResolvers.removeById(),
  userRemoveOne: UserTC.mongooseResolvers.removeOne(),
  userRemoveMany: UserTC.mongooseResolvers.removeMany(),
};

module.exports = {
  userQuery,
  userMutation,
  UserTC,
};
