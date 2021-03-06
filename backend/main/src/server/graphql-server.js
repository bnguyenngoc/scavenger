const { ApolloServer } = require("apollo-server-express");
// const { ApolloError } = require("apollo-server");
const { env } = require("../utils");

class GraphqlServer {
  constructor(appServer, schema) {
    this.app = appServer.app;
    this.path = appServer.path;
    this.port = appServer.port;

    this.server = new ApolloServer({
      schema: schema,
      playground: true,
      // inject express request in context
      context: ({ req }) => {
        return {
          req,
        };
      },
      formatError: (err) => {
        delete err.extensions.exception.stacktrace;
        const log = {
          message: err.message,
          detail: err.extensions.exception ? err.extensions.exception : null,
          path: err.path ? err.path[0] : null,
        };
        console.error(log);
        return log;
      },
    });

    this.server.applyMiddleware({ app: this.app, path: this.path });
  }
  listen() {
    const listener = this.app.listen({ port: this.port, path: this.path }, () => {
      console.log(`🥺 👉 GraphQL API ready at localhost:${this.port}${this.path} 👈 `);
    });

    listener.keepAliveTimeout = env.API_TIMEOUT;
    listener.headersTimeout = env.API_TIMEOUT;
    listener.on("connection", function (socket) {
      socket.setTimeout(env.API_TIMEOUT);
    });
  }
}

module.exports = GraphqlServer;
