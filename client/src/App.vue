<template>
  <v-app
    style="background: #e3e3ee"
    app
  >
    <!-- Side Navbar -->
    <v-navigation-drawer
      v-model="sideNav"
      app
      temporary
      fixed
    >
      <v-app-bar
        flat
        dark
        color="primary"
        short
      >
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <router-link
          to="/"
          tag="span"
          style="cursor: pointer"
        >
          <h1 class="title pl-3">PhotoShare</h1>
        </router-link>
      </v-app-bar>

      <v-divider></v-divider>

      <!-- Side Navbar Links -->
      <v-list>
        <v-list-item
          v-for="item in sideNavItems"
          :key="item.title"
          :to="item.link"
          class="ml-5 pl-5"
        >
          <v-list-item-action>
            <v-icon>{{item.icon}}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            {{item.title}}
          </v-list-item-content>
        </v-list-item>

        <!-- Signout button -->
        <v-list-item
          class="ml-5 pl-5"
          v-if="user"
          @click="handleSignoutUser"
        >
          <v-list-item-action>
            <v-icon>exit_to_app</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            Signout
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>

    <!-- Horizontal  Navbar -->
    <v-app-bar
      app
      color="primary"
      dark
      fixed
      elevate-on-scroll
      absolute
      short
    >

      <!-- App Title -->
      <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
      <v-toolbar-title class="hidden-xs-only">
        <router-link
          to="/"
          tag="span"
          style="cursor: pointer"
        >PhotoShare</router-link>
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <!-- Search Input -->
      <v-text-field
        prepend-icon="search"
        placeholder="Search posts"
        color="accent"
        single-line
        hide-details
        v-model="searchTerm"
        @input="handleSearchPost"
      ></v-text-field>

      <!-- Search Results Card -->
      <v-card
        dark
        v-if="searchResults.length"
        id="search__card"
      >
        <v-list>
          <v-list-item
            v-for="result in searchResults"
            :key="result._id"
            @click="goToSearchResult(result._id)"
          >
            <v-list-item-title>
              {{result.title}} -
              <span class="font-weight-thin ml-3">
                {{formatDescription(result.description)}}
              </span>
            </v-list-item-title>
            <!-- Show Icon is Favorited by user -->
            <v-list-item-action v-if="checkIfUserFavorite(result._id)">
              <v-icon>favorite</v-icon>
            </v-list-item-action>
          </v-list-item>
        </v-list>
      </v-card>

      <v-spacer></v-spacer>

      <!-- Horizontal Navbar Links -->
      <v-toolbar-items class="hidden-xs-only">
        <v-btn
          text
          v-for="item in horizontalNavItems"
          :key="item.title"
          :to="item.link"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >{{item.icon}}</v-icon>
          {{item.title}}
        </v-btn>

        <!-- Profile button -->
        <v-btn
          text
          to="/profile"
          v-if="user"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >account_box</v-icon>
          <v-badge
            :content="userFavorites.length"
            :value="userFavorites.length"
            color="green"
            :class="{ 'bounce': bounceAnimated }"
          >
            Profile
          </v-badge>
        </v-btn>

        <!-- Signout button -->
        <v-btn
          text
          v-if="user"
          @click="handleSignoutUser"
        >
          <v-icon
            class="hidden-sm-only"
            left
          >exit_to_app</v-icon>
          Signout
        </v-btn>
      </v-toolbar-items>
    </v-app-bar>
    <!-- App Content -->
    <v-main>
      <v-container>
        <transition name="fade">
          <router-view />
        </transition>

        <!-- Auth Snackbar -->
        <v-snackbar
          v-model="authSnackbar"
          color="success"
          bottom
          left
          :timeout="5000"
        >
          <v-icon>check_circle</v-icon>
          <h3 style="position: absolute;top: 16px;left: 51px;">You are now signed in!</h3>
          <template v-slot:action="{ attrs }">
            <v-btn
              dark
              text
              v-bind="attrs"
              @click="authSnackbar = false"
            >
              Close
            </v-btn>
          </template>
        </v-snackbar>

        <!-- Auth Error Snackbar -->
        <v-snackbar
          v-model="authErrorSnackbar"
          v-if="authError"
          color="error"
          bottom
          left
          multi-line
          :timeout="5000"
        >
          <v-icon>cancel</v-icon>
          <h3 style="position: absolute;top: 16px;left: 60px;display: contents;">{{authError.message}}</h3>
          <template v-slot:action="{ attrs }">
            <v-btn
              dark
              text
              v-bind="attrs"
              to="/signin"
            >
              Signin
            </v-btn>
          </template>
        </v-snackbar>
      </v-container>
    </v-main>
    <v-footer app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "App",
  data() {
    return {
      sideNav: false,
      authSnackbar: false,
      authErrorSnackbar: false,
      bounceAnimated: true,
      searchTerm: ""
    };
  },
  computed: {
    ...mapGetters([
      "user",
      "authError",
      "userFavorites",
      "searchResults",
      "userFavorites"
    ]),
    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [{ icon: "chat", title: "Posts", link: "/posts" }];
      }
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      if (this.user) {
        items = [
          { icon: "chat", title: "Posts", link: "/posts" },
          { icon: "stars", title: "Create Post", link: "/post/add" },
          { icon: "account_box", title: "Profile", link: "/profile" }
        ];
      }
      return items;
    }
  },
  watch: {
    user(newValue, oldValue) {
      // if we had no value for user before, show snackbar
      if (oldValue === null) {
        this.authSnackbar = true;
      }
    },
    authError(value) {
      // if auth error is not null, show auth error snackbar
      if (value !== null) {
        this.authErrorSnackbar = true;
      }
    },
    userFavorites(value) {
      if (value) {
        this.bounceAnimated = true;
        setTimeout(() => {
          this.bounceAnimated = false;
        }, 1000);
      }
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
    },
    handleSignoutUser() {
      this.$store.dispatch("signoutUser");
    },
    handleSearchPost() {
      this.$store.dispatch("searchPosts", {
        searchTerm: this.searchTerm
      });
    },
    goToSearchResult(postId) {
      // clear search term
      this.searchTerm = "";
      // Go to desired result
      this.$router.push(`/posts/${postId}`);
      // clear search result
      this.$store.commit("clearSearchResults");
    },
    formatDescription(desc = "") {
      return desc.length > 20 ? `${desc.slice(0, 20)}...` : desc;
    },
    checkIfUserFavorite(postId) {
      // check if user favorites includes post with id of postId
      return (
        this.userFavorites &&
        this.userFavorites.some(fave => fave._id === postId)
      );
    }
  }
};
</script>
<style>
.fade-enter-active,
.fade-leave-active {
  transition-property: opacity;
  transition-duration: 0.25s;
}

.fade-enter-active {
  transition-delay: 0.25s;
}

.fade-enter,
.fade-leave-active {
  opacity: 0;
}

/* Search results card */
#search__card {
  position: absolute;
  width: 100vw;
  z-index: 8;
  top: 100%;
  left: 0%;
}

/* User Favorite Animation */
.bounce {
  animation: bounce 1s both;
}

@keyframes bounce {
  0%,
  20%,
  53%,
  80%,
  100% {
    transform: translate3d(0, 0, 0);
  }

  40%,
  43% {
    transform: translate3d(0, -20px, 0);
  }

  70% {
    transform: translate3d(0, -10px, 0);
  }

  90% {
    transform: translate3d(0, -4px, 0);
  }
}
</style>