<template>
  <v-container class="mt-5">
    <h1>Home</h1>
    <ul>
      <li
        v-for="post in getPosts"
        :key="post._id"
      >
        {{post.title}} - {{post.description}}
      </li>
    </ul>
  </v-container>
</template>

<script>
import { gql } from "apollo-boost";
export default {
  name: "Home",
  apollo: {
    getPosts: {
      query: gql`
        query {
          getPosts {
            _id
            title
            imageUrl
            categories
            description
          }
        }
      `
    }
  }
};
</script>
