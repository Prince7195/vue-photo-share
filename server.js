const { ApolloServer } = require("apollo-server");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "typeDefs.gql");
const typeDefs = fs.readFileSync(filePath, "utf-8");

require("dotenv").config({ path: "./config.env" });
const User = require("./models/user");
const Post = require("./models/post");
const resolvers = require("./resolvers");

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
