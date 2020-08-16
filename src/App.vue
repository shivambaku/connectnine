<template>
  <div id="app">
    <!-- <div class='header'>
      <h1>Connect 9</h1>
    </div> -->
    <Game/>
    <div class='rules'>
      <p>
        Click on one of the empty spots to place the selected number.
        <br/>
        You can select one of the three available numbers.
        <br/>
        The selected one will be placed and a new random number (1-5) will replace it.
      </p>
    </div>
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
