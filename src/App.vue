<template>
  <div id="app">
    <Game/>
    <div class='rules'>
      <h4>How to Play</h4>
      <p>
        Select one of the three available numbers and place it in an empty spot.
        <br/>
        Connect three or more of the same adjacent numbers to get a higher number.
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
