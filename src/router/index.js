import Vue from 'vue'
import Router from 'vue-router'
import Play from '../views/Play'
import Multiplayer from '../views/Multiplayer'
import MultiplayerGame from '../views/MultiplayerGame'
import MultiplayerLobby from '../views/MultiplayerLobby'

Vue.use(Router)

export default new Router({
    routes:[
        {
            path: '/',
            name: 'Play',
            component: Play
        },
        {
            path: '/multiplayer',
            name: 'Multiplayer',
            component: Multiplayer
        },
        {
            path: '/MultiplayerGame',
            name: 'MultiplayerGame',
            component: MultiplayerGame
        },
        {
            path: '/MultiplayerLobby/:id',
            name: 'MultiplayerLobby',
            props: true,
            component: MultiplayerLobby
        }
    ]
})