<template>
  <v-card
    :color="Color"
    :elevation="Elevation"
    :subtitle="Saldo"
    :title="Title"
    :rounded="Rounded"
    height="100"
    class="pt-2 mx-auto"
    prepend-avatar="https://cdn.vuetifyjs.com/images/john.jpg"
  >
  </v-card>
</template>
<script setup>
const props = defineProps({
  Title: {
    type: String,
    default: "",
  },
  Color: {
    type: String,
    default: "blue-lighten-1",
  },
  Saldo: {
    type: String,
    default: "",
  },
  Rounded: {
    type: String,
    default: "xl"
  },
  Elevation: {
    type: String,
    default: '6'
  }
});
</script>
