import Vue from 'vue';
import Router from 'vue-router';
import Play from '../views/Play.vue';
import Multiplayer from '../views/Multiplayer.vue';
import MultiplayerGame from '../views/MultiplayerGame.vue';
import MultiplayerLobby from '../views/MultiplayerLobby.vue';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'play',
      component: Play,
    },
    {
      path: '/multiplayer',
      name: 'multiplayer',
      component: Multiplayer,
    },
    {
      path: '/multiplayer-game',
      name: 'multiplayer-game',
      component: MultiplayerGame,
    },
    {
      path: '/multiplayer-lobby/:id',
      name: 'multiplayer-lobby',
      props: true,
      component: MultiplayerLobby,
    },
  ],
});
