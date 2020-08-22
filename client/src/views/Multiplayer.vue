<template>
  <div>
    <h1> Enter Your User Name </h1>
    <input type="text" v-model="username" placeholder="your username">
    <button v-on:click="submit"> Submit </button>
  </div>
</template>
<script>
import io from 'socket.io-client';

export default {
  name: 'Multiplayer',
  data() {
    return {
      socket: {},
      username: '',
    };
  },
  created() {
    this.socket = io('http://localhost:3000');
  },
  methods: {
    submit() {
      this.socket.emit('username', this.username);
      this.$router.push({ name: 'multiplayer-lobby', params: { id: this.username, socket: this.socket } });
    },
  },
};
</script>
