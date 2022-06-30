<template>
  <div>
    <Head>
      <Meta name="viewport" content="width=device-width,initial-scale=1.0" />
      <Link rel="icon" href="<%= BASE_URL %>favicon.ico" />
      <Link href="https://fonts.googleapis.com/css?family=Nunito Sans" rel="stylesheet" />
      <Title>Connect 9</Title>
    </Head>
    <NuxtPage />
  </div>
</template>

<style>
:root {
  --primary-color: #2c3e50;
  --background-color: #8DD3C7;
  --foreground-color: #2c3e50;
}

#app {
  font-family: Avenir, Nunito Sans, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: var(--primary-color);
}

hr {
  border: none;
  border-bottom: 1px solid;
  width: 20%;
}

svg {
  vertical-align: top;
}

.noselect {
  user-select: none;
}
</style>
