<template>
  <div id="app-clock">
    <div class="title" v-if="!useSingleSpa">Vue-Clock</div>
    <Clock />
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Clock from './components/Clock/index.vue';

export default Vue.extend({
  name: 'App',
  inject: ['useSingleSpa'],
  components: {
    Clock,
  },
});
</script>

<style lang="less" scoped>
#app-clock {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

* {
  box-sizing: border-box;
}

.title {
  padding: 20px 0;
  font-size: 22px;
  color: #2196f3;
  text-shadow: 1px 3px 4px rgba(33, 150, 243, 0.5);
}
</style>
