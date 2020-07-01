<template>
  <v-alert
    text
    type="error"
    value="true"
    prominent
    dismissible
    transition="scroll-x-transition"
  >
    {{message}}
  </v-alert>
</template>

<script>
export default {
  props: ["message"]
};
</script>

<style>
</style>