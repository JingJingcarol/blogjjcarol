<template>
    <nav class="g-nav g-gradient">
        <h3>CAROL</h3>
         <div class="collapse">
            <ul class="nav-left">
                <li><router-link to="/">首页</router-link></li>
                <li class="dropdown dropdown-toggle"><a href="#">更多</a>
                    <ul class="sub-list-collapse">
                        <li><router-link to="/map/acticle">blog</router-link></li>
                        <li><router-link to="/map/life">life</router-link></li>
                        <li><router-link to="/map/demo">demo</router-link></li>
                    </ul>
                </li>
            </ul>
            <ul class="nav-right ">
            </ul>
        </div>
    </nav>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

import '../css/nav.css'

@Component({
   
})
export default class Nav extends Vue {}
</script>