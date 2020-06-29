<template>
  <v-row
    align="center"
    justify="center"
  >
    <v-col class="shrink">
      <v-layout row>
        <v-dialog
          v-model="loading"
          persistent
          fullscreen
        >
          <v-container fill-height>
            <v-layout
              row
              justify-center
              align-center
            >
              <v-progress-circular
                indeterminate
                :size="70"
                :width="7"
                color="secondary"
              ></v-progress-circular>
            </v-layout>
          </v-container>
        </v-dialog>
      </v-layout>
      <v-flex xs12>
        <v-carousel
          cycle
          hide-delimiter-background
          show-arrows-on-hover
          interval="3000"
          v-if="!loading && posts.length > 0"
        >
          <v-carousel-item
            v-for="(post, i) in posts"
            :key="i"
            :src="post.imageUrl"
          >
            <h1 id="carousel__title">{{post.title}}</h1>
          </v-carousel-item>
        </v-carousel>
      </v-flex>
    </v-col>
  </v-row>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Home",
  computed: {
    ...mapGetters(["posts", "loading"])
  },
  methods: {
    handleGetCarouselPosts() {
      // reach out to vuex store, fire action that gets post for carousel
      this.$store.dispatch("getPosts");
    }
  },
  created() {
    this.handleGetCarouselPosts();
  }
};
</script>

<style scoped>
#carousel__title {
  position: absolute;
  background-color: rgba(0, 0, 0, 0.5);
  color: white;
  border-radius: 5px 5px 0 0;
  padding: 0.5rem;
  margin: 0 auto;
  bottom: 50px;
  left: 0;
  right: 0;
  text-align: center;
}
</style>
