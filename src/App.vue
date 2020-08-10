<template>
  <div id="app">
    <h1>Connect 9</h1>
    <p>
      Click on one of the empty spots to place the selected number.
      <br/>
      You can select one of the three available numbers.
      <br/>
      The selected one will be placed and a new random number (1-5) will replace it.
    </p>
    <Game/>
    <div class='footer'>
      Connect 9 is made by Shivam Kumar and Cody Harris.
    </div>
  </div>
</template>

<script>
import Game from './components/Game.vue';

export default {
  components: {
    Game,
  },
};
</script>

<style>
#app {
  font-family: Nunito, Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 40px;
}

a {
  color: #42b983;
}

.footer {
  font-weight: 300;
  margin: 30px 0 20px;
}
</style>
