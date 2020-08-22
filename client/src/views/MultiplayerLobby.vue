<template>
  <div>
    <h1> Welcome To The Multiplayer Lobby! </h1>
    {{id}}
    <p> {{players}} </p>
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
      players: [],
    };
  },
  created() {
    this.socket.on('users', (data) => {
      this.players = data;
    });
  },
};
</script>
