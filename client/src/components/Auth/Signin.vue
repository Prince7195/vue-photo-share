<template>
  <v-container
    class="fill-height"
    fluid
  >

    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
        md="6"
      >
        <v-card class="elevation-12">
          <v-toolbar
            color="primary"
            dark
            flat
          >
            <v-toolbar-title class="text-center">Welcome Back!</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form @submit.prevent="handleSigninUser">
              <v-text-field
                id="username"
                label="Username"
                v-model="username"
                prepend-icon="face"
                type="text"
              ></v-text-field>

              <v-text-field
                id="password"
                label="Password"
                v-model="password"
                prepend-icon="extension"
                type="password"
              ></v-text-field>
              <v-btn
                color="primary"
                type="submit"
              >SIGNIN</v-btn>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <h4>Don't have an Account?
              <router-link to="/signup">Signup</router-link>
            </h4>
            <v-spacer></v-spacer>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
export default {
  name: "Signin",
  data() {
    return {
      username: "",
      password: ""
    };
  },
  methods: {
    handleSigninUser() {
      this.$store.dispatch("signinUser", {
        username: this.username,
        password: this.password
      });
    }
  }
};
</script>
