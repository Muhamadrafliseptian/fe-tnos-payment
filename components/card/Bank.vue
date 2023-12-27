<template>
  <v-card color="white" :rounded="Rounded" :elevation="Elevation">
    <div class="d-flex">
      <!-- <v-img :src="Avatar"></v-img> -->
      <slot name="avatarImage">
          
        </slot>
      <div class="mt-2">
        <v-card-title class="text-h8">
          {{ Title }}
        </v-card-title>
        <v-card-subtitle>
          {{ Subtitle }}
        </v-card-subtitle>
      </div>
    </div>
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
    default: "",
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
