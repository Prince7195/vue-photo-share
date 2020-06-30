const { ApolloServer, AuthenticationError } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");

// Imported tepeDefs and resolvers
const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");
const resolvers = require("./resolvers");

// .env config
require("dotenv").config({ path: "./config.env" });

// MongoDB Models
const User = require("./models/user");
const Post = require("./models/post");

// connect to MLab DB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.info("MongoDB connected Successfully!");
  })
  .catch((err) => {
    console.error(err);
  });

// verify JWT token passed from client
const getUser = async (token) => {
  if (token) {
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (error) {
      throw new AuthenticationError(
        "Your session has ended. Please signin again."
      );
    }
  }
};

// Create Apollo/GraphQl Server uring typeDefs, resolvers, context objects
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers["authorization"];
    return {
      User,
      Post,
      currentUser: await getUser(token),
    };
  },
});

server.listen().then(({ url }) => {
  console.log(`Server listening to ${url}`);
});
