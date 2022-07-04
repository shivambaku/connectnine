<script setup lang="ts">
</script>

<template>
  <div id="app">
    <Game />
    <div class="rules">
      <h4>How to Play</h4>
      <p>
        Select one of the three available numbers and place it in an empty spot.
        <br>
        Connect three or more of the same adjacent numbers to get a higher number.
      </p>
    </div>
    <hr>
    <div class="footer">
      Connect 9 is made by Shivam Kumar and Cody Harris.
    </div>
  </div>
</template>

<style>
.rules h4 {
  margin-bottom: 0px;
  font-size: 18px;
}

.rules p {
  font-size: 14px;
  margin-top: 5px;
  font-weight: 200;
}

.footer {
  font-size: 14px;
  font-weight: 300;
  font-style: italic;
  margin: 20px 0 20px;
}
</style>
