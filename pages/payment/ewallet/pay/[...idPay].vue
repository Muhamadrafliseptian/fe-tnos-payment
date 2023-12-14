<template>
  <h5>
    Halaman Pembayaran
  </h5>
  <!-- <div class="full-page-embed">
    <iframe
      width="100%"
      height="100%"
      src="https://ewallet-mock-connector.xendit.co/v1/ewallet_connector/checkouts?token=cltbrbcq7tblsgdhjqvg"
    />
  </div> -->
</template>

<style scoped>
.full-page-embed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  margin: 0;
  padding: 0;
  overflow: hidden;
}
</style>

<script>
import CryptoJS from "crypto-js";

export default {
  data() {
    return {
      urlDirect: null,
      secretKey: "ajajdakdja3ijdaidahbc",
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
