import Vue from "vue";
import Vuex from "vuex";

import router from "../router";

import { defaultClient as apolloClient } from "../main";
import {
  GET_POSTS,
  SIGNIN_USER,
  GET_CURRENT_USER,
  SIGNUP_USER,
  ADD_POST,
  SEARCH_POSTS,
  GET_USER_POSTS,
  UPDATE_USER_POST,
  DELETE_USER_POST,
  INFINITE_SCROLL_POSTS,
} from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    userPosts: [],
    searchResults: [],
    loading: false,
    user: null,
    error: null,
    authError: null,
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
    },
    setUser: (state, payload) => {
      state.user = payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
    setError: (state, payload) => {
      state.error = payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setAuthError: (state, payload) => {
      state.authError = payload;
    },
    setSearchResults: (state, payload) => {
      if (payload !== null) {
        state.searchResults = payload;
      }
    },
    setUserPosts: (state, payload) => {
      if (payload !== null) {
        state.userPosts = payload;
      }
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
    },
  },
  actions: {
    getCurrentUser: ({ commit }) => {
      commit("setLoading", true);
      apolloClient
        .query({
          query: GET_CURRENT_USER,
        })
        .then(({ data, loading }) => {
          if (!loading) {
            commit("setLoading", false);
            commit("setUser", data.getCurrentUser);
          }
        })
        .catch((err) => {
          console.error(err);
          router.push("/signin");
          commit("setLoading", false);
        });
    },
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: GET_POSTS,
        })
        .then(({ data, loading }) => {
          // Get data from the actions to state via mutations
          if (!loading) {
            commit("setPosts", data.getPosts);
            commit("setLoading", false);
          }
        })
        .catch((err) => {
          console.error(err);
          commit("setLoading", false);
        });
    },
    signinUser: ({ commit }, payload) => {
      commit("setLoading", true);
      // clear Error
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data, loading }) => {
          if (!loading) {
            commit("setLoading", false);
            sessionStorage.setItem("token", data.signinUser.token);
            // to make sure created method is run in main.js (we run getCurrentUser), reload page
            router.go();
          }
        })
        .catch((err) => {
          commit("setError", err);
          console.error(err);
          commit("setLoading", false);
        });
    },
    signupUser: ({ commit }, payload) => {
      commit("setLoading", true);
      // clear Error
      commit("clearError");
      apolloClient
        .mutate({
          mutation: SIGNUP_USER,
          variables: payload,
        })
        .then(({ data, loading }) => {
          if (!loading) {
            commit("setLoading", false);
            sessionStorage.setItem("token", data.signupUser.token);
            // to make sure created method is run in main.js (we run getCurrentUser), reload page
            router.go();
          }
        })
        .catch((err) => {
          commit("setError", err);
          console.error(err);
          commit("setLoading", false);
        });
    },
    signoutUser: async ({ commit }) => {
      // clear user state
      commit("clearUser");
      // remove token from sessionStorage
      sessionStorage.setItem("token", "");
      // end session
      await apolloClient.resetStore();
      // redirect to home - kicks user out of private pages(Ex,. Profile)
      router.push("/");
    },
    addPost: ({ state, commit }, payload) => {
      commit("setLoading", true);
      apolloClient
        .mutate({
          mutation: ADD_POST,
          variables: payload,
          update: (cache, { data: { addPost } }) => {
            // first read the query you want to update
            const data = cache.readQuery({ query: GET_POSTS });
            // create updated data
            data.getPosts.unshift(addPost);
            // write updated data to the query
            cache.writeQuery({
              query: GET_POSTS,
              data,
            });
          },
          // optimistic response ensures data is added immediately as we specified for the updated function
          optimisticResponse: {
            __typename: "Mutation",
            addPost: {
              __typename: "Post",
              _id: -1,
              ...payload,
            },
          },
          // Rerun specific queries after performing the mutation in order to get fresh data
          refetchQueries: [
            {
              query: INFINITE_SCROLL_POSTS,
              variables: {
                pageNum: 1,
                pageSize: 2,
              },
            },
            {
              query: GET_USER_POSTS,
              variables: {
                userId: state.user._id,
              },
            },
          ],
        })
        .then(({ data, loading }) => {
          if (!loading) {
            commit("setLoading", false);
          }
        })
        .catch((err) => {
          console.error(err);
          commit("setLoading", false);
        });
    },
    searchPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: SEARCH_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setSearchResults", data.searchPosts);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    getUserPosts: ({ commit }, payload) => {
      apolloClient
        .query({
          query: GET_USER_POSTS,
          variables: payload,
        })
        .then(({ data }) => {
          commit("setUserPosts", data.getUserPosts);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    updateUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: UPDATE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            (post) => post._id === data.updateUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            data.updateUserPost,
            ...state.userPosts.slice(index + 1),
          ];
          commit("setUserPosts", userPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },
    deleteUserPost: ({ state, commit }, payload) => {
      apolloClient
        .mutate({
          mutation: DELETE_USER_POST,
          variables: payload,
        })
        .then(({ data }) => {
          const index = state.userPosts.findIndex(
            (post) => post._id === data.deleteUserPost._id
          );
          const userPosts = [
            ...state.userPosts.slice(0, index),
            ...state.userPosts.slice(index + 1),
          ];
          commit("setUserPosts", userPosts);
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  getters: {
    posts: (state) => state.posts,
    userPosts: (state) => state.userPosts,
    loading: (state) => state.loading,
    user: (state) => state.user,
    error: (state) => state.error,
    authError: (state) => state.authError,
    userFavorites: (state) => state.user && state.user.favorites,
    searchResults: (state) => state.searchResults,
  },
});
