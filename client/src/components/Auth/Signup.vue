<template>
  <v-container
    class="fill-height"
    fluid
  >

    <!-- Error on signup -->
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
            color="accent"
            dark
            flat
          >
            <v-toolbar-title class="text-center">Get Started Here</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form
              @submit.prevent="handleSignupUser"
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
                :rules="emailRules"
                id="email"
                label="Email"
                v-model="email"
                prepend-icon="email"
                type="email"
              ></v-text-field>

              <v-text-field
                id="password"
                :rules="passwordRules"
                label="Password"
                v-model="password"
                prepend-icon="extension"
                type="password"
              ></v-text-field>

              <v-text-field
                id="password-confirmation"
                :rules="passwordRules"
                label="Confirm Password"
                v-model="passwordConfirmation"
                prepend-icon="gavel"
                type="password"
              ></v-text-field>
              <v-btn
                color="info"
                type="submit"
                :loading="loading"
                :disabled="loading || !isFormValid"
              >
                SIGNUP
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
            <h4>Already have an Account?
              <router-link to="/signin">Signin</router-link>
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
  name: "Signup",
  data() {
    return {
      isFormValid: true,
      username: "",
      email: "",
      password: "",
      passwordConfirmation: "",
      usernameRules: [
        // check for empty
        username => !!username || "Username is required",
        // make user name is less than 10 characters
        username =>
          username.length < 10 || "Username must be less than 10 characters"
      ],
      emailRules: [
        // check for empty
        email => !!email || "Email is required",
        // pattern test
        email => /.@+./.test(email)
      ],
      passwordRules: [
        // check for empty
        password => !!password || "Password is required",
        // make sure password is atleast 5 characters
        password =>
          password.length >= 5 || "Password must be atleast 5 characters",
        confirmation => confirmation === this.password || "Password must match"
      ]
    };
  },
  computed: {
    ...mapGetters(["error", "loading", "user"])
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
    handleSignupUser() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("signupUser", {
          username: this.username,
          password: this.password,
          email: this.email
        });
      }
    }
  }
};
</script>
