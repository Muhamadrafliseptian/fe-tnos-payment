<template>
  <v-card
    :rounded="Rounded"
    :title="Title"
    :subtitle="Subtitle"
    :color="Color"
    height="100"
    class="pt-2 mx-auto"
    :prepend-avatar="Avatar"
    :elevation="Elevation"
  >
  </v-card>
</template>
<script setup>
import LogoBank from "../assets/images/bca.png";
const props = defineProps({
  Title: {
    type: String,
    default: "",
  },
  Subtitle: {
    type: String,
    default: "",
  },
  Avatar: {
    type: String,
    default: LogoBank,
  },
  Color: {
    type: String,
    default: "grey-lighten-5",
  },
  Rounded: {
    type: String,
    default: "rounded-lg",
  },
  Elevation: {
    type: String,
    default: "4",
  },
});
</script>
