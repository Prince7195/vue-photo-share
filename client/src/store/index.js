import Vue from "vue";
import Vuex from "vuex";
import { gql } from "apollo-boost";

import { defaultClient as apolloClient } from "../main";

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
    getPosts: ({ commit }) => {
      commit("setLoading", true);
      // use ApolloClient to fire getPosts query
      apolloClient
        .query({
          query: gql`
            query {
              getPosts {
                _id
                title
                imageUrl
              }
            }
          `,
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
  },
  getters: {
    posts: (state) => state.posts,
    loading: (state) => state.loading,
  },
});
