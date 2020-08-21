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
      name: 'Play',
      component: Play,
    },
    {
      path: '/multiplayer',
      name: 'Multiplayer',
      component: Multiplayer,
    },
    {
      path: '/MultiplayerGame',
      name: 'MultiplayerGame',
      component: MultiplayerGame,
    },
    {
      path: '/MultiplayerLobby/:id',
      name: 'MultiplayerLobby',
      props: true,
      component: MultiplayerLobby,
    },
  ],
});
