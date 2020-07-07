const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createToken = (user, secret, expiresIn) => {
  const { username, email } = user;
  return jwt.sign({ username, email }, secret, { expiresIn });
};

module.exports = {
  Query: {
    getCurrentUser: async (_, args, { User, currentUser }) => {
      if (!currentUser) {
        return null;
      }
      const user = await User.findOne({
        username: currentUser.username,
      }).populate({
        path: "favorites",
        model: "Post",
      });
      return user;
    },
    getPosts: async (_, args, context) => {
      const { Post } = context;
      const posts = await Post.find({}).sort({ createdDate: "desc" }).populate({
        path: "createdBy",
        model: "User",
      });
      return posts;
    },
    getPost: async (_, { postId }, { Post }) => {
      const post = await Post.findOne({ _id: postId }).populate({
        path: "messages.messageUser",
        model: "User",
      });
      return post;
    },
    infiniteScrollPosts: async (_, { pageNum, pageSize }, { Post }) => {
      let posts;
      if (pageNum === 1) {
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User",
          })
          .limit(pageSize);
      } else {
        // if page number is not 1, calculate howmany documents to skip
        const skip = pageSize * (pageNum - 1);
        posts = await Post.find({})
          .sort({ createdDate: "desc" })
          .populate({
            path: "createdBy",
            model: "User",
          })
          .skip(skip)
          .limit(pageSize);
      }
      const totalCount = await Post.countDocuments();
      const hasMore = totalCount > pageSize * pageNum;
      return {
        posts,
        hasMore,
      };
    },
    searchPosts: async (_, { searchTerm }, { Post }) => {
      if (searchTerm) {
        const searchResult = await Post.find(
          // Performing text search
          { $text: { $search: searchTerm } },
          // Assign "searchTerm" a text to provide best match
          { score: { $meta: "textScore" } }
          // sort results according to textScore (as well as by likes in descending order)
        )
          .sort({ score: { $meta: "textScore" }, likes: "desc" })
          .limit(5);
        return searchResult;
      }
    },
    getUserPosts: async (_, { userId }, { Post }) => {
      const post = await Post.find({ createdBy: userId });
      return post;
    },
  },
  Mutation: {
    signupUser: async (_, { username, email, password }, context) => {
      const { User } = context;
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exist");
      } else {
        const newUser = await new User({
          username,
          email,
          password,
          favorites: [],
        }).save();
        return { token: createToken(newUser, process.env.SECRET, "1hr") };
      }
    },
    signinUser: async (_, { username, password }, context) => {
      const { User } = context;
      const user = await User.findOne({ username });
      if (!user) {
        throw new Error("User not found");
      }
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        throw new Error("Invalid Password");
      }
      return { token: createToken(user, process.env.SECRET, "1hr") };
    },
    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      context
    ) => {
      const { Post } = context;
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId,
      }).save();
      return newPost;
    },
    addPostMessage: async (_, { messageBody, userId, postId }, { Post }) => {
      const newMessage = {
        messageBody,
        messageUser: userId,
      };
      const post = await Post.findOneAndUpdate(
        // find the post by id
        { _id: postId },
        // prepend (push) new message to beginning of messages array
        { $push: { messages: { $each: [newMessage], $position: 0 } } },
        // return fresh document after update
        { new: true }
      ).populate({
        path: "messages.messageUser",
        model: "User",
      });
      return post.messages[0];
    },
    likePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post, add 1 to its 'like' value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: 1 } },
        { new: true }
      );
      // Find User, add id of post to its favorites array (which will be populated as Posts)
      const user = await User.findOneAndUpdate(
        { username },
        { $addToSet: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post",
      });
      console.log(user.favorites);
      // Return only likes from 'post' and favorites from 'user'
      return { likes: post.likes, favorites: user.favorites };
    },
    unlikePost: async (_, { postId, username }, { Post, User }) => {
      // Find Post and add -1 to its like value
      const post = await Post.findOneAndUpdate(
        { _id: postId },
        { $inc: { likes: -1 } },
        { new: true }
      );
      // Find User, remove id of post to its favorites array (which will be populated as Posts)
      const user = await User.findOneAndUpdate(
        { username },
        { $pull: { favorites: postId } },
        { new: true }
      ).populate({
        path: "favorites",
        model: "Post",
      });
      // Return only likes from post and favorites from user
      return {
        likes: post.likes,
        favorites: user.favorites,
      };
    },
  },
};
