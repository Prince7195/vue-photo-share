<template>
  <v-container v-if="infiniteScrollPosts">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
        md="6"
        v-for="post in infiniteScrollPosts.posts"
        :key="post._id"
      >
        <v-img
          :src="post.imageUrl"
          height="300"
        ></v-img>
      </v-col>
    </v-row>
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
        md="6"
        align="center"
        justify="center"
      >
        <v-btn
          @click="showMorePosts"
          v-if="showMoreEnabled"
        >Fetch more</v-btn>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { INFINITE_SCROLL_POSTS } from "../../store/queries";
const pageSize = 2;
export default {
  name: "Posts",
  data() {
    return {
      pageNum: 1,
      showMoreEnabled: true
    };
  },
  apollo: {
    infiniteScrollPosts: {
      query: INFINITE_SCROLL_POSTS,
      variables: {
        pageNum: 1,
        pageSize
      }
    }
  },
  methods: {
    showMorePosts() {
      // fetch more data and transform original result
      this.pageNum += 1;

      this.$apollo.queries.infiniteScrollPosts.fetchMore({
        variables: {
          pageNum: this.pageNum,
          pageSize
        },
        updateQuery: (previousResult, { fetchMoreResult }) => {
          const newPosts = fetchMoreResult.infiniteScrollPosts.posts;
          const hasMore = fetchMoreResult.infiniteScrollPosts.hasMore;
          this.showMoreEnabled = hasMore;

          return {
            infiniteScrollPosts: {
              __typename: fetchMoreResult.infiniteScrollPosts.__typename,
              // merge previous posts with new posts
              posts: [...previousResult.infiniteScrollPosts.posts, ...newPosts],
              hasMore
            }
          };
        }
      });
    }
  }
};
</script>
