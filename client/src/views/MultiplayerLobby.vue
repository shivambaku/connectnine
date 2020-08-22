<template>
  <div>
    <h1> Welcome To The Multiplayer Lobby! </h1>
    {{id}}
    <p> {{Players}} </p>
    <button v-on:click="submit"> Start </button>
  </div>
</template>
<script>
export default {
  name: 'MultiplayerLobby',
  props: {
    id: String,
    socket: Object,
  },
  data() {
    return {
      Players: [],
    };
  },
  created() {
    this.socket.on('users', (data) => {
      this.Players = data;
    });
  },
};
</script>
