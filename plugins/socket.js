import { io } from 'socket.io-client';

export default defineNuxtPlugin(nuxtApp => {
    const socket = io('http://localhost:3001'); // Ganti dengan URL server NestJS Anda
    
    if (socket) {
        console.log("Initialized");
    } else {
        console.log("Failed");
    }

    nuxtApp.provide('socket', socket);
});