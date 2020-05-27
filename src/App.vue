<template>
    <div id="app">
        <Nav></Nav>
        <router-view></router-view>
    </div>
</template>
<script lang="ts">

import { Component, Vue } from 'vue-property-decorator';

import Nav from './components/nav.vue';



@Component({
  components: {
    Nav
  },
})
export default class App extends Vue {

}
</script>