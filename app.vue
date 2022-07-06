<script setup lang="ts">
import { useColorMode } from '@vueuse/core';
const mode = useColorMode();
</script>

<template>
  <Head>
    <Meta name="viewport" content="width=device-width,initial-scale=1.0" />
    <Link rel="icon" href="/favicon.ico" />
    <Link href="https://fonts.googleapis.com/css?family=Prompt" rel="stylesheet" />
    <Title>Connect 9</Title>
  </Head>
  <div>
    <NuxtPage style="margin-top: 30px" />
    <hr class="footer-separator">
    <div class="footer-navigation">
      <NuxtLink i-ic:outline-videogame-asset to="/" />
      <NuxtLink i-ic:outline-leaderboard to="/leaderboard" />
      <div
        class="footer-navigation-button dark:i-ic:outline-dark-mode i-ic:outline-light-mode"
        @click="mode = mode === 'dark' ? 'light' : 'dark'"
      />
    </div>
    <div class="footer-text">
      Connect 9 is made by Shivam Kumar and Cody Harris.
    </div>
  </div>
</template>

<style>
:root {
  --primary-color: #2c3e50;
  --accent-color: #63948C;
  --background-color: #dadada;
  --game-background-color: #8DD3C7;
  --game-foreground-color: #2c3e50;
}

:root.dark {
  --primary-color: white;
  --accent-color: #8DD3C7;
  --background-color: #222;
  --game-background-color: #8DD3C7;
  --game-foreground-color: #2c3e50;
}

html {
  font-family: Avenir, Prompt, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-color);
  background-color: var(--background-color);
}

html.dark {
  opacity: 87%;
}

svg {
  vertical-align: top;
}

a {
  color: var(--primary-color);
}

a:hover {
  color: var(--accent-color);
}

.noselect {
  user-select: none;
}

.footer-separator {
  border: none;
  border-bottom: 1px solid;
  width: 20%;
  padding-top: 10px;
}

.footer-navigation {
  font-size: 24px;
  display: flex;
  justify-content: center;
  grid-gap: 0.8rem;
  gap: 0.8rem;
  margin-top: 10px;
}

.footer-navigation-button {
  cursor: pointer;
}

.footer-navigation-button:hover {
  color: var(--accent-color);
}

.footer-text {
  font-size: 13px;
  font-weight: 300;
  font-style: italic;
  margin: 10px 0 20px;
}
</style>
