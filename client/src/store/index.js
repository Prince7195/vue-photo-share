import Vue from "vue";
import Vuex from "vuex";

import { defaultClient as apolloClient } from "../main";
import { GET_POSTS, SIGNIN_USER, GET_CURRENT_USER } from "./queries";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    posts: [],
    loading: false,
  },
  mutations: {
    setPosts: (state, payload) => {
      state.posts = payload;
    },
    setLoading: (state, payload) => {
      state.loading = payload;
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
            console.log(data.getCurrentUser);
          }
        })
        .catch((err) => {
          console.error(err);
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
      apolloClient
        .mutate({
          mutation: SIGNIN_USER,
          variables: payload,
        })
        .then(({ data, loading }) => {
          if (!loading) {
            localStorage.setItem("token", data.signinUser.token);
          }
        })
        .catch((err) => {
          console.error(err);
        });
    },
  },
  getters: {
    posts: (state) => state.posts,
    loading: (state) => state.loading,
  },
});
