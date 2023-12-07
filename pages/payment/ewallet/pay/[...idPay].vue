<template>
  <v-container>
    <iframe
      v-if="urlDirect"
      :src="urlDirect"
      width="100%"
      height="600px"
    ></iframe>
    <div v-else>
      <p>No decrypted URL available.</p>
    </div>
  </v-container>
</template>

<script>
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      urlDirect: null,
      secretKey: "secret-key",
    };
  },
  created() {
    if (process.client) {
      const url = localStorage.getItem("redirectUrl");
      if (url) {
        this.urlDirect = CryptoJS.AES.decrypt(url, this.secretKey).toString(
          CryptoJS.enc.Utf8
        );
      }
    }
  },
};
</script>
