<template>
    <div>
        <section class="page-header page-header-article">
            <h1 class="project-name">{{title}}</h1>
        </section>
        <section class="main-content " >
           <ul id="main-body" class="markdown-body"  v-html="mapHtml">
	      </ul>
        </section>
        <div id="loaddata" style="display:none" ref="loaddata"></div>
    </div>
   
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import * as marked from 'marked';
import { fetchList } from '../assets/api'
// import hljs from 'highlight';

@Component({
   
})
export default class Content extends Vue {
    title:string
    mapHtml:string = '正在拼命加载中...'
    pathUrl:string
    created() {
        // marked.setOptions({
        //     highlight: function (code) {
        //         return hljs.highlightAuto(code).value;
        //     }
        // });
        this.title = this['$route'].params.title
        this.pathUrl = this['$route'].query.pathUrl
    }
    mounted() {
        // if(this.title == 'acticle'){
                fetchList('/static/xuexibiji/' +this.pathUrl).then( res => {
                    this.mapHtml = marked(res)
                })
                // fetch('/static/xuexibiji/README.md').then(code =>{
                //     return code.text()
                    
                // }).then(code =>{
                //     this.mapHtml = marked(code)
        // }
    }
}
</script>

<style scoped>
#main-body{
    width: 100%;
}
</style>