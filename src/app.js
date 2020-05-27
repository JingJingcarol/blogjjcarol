import Vue from 'vue'
import App from './App.vue'
import {createRouter} from './router'
import * as marked from 'marked';
import {hljs} from 'highlight.js';

import './css/normalize.css';
import './css/stylesheet.css'
import './css/github-light.css';
import './css/index.css'

marked.setOptions({
    highlight: function (code) {
        return hljs.highlightAuto(code).value;
    }
});

export function createApp() {
    const router = createRouter()

    const app =  new Vue({
        router,
        render: h => h(App)
    })

    return {
        app,
        router
    }
}