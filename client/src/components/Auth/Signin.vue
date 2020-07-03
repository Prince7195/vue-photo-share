<template>
  <v-container
    class="fill-height"
    fluid
  >

    <!-- Error on signin -->
    <v-row
      align="center"
      justify="center"
    >
      <v-col
        cols="12"
        sm="10"
        md="6"
      >
        <form-alert
          v-if="error"
          :message="error.message"
        ></form-alert>
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
            <v-form
              @submit.prevent="handleSigninUser"
              lazy-validation
              v-model="isFormValid"
              ref="form"
            >
              <v-text-field
                :rules="usernameRules"
                id="username"
                label="Username"
                v-model="username"
                prepend-icon="face"
                type="text"
              ></v-text-field>

              <v-text-field
                id="password"
                :rules="passwordRules"
                label="Password"
                v-model="password"
                prepend-icon="extension"
                type="password"
              ></v-text-field>
              <v-btn
                color="primary"
                type="submit"
                :loading="loading"
                :disabled="loading || !isFormValid"
              >
                SIGNIN
                <template v-slot:loader>
                  <span class="custom-loader">
                    <v-icon light>cached</v-icon>
                  </span>
                </template>
              </v-btn>
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
import { mapGetters } from "vuex";
export default {
  name: "Signin",
  data() {
    return {
      isFormValid: true,
      username: "",
      password: "",
      usernameRules: [
        // check for empty
        username => !!username || "Username is required",
        // make user name is less than 10 characters
        username =>
          username.length < 10 || "Username must be less than 10 characters"
      ],
      passwordRules: [
        // check for empty
        password => !!password || "Password is required",
        // make sure password is atleast 5 characters
        password =>
          password.length >= 5 || "Password must be atleast 5 characters"
      ]
    };
  },
  computed: {
    ...mapGetters(["user", "error", "loading"])
  },
  watch: {
    user(value) {
      // if value changes from null to object, redirect to home page
      if (value) {
        this.$router.push("/");
      }
    }
  },
  methods: {
    handleSigninUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signinUser", {
          username: this.username,
          password: this.password
        });
      }
    }
  }
};
</script>
<style>
.custom-loader {
  animation: loader 1s infinite;
  display: flex;
}
@-moz-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-webkit-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@-o-keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
@keyframes loader {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
