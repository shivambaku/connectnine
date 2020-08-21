<template>
      <div id="app">
        <router-view/>
        <router-link to="/"> Play </router-link>
        <router-link to="Multiplayer"> Multiplayer </router-link>

    </div>
</template>

<script>
export default {
    name: 'app'
}
</script>
