const schema = require("./schemas");
const GraphqlServer = require("./server/graphql-server");
const AppServer = require("./server/express-server");
const { env } = require("./utils");

/**
 * Initialize mongodb connector. Mongoose buffers model function calls internally,
 * so we don't need to wait for mongoose to establish a connection to MongoDB
 */
require("./connectors/mongodb-connector");

const appServer = new AppServer(env.GRAPHQL_PORT, "/api");
const graphqlServer = new GraphqlServer(appServer, schema);

// Start GraphqlServer
graphqlServer.listen();
