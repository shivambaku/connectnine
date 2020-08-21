<template>
  <div id="app">
    <router-view/>
    <router-link to="/">Play</router-link>
    <span style='display:inline-block; width: 10px;'/>
    <router-link to="multiplayer">Multiplayer</router-link>
  </div>
</template>

<script>
export default {
  name: 'app',
};
</script>
