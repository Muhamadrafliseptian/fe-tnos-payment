<template>
  <v-layout class="overflow-visible" style="height: 56px">
    <v-bottom-navigation v-model="value" active color="primary">
      <v-btn @click="backHome">
        <v-icon>mdi-home</v-icon>
        Home
      </v-btn>
      <v-btn>
        <v-icon>mdi-cog</v-icon>
        Settings
      </v-btn>
      <v-btn>
        <v-icon>mdi-account</v-icon>
        <span>Profile</span>
      </v-btn>
    </v-bottom-navigation>
  </v-layout>
</template>
<script>
export default {
  methods: {
    backHome() {
      this.$router.push("/");
    },
  },
};
</script>
