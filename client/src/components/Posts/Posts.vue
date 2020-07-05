<template>
  <v-container v-if="infiniteScrollPosts">
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="6"
        v-for="post in infiniteScrollPosts.posts"
        :key="post._id"
      >
        <v-card>
          <v-img
            :src="post.imageUrl"
            height="300"
            class="white--text align-end"
            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
          >
            <v-card-title v-text="post.title"></v-card-title>
          </v-img>

          <v-card-actions>
            <v-card-title primary>
              <div>
                <span class="grey--text">{{post.likes}} likes - {{post.messages.length}} comments</span>
              </div>
            </v-card-title>
            <v-spacer></v-spacer>
            <v-btn
              @click="showPostCreator = !showPostCreator"
              icon
            >
              <v-icon>{{`keyboard_arrow_${showPostCreator ? 'up' : 'down'}`}}</v-icon>
            </v-btn>
          </v-card-actions>

          <!-- Post Creator Tile -->
          <v-slide-y-transition>
            <v-list-item
              v-show="showPostCreator"
              class="grow"
            >
              <v-list-item-avatar color="grey darken-3">
                <v-img
                  class="elevation-6"
                  :src="post.createdBy.avatar"
                ></v-img>
              </v-list-item-avatar>

              <v-list-item-content>
                <v-list-item-title class="text--primary">{{post.createdBy.username}}</v-list-item-title>
                <v-list-item-sub-title class="font-weight-thin">Added {{post.createdDate}}</v-list-item-sub-title>
              </v-list-item-content>

              <v-row
                align="center"
                justify="end"
              >
                <v-icon color="grey lighten-1">info</v-icon>
              </v-row>
            </v-list-item>
          </v-slide-y-transition>
        </v-card>
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
      showMoreEnabled: true,
      showPostCreator: false
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
