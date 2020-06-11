<template>
  <div id="clock">
    <div class="title" v-if="!useSingleSpa">Vue-Clock</div>
    <div class="time" v-if="!useSingleSpa">{{ time }}</div>
    <Clock />
  </div>
</template>

<script lang="ts">
import {
  defineComponent,
  ref,
  onMounted,
  onUnmounted,
  inject,
} from '@vue/composition-api';
import Clock from '@/components/Clock/index.vue';

export default defineComponent({
  name: 'App',
  components: {
    Clock,
  },
  setup() {
    const useSingleSpa = inject('useSingleSpa');
    const time = ref('--:--:--');
    const timerRef = ref(0);

    onMounted(() => {
      getTime();
      timerRef.value = setInterval(() => {
        getTime();
      }, 1000);
    });

    onUnmounted(() => {
      clearInterval(timerRef.value);
    });

    const getTime = () => {
      time.value = new Date().toTimeString().split(' ')[0];
    };

    return {
      time,
      useSingleSpa,
    };
  },
});
</script>

<style lang="less" scoped>
#clock {
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
