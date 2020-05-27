<template>
    <div>
        <section class="page-header index-header">
            <h1 class="project-name">welcome to JingJing's space</h1>
        </section>
        <section class="main-content index-content">
            <p class="box">
                <router-link to="/map/acticle">
                    <img :src="acticleImg" alt="">
                    <span>文章笔记</span>
                </router-link>

            </p>
            <p class="box">
                <router-link to="/map/life">
                    <img :src="lifeImg" alt="">
                    <span>生活随感</span>
                </router-link>
                
            </p>
            <p class="box">
                <router-link to="/map/demo">
                    <img :src="lifeImg" alt="">
                    <span>练习demo</span>
                </router-link>
            </p>
        </section>
    </div>
   
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
   
})
export default class Home extends Vue {
    acticleImg:string = 'static/img/icon.png'
    lifeImg:string = 'static/img/icon1.png'
    demoImg:string = 'static/img/icon2.png'
}
</script>