const { composeMongoose } = require("graphql-compose-mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { User } = require("./model");
const { env } = require("../../utils");

const customizationOptions = {};
const UserTC = composeMongoose(User, customizationOptions);

// function to encrypt user password using bcrypt
// NOT WORKING FOR UPDATEBYID FOR SOME REASON!!
function encryptPassword(resolvers) {
  Object.keys(resolvers).forEach((k) => {
    resolvers[k] = resolvers[k].wrapResolve((next) => async (rp) => {
      rp.beforeRecordMutate = async function (doc, rp) {
        if (doc.password) {
          doc.password = bcrypt.hashSync(doc.password, 8);
        }
        return doc;
      };

      return next(rp);
    });
  });
  return resolvers;
}
// Add Token as a field on the Type Composer level, since we don't want to
// save it in the db, only query it on the GraphQL api level
UserTC.addFields({
  token: {
    type: "String",
    description: "Token of authenticated user.",
  },
});

UserTC.addResolver({
  kind: "mutation",
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
    const token = jwt.sign({ userId: user._id }, env.JWT_SECRET, {
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
  userMany: UserTC.mongooseResolvers.findMany(),
  userDataLoader: UserTC.mongooseResolvers.dataLoader(),
  userDataLoaderMany: UserTC.mongooseResolvers.dataLoaderMany(),
  userCount: UserTC.mongooseResolvers.count(),
  userConnection: UserTC.mongooseResolvers.connection(),
  userPagination: UserTC.mongooseResolvers.pagination(),
};

const userMutation = {
  login: UserTC.getResolver("login"),
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
