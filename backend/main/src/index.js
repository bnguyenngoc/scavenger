const schema = require("./schemas");
const GraphqlServer = require("./server/graphql-server");
const AppServer = require("./server/express-server");
const { env } = require("./utils");

const appServer = new AppServer(env.GRAPHQL_PORT);
const graphqlServer = new GraphqlServer(appServer, schema);

// Start GraphqlServer
// testing reload
graphqlServer.listen();
