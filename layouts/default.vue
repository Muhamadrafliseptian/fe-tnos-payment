<template>
  <v-container>
    <slot> </slot>
    <PartialsFooter />
  </v-container>
</template>
<script setup>
useHead({
  link: [
    {
      rel: "stylesheet",
      href: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css",
      crossorigin: "anonymous",
    },
    {
      href: "https://fonts.cdnfonts.com/css/roboto",
      rel: "stylesheet",
    },
  ],
  script: [
    {
      src: "https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js",
      crossorigin: "anonymous",
    },
  ],
});
</script>
