<template>
  <div id="app">
    <v-app style="background: #e3e3ee">
      <!-- Side Navbar -->
      <v-navigation-drawer
        v-model="sideNav"
        app
        temporary
        fixed
      >
        <v-toolbar
          flat
          dark
          color="primary"
        >
          <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
          <router-link
            to="/"
            tag="span"
            style="cursor: pointer"
          >
            <h1 class="title pl-3">VueShare</h1>
          </router-link>
        </v-toolbar>

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
        </v-list>
      </v-navigation-drawer>

      <!-- Horizontal  Navbar -->
      <v-toolbar
        color="primary"
        dark
        absolute
        width="100%"
      >

        <!-- App Title -->
        <v-app-bar-nav-icon @click="toggleSideNav"></v-app-bar-nav-icon>
        <v-toolbar-title class="hidden-xs-only">
          <router-link
            to="/"
            tag="span"
            style="cursor: pointer"
          >VueShare</router-link>
        </v-toolbar-title>

        <v-spacer></v-spacer>

        <!-- Search Input -->
        <v-text-field
          prepend-icon="search"
          placeholder="Search posts"
          color="accent"
          single-line
          hide-details
        ></v-text-field>

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
        </v-toolbar-items>
      </v-toolbar>
      <!-- App Content -->
      <main>
        <v-container class="mt-5 pt-5">
          <transition name="fade">
            <router-view />
          </transition>
        </v-container>
      </main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: "App",
  data() {
    return {
      sideNav: false
    };
  },
  computed: {
    horizontalNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      return items;
    },
    sideNavItems() {
      let items = [
        { icon: "chat", title: "Posts", link: "/posts" },
        { icon: "lock_open", title: "Sign In", link: "/signin" },
        { icon: "create", title: "Sign Up", link: "/signup" }
      ];
      return items;
    }
  },
  methods: {
    toggleSideNav() {
      this.sideNav = !this.sideNav;
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
</style>