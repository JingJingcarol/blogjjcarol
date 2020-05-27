<template>
    <div>
        <section class="page-header page-header-article">
            <h1 class="project-name">my{{title}}</h1>
        </section>
        <section class="main-content " @click="go($event)">
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
export default class Map extends Vue {
    title:string
    mapHtml:string = '正在拼命加载中...'
    created() {
        // marked.setOptions({
        //     highlight: function (code) {
        //         return hljs.highlightAuto(code).value;
        //     }
        // });
        this.title = this['$route'].params.type
        
    }
    mounted() {
        if(this.title == 'acticle'){
                fetchList('/static/xuexibiji/README.md').then( res => {
                    this.mapHtml = marked(res)
                })
                // fetch('/static/xuexibiji/README.md').then(code =>{
                //     return code.text()
                    
                // }).then(code =>{
                //     this.mapHtml = marked(code)
        }
    }
   go(e){
       const target = e.target
       e.preventDefault();
       if (target.nodeName === 'A' && target.getAttribute('href')) {
            this['$router'].push({
                path: '/content/'+target.innerText,
			    query: {
                    pathUrl:decodeURIComponent(target.getAttribute('href'))
                }
            })
        }
   }
}
</script>

<style scoped>
#main-body{
    width: 100%;
}
#main-body li{
    display: none;
}
#main-body li:has(a){
    display: block;
}
</style>