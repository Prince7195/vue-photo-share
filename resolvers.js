module.exports = {
  Query: {
    getPosts: async (_, args, context) => {
      const { Post } = context;
      const posts = await Post.find({}).sort({ createdDate: "desc" }).populate({
        path: "createdBy",
        model: "User",
      });
      return posts;
    },
  },
  Mutation: {
    signupUser: async (_, { username, email, password }, context) => {
      const { User } = context;
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exist");
      } else {
        const newUser = await new User({ username, email, password }).save();
        return newUser;
      }
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
  },
};
