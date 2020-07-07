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
                  Joined {{formatDate(user.joinDate)}}
                </div>
                <div class="hidden-xs-only font-weight-regular white--text">
                  {{user.favorites.length}} Favorites
                </div>
                <div class="hidden-xs-only font-weight-regular white--text">
                  {{userPosts.length}} Posts Added
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
            <span class="font-weight-regular">({{userFavorites.length}})</span>
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

    <!-- Posts created by User -->
    <v-container
      class="mt-3"
      v-if="!userPosts.length"
    >
      <v-row
        align="center"
        justify="center"
      >
        <v-col cols="6">
          <h2>
            You have no posts currently, Go and add some!
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
            Your Posts
            <span class="font-weight-regular">({{userPosts.length}})</span>
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
          v-for="post in userPosts"
          :key="post._id"
        >
          <v-card style="cursor:pointer">
            <v-img
              :src="post.imageUrl"
              @click.native="goToPost(post._id)"
              height="30vh"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            >
              <v-card-title v-text="post.title"></v-card-title>
            </v-img>
            <v-card-actions>
              <v-btn
                color="info"
                floating
                fab
                small
                dark
                class="m-2"
                @click="loadPost(post)"
              >
                <v-icon>edit</v-icon>
              </v-btn>
              <v-btn
                color="error"
                floating
                fab
                small
                dark
                @click="handleDeleteUserPost(post)"
                class="m-2"
              >
                <v-icon>delete</v-icon>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>

    <!-- Edit Post dialog -->
    <v-dialog
      v-model="editPostDialog"
      persistent
      max-width="600px"
    >
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-form
            @submit.prevent="handleupdateUserPost"
            lazy-validation
            v-model="isFormValid"
            ref="form"
          >
            <!-- Post title -->
            <v-text-field
              :rules="titleRules"
              id="title"
              label="Post Title"
              v-model="title"
              type="text"
            ></v-text-field>

            <!-- Image Url link -->
            <v-text-field
              :rules="imageRules"
              id="image"
              label="Image Url"
              v-model="imageUrl"
              type="text"
            ></v-text-field>

            <!-- Image Preview -->
            <v-row
              justify="space-around"
              v-if="imageUrl"
            >
              <v-col>
                <v-img
                  :src="imageUrl"
                  height="300"
                ></v-img>
              </v-col>
            </v-row>

            <!-- Categories Select -->
            <v-select
              v-model="categories"
              :rules="categoriesRules"
              :items="['Art', 'Education', 'Food', 'Furniture', 'Travel', 'Photography', 'Technology']"
              multiple
              label="Categories"
            ></v-select>

            <!-- Description Text Area -->
            <v-textarea
              :rules="descRules"
              v-model="description"
              label="Description"
              type="text"
              required
            ></v-textarea>
          </v-form>
        </v-card-text>
        <v-divider></v-divider>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="info"
            type="submit"
            text
            class="success--text"
            @click="handleupdateUserPost"
            :disabled="!isFormValid"
          >
            Update
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </template>
          </v-btn>
          <v-btn
            color="error"
            text
            class="error--text"
            @click="editPostDialog = false"
          >
            Cancel
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
import moment from "moment";
export default {
  name: "Profile",
  data() {
    return {
      editPostDialog: false,
      isFormValid: true,
      title: "",
      imageUrl: "",
      categories: [],
      description: "",
      titleRules: [
        title => !!title || "Title is required",
        title => title.length < 20 || "Title must have less than 20 characters"
      ],
      imageRules: [image => !!image || "Image is required"],
      categoriesRules: [
        categories =>
          categories.length >= 1 || "At least one category is required"
      ],
      descRules: [
        desc => !!desc || "Description is required",
        desc =>
          desc.length < 200 || "Description must have less than 200 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "userFavorites", "userPosts", "loading"])
  },
  methods: {
    formatDate(time) {
      return moment(new Date(+time)).format("lll");
    },
    goToPost(postId) {
      this.$router.push(`/posts/${postId}`);
    },
    handleGetUserPosts() {
      this.$store.dispatch("getUserPosts", {
        userId: this.user._id
      });
    },
    loadPost(post, editPostDialog = true) {
      this.postId = post._id;
      this.title = post.title;
      this.imageUrl = post.imageUrl;
      this.categories = post.categories;
      this.description = post.description;
      this.editPostDialog = editPostDialog;
    },
    handleupdateUserPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("updateUserPost", {
          postId: this.postId,
          userId: this.user._id,
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description
        });
        this.editPostDialog = false;
      }
    },
    handleDeleteUserPost(post) {
      this.loadPost(post, false);
      const deletePost = window.confirm(
        "Are you sure you want to delete this post?"
      );
      if (deletePost) {
        this.$store.dispatch("deleteUserPost", {
          postId: this.postId
        });
      }
    }
  },
  created() {
    this.handleGetUserPosts();
  }
};
</script>
