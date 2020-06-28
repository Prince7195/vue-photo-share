const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

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

// Create Apollo/GraphQl Server uring typeDefs, resolvers, context objects
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    User,
    Post,
  },
});

server.listen().then(({ url }) => {
  console.log(`Server listening to ${url}`);
});
