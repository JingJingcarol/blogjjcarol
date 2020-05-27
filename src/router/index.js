import Vue from 'vue'
import Router from 'vue-router'

import Home from '../components/home.vue'
import map from '../components/map.vue'
import content from '../components/content.vue'

Vue.use(Router)

export function createRouter() {
    return new Router({
        mode: "history",
        routes: [{
            path: '/', component: Home
        }, {
            path: "/map/:type", component: map
        },
        {
            path: "/content/:title/", component: content
        }]
    })
}