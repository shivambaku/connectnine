import Vue from 'vue'
import Router from 'vue-router'
import Play from '../views/Play'
import Multiplayer from '../views/Multiplayer'

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
        }
    ]
})