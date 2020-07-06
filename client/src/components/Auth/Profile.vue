<template>
  <v-container>
    <!-- User Details Card -->
    <v-row
      align="center"
      justify="center"
    >
      <v-col sm="6">
        <v-card
          class="white--text"
          color="#2e3a4578"
        >
          <v-row>
            <v-col
              cols="3"
              class="ml-2"
            >
              <v-avatar
                class="ma-3"
                size="125"
                tile
              >
                <v-img :src="user.avatar"></v-img>
              </v-avatar>

            </v-col>
            <v-col cols="7">
              <v-card-title class="headline">{{user.username}}</v-card-title>

              <v-card-subtitle>
                <div class="font-weight-regular white--text">
                  Joined {{new Date(Number(user.joinDate))}}
                </div>
                <div class="hidden-xs-only font-weight-regular white--text">
                  {{user.favorites.length}} Favorites
                </div>
                <div class="hidden-xs-only font-weight-regular white--text">
                  2 Posts Added
                </div>
              </v-card-subtitle>
            </v-col>
          </v-row>
        </v-card>
      </v-col>
    </v-row>

    <!-- Post Favorited by User -->
    <v-container
      class="mt-3"
      v-if="!userFavorites.length"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="6">
          <h2>
            You have no favorites currently, Go and add some!
          </h2>
        </v-col>
      </v-row>
    </v-container>
    <v-container
      v-else
      class="mt-3"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="12">
          <h2 class="font-weight-light">
            Favorited
            <span class="font-weight-regular">{{userFavorites.length}}</span>
          </h2>
        </v-col>
      </v-row>
      <v-row
        align="center"
        justify="center"
      >
        <v-col
          cols="12"
          sm="6"
          v-for="favorite in userFavorites"
          :key="favorite._id"
        >
          <v-card style="cursor:pointer">
            <v-img
              :src="favorite.imageUrl"
              @click.native="goToPost(favorite._id)"
              height="300"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            >
              <v-card-title v-text="favorite.title"></v-card-title>
            </v-img>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "Profile",
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    }
  }
};
</script>
