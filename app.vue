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
    <NuxtPage style="margin-top: 30px" />
    <hr>
    <div class="footer-navigation">
      <NuxtLink i-ic:outline-videogame-asset to="/" />
      <NuxtLink i-ic:outline-leaderboard to="/leaderboard" />
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
  opacity: 87%;
}

hr {
  border: none;
  border-bottom: 1px solid;
  width: 20%;
  padding-top: 5px;
}

svg {
  vertical-align: top;
}

a {
  color: var(--primary-color);
}

.router-link-active {
  color: var(--primary-color);
}

.noselect {
  user-select: none;
}

.footer-navigation {
  font-size: 24px;
  display: flex;
  justify-content: center;
  grid-gap: 0.8rem;
  gap: 0.8rem;
  margin-top: 10px;
}

.footer {
  font-size: 13px;
  font-weight: 300;
  font-style: italic;
  margin: 10px 0 20px;
}
</style>
