<template>
  <div id="app">
    <Game/>
    <div class='rules'>
      <h4>How to Play</h4>
      <p>
        Click on one of the empty spots to place the selected number.
        <br/>
        You can select one of the three available numbers.
        <br/>
        The selected one will be placed and a new random number (1-5) will replace it.
        <br/>
        Connect three or more of the same value to progress.
      </p>
    </div>
    <hr/>
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
