<template>
  <main class="canvas-clock">
    <canvas id="canvas" ref="canvasRef" />
  </main>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from '@vue/composition-api';

export default defineComponent({
  name: 'Clock',
  setup() {
    const textColor = '#333';
    const bgColor = '#f6f6f6';
    const canvasRef = ref<HTMLCanvasElement>(null);

    onMounted(() => {
      drawInit();
      setInterval(() => {
        drawInit();
      }, 1000);
    });

    const drawInit = () => {
      const canvasEl = canvasRef.value!;
      const maxWidth = canvasEl.clientWidth;
      const wh = window.innerWidth > 200 ? 200 : window.innerWidth;
      canvasEl.style.width = `${wh}px`;
      canvasEl.style.height = `${wh}px`;
      canvasEl.height = wh * window.devicePixelRatio;
      canvasEl.width = wh * window.devicePixelRatio;

      const canvasCtx: CanvasRenderingContext2D = canvasEl.getContext('2d')!;
      canvasCtx.clearRect(0, 0, maxWidth, maxWidth);
      canvasCtx.scale(window.devicePixelRatio, window.devicePixelRatio);

      drawCircle(canvasEl, canvasCtx);
      drawLine(canvasEl, canvasCtx);
      drawArc(canvasEl, canvasCtx);
      drawNumber(canvasEl, canvasCtx);
      drawHand(canvasEl, canvasCtx);
    };

    // 平分线
    const drawLine = (
      canvasEl: HTMLCanvasElement,
      canvasCtx: CanvasRenderingContext2D,
    ) => {
      const maxWidth = canvasEl.clientWidth;
      canvasCtx.strokeStyle = '#ccc';
      canvasCtx.lineWidth = 1;

      canvasCtx.beginPath();
      // 横线
      for (let i = 1; i < 10; i++) {
        canvasCtx.moveTo(0, i * 20);
        canvasCtx.lineTo(maxWidth, i * 20);
      }
      // 竖线
      for (let i = 1; i < 10; i++) {
        canvasCtx.moveTo(i * 20, 0);
        canvasCtx.lineTo(i * 20, maxWidth);
      }
      canvasCtx.stroke();
      canvasCtx.closePath();
    };

    // 画圆
    const drawCircle = (
      canvasEl: HTMLCanvasElement,
      canvasCtx: CanvasRenderingContext2D,
    ) => {
      const maxWidth = canvasEl.clientWidth;

      // 外圈
      canvasCtx.fillStyle = bgColor;
      canvasCtx.beginPath();
      canvasCtx.arc(maxWidth / 2, maxWidth / 2, maxWidth / 2 - 10, 0, 4 * Math.PI);
      canvasCtx.fill('nonzero');
      canvasCtx.strokeStyle = '#f1f1f1';
      canvasCtx.shadowBlur = 4;
      canvasCtx.shadowColor = 'rgba(100,100,100,0.2)';
      canvasCtx.shadowOffsetX = 1;
      canvasCtx.shadowOffsetY = 1;

      // 内圈
      canvasCtx.fillStyle = '#e9e9e9';
      canvasCtx.beginPath();
      canvasCtx.arc(maxWidth / 2, maxWidth / 2, maxWidth / 2 - 20, 0, 4 * Math.PI);
      canvasCtx.fill('nonzero');

      // 中点
      canvasCtx.fillStyle = '#999';
      canvasCtx.beginPath();
      canvasCtx.arc(maxWidth / 2, maxWidth / 2, 6, 0, 4 * Math.PI);
      canvasCtx.fill('nonzero');
    };

    // 画数字
    const drawNumber = (
      canvasEl: HTMLCanvasElement,
      canvasCtx: CanvasRenderingContext2D,
    ) => {
      const maxWidth = canvasEl.clientWidth;
      const bigFont = '14pt Arial';
      const smallFont = '9pt Arial';

      canvasCtx.fillStyle = textColor;
      canvasCtx.font = bigFont;
      canvasCtx.fillText('12', maxWidth / 2 - 10, 35);

      canvasCtx.font = smallFont;
      canvasCtx.fillText('1', maxWidth - 68, maxWidth / 5 + 5);
      canvasCtx.fillText('2', maxWidth - 45, maxWidth / 3 + 5);

      canvasCtx.font = bigFont;
      canvasCtx.fillText('3', maxWidth - 35, maxWidth / 2 + 5);

      canvasCtx.font = smallFont;
      canvasCtx.fillText('4', maxWidth - 45, (maxWidth * 2) / 3 + 5);
      canvasCtx.fillText('5', maxWidth - 68, (maxWidth * 4) / 5 + 5);

      canvasCtx.font = bigFont;
      canvasCtx.fillText('6', maxWidth / 2 - 4, maxWidth - 25);

      canvasCtx.font = smallFont;
      canvasCtx.fillText('7', maxWidth / 3 - 4, (maxWidth * 4) / 5 + 5);
      canvasCtx.fillText('8', maxWidth / 5 - 4, (maxWidth * 2) / 3 + 5);

      canvasCtx.font = bigFont;
      canvasCtx.fillText('9', 25, maxWidth / 2 + 5);

      canvasCtx.font = smallFont;
      canvasCtx.fillText('10', maxWidth / 5 - 4, maxWidth / 3 + 5);
      canvasCtx.fillText('11', maxWidth / 3 - 4, maxWidth / 5 + 5);
    };

    const drawArc = (
      canvasEl: HTMLCanvasElement,
      canvasCtx: CanvasRenderingContext2D,
    ) => {
      const [hour, munite, second] = getTime();
      const maxWidth = canvasEl.clientWidth;
      canvasCtx.moveTo(maxWidth / 2, maxWidth / 2);
      canvasCtx.fillStyle = '#999';
      canvasCtx.arc(
        maxWidth / 2,
        maxWidth / 2,
        40,
        ((second === 0 ? -1 : second - 1) / 60) * 4 * Math.PI,
        (second / 60) * 4 * Math.PI,
      );
      canvasCtx.fill('nonzero');
    };

    // 画指针
    const drawHand = (
      canvasEl: HTMLCanvasElement,
      canvasCtx: CanvasRenderingContext2D,
    ) => {
      const [hour, munite, second] = getTime();
      const maxWidth = canvasEl.clientWidth;

      canvasCtx.beginPath();
      canvasCtx.fillStyle = '#999';
      // 时针
      const hourPoint = { x: maxWidth / 2 - 4, y: maxWidth / 2 - 8 };
      canvasCtx.rotate(0);
      canvasCtx.moveTo(hourPoint.x, hourPoint.y);
      canvasCtx.lineTo(hourPoint.x, hourPoint.y - 25);
      canvasCtx.lineTo(hourPoint.x + 8, hourPoint.y - 25);
      canvasCtx.lineTo(hourPoint.x + 8, hourPoint.y);
      canvasCtx.lineTo(hourPoint.x, hourPoint.y);

      // 分针
      const munitePoint = { x: maxWidth / 2 + 8, y: maxWidth / 2 - 2 };
      canvasCtx.rotate(0);
      canvasCtx.moveTo(munitePoint.x, munitePoint.y);
      canvasCtx.lineTo(munitePoint.x + 40, munitePoint.y);
      canvasCtx.lineTo(munitePoint.x + 40, munitePoint.y + 4);
      canvasCtx.lineTo(munitePoint.x, munitePoint.y + 4);
      canvasCtx.lineTo(munitePoint.x, munitePoint.y);

      // 秒针
      // const secondPoint = { x: maxWidth / 2 - 1, y: maxWidth / 2 + 8 };
      // canvasCtx.rotate(0);
      // canvasCtx.moveTo(secondPoint.x, secondPoint.y);
      // canvasCtx.lineTo(secondPoint.x + 2, secondPoint.y);
      // canvasCtx.lineTo(secondPoint.x + 2, secondPoint.y + 45);
      // canvasCtx.lineTo(secondPoint.x, secondPoint.y + 45);
      // canvasCtx.lineTo(secondPoint.x, secondPoint.y);

      canvasCtx.fill('nonzero');
      canvasCtx.closePath();
    };

    // 获取时间
    // const [hour, munite, second] = getTime();
    const getTime = () => {
      const time = new Date()
        .toTimeString()
        .split(' ')[0]
        .split(':');
      return time.map(i => Number(i));
    };

    return {
      canvasRef,
    };
  },
});
</script>

<style lang="less" scoped>
.canvas-clock {
  display: flex;
  justify-content: center;
}

#canvas {
  width: 100%;
  max-width: 200px;
  position: relative;
  margin: 0 auto;
  left: 0;
  right: 0;
}
</style>
