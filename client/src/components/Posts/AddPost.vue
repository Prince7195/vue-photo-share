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
        <h1 class="primary--text">Add Post</h1>
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
        <v-form
          @submit.prevent="handleAddPost"
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

          <v-btn
            color="info"
            type="submit"
            :loading="loading"
            :disabled="loading || !isFormValid"
          >
            Submit
            <template v-slot:loader>
              <span class="custom-loader">
                <v-icon light>cached</v-icon>
              </span>
            </template>
          </v-btn>
        </v-form>
      </v-col>
    </v-row>

  </v-container>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "AddPost",
  data() {
    return {
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
    ...mapGetters(["user", "loading"])
  },
  methods: {
    handleAddPost() {
      if (this.$refs.form.validate()) {
        this.$store.dispatch("addPost", {
          title: this.title,
          imageUrl: this.imageUrl,
          categories: this.categories,
          description: this.description,
          creatorId: this.user._id
        });
      }
    }
  }
};
</script>

<style scoped>
</style>
