<template>
    <v-card
      :color="Color"
      :elevation="Elevation"
      :subtitle="Saldo"
      :title="Title"
      :rounded="Rounded"
      height="100"
      class="pt-2 mx-auto"
    >
      <template v-slot:prepend>
        <v-icon :icon="IconKiri" color="primary"></v-icon>
      </template>
      <template v-slot:append>
        <v-icon :icon="IconKanan" color="success"></v-icon>
      </template>
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
      default: "gray-lighten-4",
    },
    Saldo: {
      type: String,
      default: "",
    },
    Rounded: {
      type: String,
      default: "xl",
    },
    Elevation: {
      type: String,
      default: "6",
    },
    IconKiri: {
        type: String,
        default: ''
    },
    IconKanan: {
        type: String,
        default: 'mdi mdi-chevron-right-circle'
    }
  });
  </script>
  