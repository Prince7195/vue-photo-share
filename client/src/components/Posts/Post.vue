<template>
  <v-container v-if="getPost">
    <v-row
      align="center"
      justify="center"
    >
      <v-col cols="12">
        <v-card>
          <v-card-title>
            <h1>{{getPost.title}}</h1>
            <v-btn
              large
              icon
              v-if="user"
              @click="handleToggleLike"
            >
              <v-icon
                large
                :color="checkIfPostLiked(getPost._id) ? 'red' : 'grey'"
              >favorite</v-icon>
            </v-btn>
            <h4 class="ml-3 font-weight-thin">{{getPost.likes}} LIKES</h4>
            <v-spacer></v-spacer>
            <v-icon
              large
              color="info"
              @click="goToPreviousPage"
            >arrow_back</v-icon>
          </v-card-title>
          <v-tooltip right>
            <span>Click to enlarge image</span>
            <v-img
              :src="getPost.imageUrl"
              slot="activator"
              id="post__image"
              @click="toggleImageDialog"
              style="cursor:pointer"
              class="white--text align-end"
              gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
            ></v-img>
          </v-tooltip>

          <!-- Post image dialog -->
          <v-dialog v-model="dialog">
            <v-card>
              <v-img
                :src="getPost.imageUrl"
                class="white--text align-end"
                height="80vh"
                gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
              ></v-img>
            </v-card>
          </v-dialog>

          <v-card-text>
            <span
              v-for="(category, i) in getPost.categories"
              :key="i"
              class="ml-2"
            >
              <v-chip
                color="accent"
                text-color="white"
              >{{category}}</v-chip>
            </span>
            <h3 class="mt-2">{{getPost.description}}</h3>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
    <!-- Add Message Form -->
    <v-row
      align="center"
      justify="center"
      class="mt-3"
      v-if="user"
    >
      <v-col cols="12">
        <v-form
          v-model="isFormValid"
          lazy-validation
          ref="form"
          @submit.prevent="handleAddPostMessage"
        >
          <v-text-field
            :append-outer-icon="messageBody && 'send'"
            label="Add Message"
            :rules="messageRules"
            clearable
            v-model="messageBody"
            type="text"
            prepend-icon="email"
            @click:append-outer="handleAddPostMessage"
            required
          ></v-text-field>
        </v-form>
      </v-col>
    </v-row>
    <!-- Messages -->
    <v-row
      align="center"
      justify="center"
      class="mt-3"
    >
      <v-col cols="12">
        <v-list
          subheader
          two-line
        >
          <v-subheader>Messages ({{getPost.messages.length}})</v-subheader>

          <template v-for="message in getPost.messages">
            <v-divider :key="message._id"></v-divider>
            <v-list-item :key="message.title">
              <v-list-item-avatar>
                <v-img :src="message.messageUser.avatar"></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                {{message.messageBody}}
                <v-list-item-subtitle>
                  {{message.messageUser.username}}
                  <span class="grey--text text-lighten-1 hidden-xs-only">
                    {{getTimeFromNow(message.messageDate)}}
                  </span>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action class="hidden-xs-only">
                <v-icon :color="checkIfOwnMessage(message) ? 'accent' : 'grey'">chat_bubble</v-icon>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-list>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import moment from "moment";
import {
  GET_POST,
  ADD_POST_MESSAGE,
  UNLIKE_POST,
  LIKE_POST
} from "../../store/queries";
import { mapGetters } from "vuex";
export default {
  name: "Post",
  props: ["postId"],
  data() {
    return {
      dialog: false,
      postLiked: false,
      messageBody: "",
      isFormValid: true,
      messageRules: [
        message => !!message || "Message is required",
        message =>
          message.length < 75 || "Message must be less than 75 characters"
      ]
    };
  },
  apollo: {
    getPost: {
      query: GET_POST,
      variables() {
        return {
          postId: this.postId
        };
      }
    }
  },
  computed: {
    ...mapGetters(["user", "userFavorites"])
  },
  methods: {
    getTimeFromNow(time) {
      return moment(new Date(+time)).fromNow();
    },
    goToPreviousPage() {
      this.$router.go(-1);
    },
    toggleImageDialog() {
      if (window.innerWidth > 500) {
        this.dialog = !this.dialog;
      }
    },
    checkIfOwnMessage(message) {
      return this.user && this.user._id === message.messageUser._id;
    },
    handleAddPostMessage() {
      if (this.$refs.form.validate()) {
        const variables = {
          messageBody: this.messageBody,
          userId: this.user._id,
          postId: this.postId
        };
        this.$apollo
          .mutate({
            mutation: ADD_POST_MESSAGE,
            variables,
            update: (cache, { data: { addPostMessage } }) => {
              const data = cache.readQuery({
                query: GET_POST,
                variables: { postId: this.postId }
              });
              data.getPost.messages.unshift(addPostMessage);
              cache.writeQuery({
                query: GET_POST,
                variables: { postId: this.postId },
                data
              });
            }
          })
          .then(({ data }) => {
            this.$refs.form.reset();
            console.log(data.addPostMessage);
          })
          .catch(err => console.error(err));
      }
    },
    handleLikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: LIKE_POST,
          variables,
          update: (cache, { data: { likePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes += 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.likePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleUnlikePost() {
      const variables = {
        postId: this.postId,
        username: this.user.username
      };
      this.$apollo
        .mutate({
          mutation: UNLIKE_POST,
          variables,
          update: (cache, { data: { unlikePost } }) => {
            const data = cache.readQuery({
              query: GET_POST,
              variables: { postId: this.postId }
            });
            data.getPost.likes -= 1;
            cache.writeQuery({
              query: GET_POST,
              variables: { postId: this.postId },
              data
            });
          }
        })
        .then(({ data }) => {
          const updatedUser = {
            ...this.user,
            favorites: data.unlikePost.favorites
          };
          this.$store.commit("setUser", updatedUser);
        })
        .catch(err => console.error(err));
    },
    handleToggleLike() {
      if (this.postLiked) {
        this.handleUnlikePost();
      } else {
        this.handleLikePost();
      }
    },
    checkIfPostLiked(postId) {
      // check if user favorites includes post with id of postId
      if (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === postId)
      ) {
        this.postLiked = true;
        return true;
      } else {
        this.postLiked = false;
        return false;
      }
    }
  }
};
</script>

<style scoped>
#post__image {
  height: 400px !important;
}
</style>