<template>
  <v-container>
    <slot> </slot>
    <PartialsFooter />
  </v-container>
</template>
<script setup>
import axios from "axios";

const { $swal } = useNuxtApp();
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

// let paidFound = false;

// const getData = () => {
//   try {
//     axios
//       .get("http://127.0.0.1:3001/payment/INV-TNOS123/get")
//       .then((response) => {
//         const paymentData = response.data && response.data.data;
//         if (paymentData) {
//           paymentData.forEach((payment) => {
//             if (payment.status === "PAID") {
//               paidFound = true;
//             }
//           });

//           const pendingPayments = paymentData.filter(
//             (payment) => payment.status !== "PAID"
//           );
//           if (pendingPayments.length > 0 && paidFound) {
//             setTimeout(getData, 50000);
//           } else {
//             $swal.fire({
//               icon: "success",
//               title: "Berhasil Bayar",
//               message: "terima kasih atas pembayarannya",
//             });
//           }
//         }
//       });
//   } catch (er) {
//     console.error(er);
//   }
// };

// const clearVirtualAccountData = () => {
//   localStorage.removeItem("virtualAccountData");
//   localStorage.removeItem("qrCodeData");
//   localStorage.removeItem("ewalletData");
// };

// getData();
</script>
