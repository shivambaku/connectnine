<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
const mode = useColorMode();
</script>

<template>
  <Head>
    <Meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <Link rel="icon" href="/favicon.ico" />
    <Link href="https://fonts.googleapis.com/css?family=Nunito Sans" rel="stylesheet" />
    <Title>Connect 9</Title>
  </Head>
  <div>
    <NuxtPage />
    <div class="rules">
      <h4>How to Play</h4>
      <p>
        Select one of the three available numbers and place it in an empty spot.
        <br>
        Connect three or more of the same adjacent numbers to get a higher number.
      </p>
    </div>
    <hr>
    <div class="footer-navigation">
      <NuxtLink i-ic:outline-videogame-asset to="/" />
      <NuxtLink i-ic:outline-leaderboard to="/" />
      <div
        class="dark:i-ic:outline-dark-mode i-ic:outline-light-mode"
        style="cursor: pointer;"
        @click="mode = mode === 'dark' ? 'light' : 'dark'"
      />
    </div>
    <div class="footer">
      Connect 9 is made by Shivam Kumar and Cody Harris.
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #2c3e50;
  --game-background-color: #8DD3C7;
  --game-foreground-color: #2c3e50;
}

:root.dark {
  --primary-color: white;
  --game-background-color: #8DD3C7;
  --game-foreground-color: #2c3e50;
}

html {
  font-family: Avenir, Nunito Sans, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-color);
}

html.dark {
  background-color: #222;
}

hr {
  border: none;
  border-bottom: 1px solid;
  width: 20%;
}

svg {
  vertical-align: top;
}

.router-link-active {
  color: var(--primary-color);
}

.noselect {
  user-select: none;
}

.rules h4 {
  margin-bottom: 0px;
  font-size: 18px;
}

.rules p {
  font-size: 14px;
  margin-top: 5px;
  font-weight: 200;
}

.footer-navigation {
  font-size: 24px;
  display: flex;
  justify-content: center;
  grid-gap: 0.8rem;
  gap: 0.8rem;
}

.footer {
  font-size: 13px;
  font-weight: 300;
  font-style: italic;
  margin: 10px 0 20px;
}
</style>
