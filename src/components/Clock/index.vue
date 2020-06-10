<template>
  <main class="canvas-clock">
    <canvas ref="canvasBgRef" />
    <canvas ref="canvasHourRef" />
    <canvas ref="canvasMinuteRef" />
    <canvas ref="canvasSecondRef" />
  </main>
</template>

<script lang="ts">
import {
  defineComponent,
  onMounted,
  ref,
  computed,
  onUnmounted,
  reactive,
} from '@vue/composition-api';

const themeConfig = {
  text: '#2c3e50',
  bg: '#f6f6f6',
  hangBg: '#2c3e50',
  handStrokeStyle: '#eee',
};

// 仿真时钟
export default defineComponent({
  name: 'Clock',
  setup() {
    const bigFont = '14pt Arial';
    const smallFont = '9pt Arial';
    const color = reactive(themeConfig);
    const canvasWidth = ref(0);
    const canvasBgRef = ref<HTMLCanvasElement>(null);
    const canvasHourRef = ref<HTMLCanvasElement>(null);
    const canvasMinuteRef = ref<HTMLCanvasElement>(null);
    const canvasSecondRef = ref<HTMLCanvasElement>(null);
    const timer = ref(0);

    onMounted(() => {
      drawInit();
      timer.value = setInterval(drawInit, 1000);
    });

    onUnmounted(() => {
      clearInterval(timer.value);
    });

    const drawInit = () => {
      canvasWidth.value = canvasBgRef.value!.clientWidth;
      const wh = window.innerWidth > 200 ? 200 : window.innerWidth;
      const pixelRatio = window.devicePixelRatio;

      const canvasList = [canvasBgRef, canvasHourRef, canvasMinuteRef, canvasSecondRef];
      canvasList.forEach(canvas => {
        canvas.value!.height = wh * pixelRatio;
        canvas.value!.width = wh * pixelRatio;

        const canvasCtx: CanvasRenderingContext2D = canvas.value!.getContext('2d')!;
        canvasCtx.clearRect(0, 0, canvasWidth.value, canvasWidth.value);
        canvasCtx.scale(pixelRatio, pixelRatio);
      });

      const canvasBgCtx: CanvasRenderingContext2D = canvasBgRef.value!.getContext('2d')!;

      drawCircle(canvasBgCtx);
      // drawLine(canvasBgCtx);
      drawNumber(canvasBgCtx);
      drawHand();
    };

    // 平分线
    const drawLine = (canvasBgCtx: CanvasRenderingContext2D) => {
      canvasBgCtx.strokeStyle = '#ccc';
      canvasBgCtx.lineWidth = 1;

      canvasBgCtx.beginPath();
      // 横线
      for (let i = 1; i < 10; i++) {
        canvasBgCtx.moveTo(0, i * 20);
        canvasBgCtx.lineTo(canvasWidth.value, i * 20);
      }
      // 竖线
      for (let i = 1; i < 10; i++) {
        canvasBgCtx.moveTo(i * 20, 0);
        canvasBgCtx.lineTo(i * 20, canvasWidth.value);
      }
      canvasBgCtx.stroke();
      canvasBgCtx.closePath();
    };

    // 画圆
    const drawCircle = (canvasBgCtx: CanvasRenderingContext2D) => {
      const cWidth = canvasWidth.value;
      // radius: 半径
      const drawArc = (radius: number) =>
        canvasBgCtx.arc(cWidth / 2, cWidth / 2, radius, 0, 4 * Math.PI);

      // 外圈1
      canvasBgCtx.fillStyle = color.bg;
      canvasBgCtx.beginPath();
      drawArc(cWidth / 2 - 10);
      canvasBgCtx.fill('nonzero');
      canvasBgCtx.shadowBlur = 4;
      canvasBgCtx.shadowColor = 'rgba(100,100,100,0.2)';
      canvasBgCtx.shadowOffsetX = 1;
      canvasBgCtx.shadowOffsetY = 1;
      canvasBgCtx.closePath();

      // 外圈2
      canvasBgCtx.fillStyle = '#eee';
      canvasBgCtx.beginPath();
      drawArc(cWidth / 2 - 20);
      canvasBgCtx.fill('nonzero');
      canvasBgCtx.shadowBlur = 2;
      canvasBgCtx.closePath();

      // 内圈1
      canvasBgCtx.fillStyle = '#ddd';
      canvasBgCtx.beginPath();
      drawArc(25);
      canvasBgCtx.fill('nonzero');
      canvasBgCtx.closePath();

      // 内圈2
      canvasBgCtx.beginPath();
      drawArc(5);
      canvasBgCtx.strokeStyle = color.hangBg;
      canvasBgCtx.stroke();
      canvasBgCtx.closePath();
    };

    // 画数字
    const drawNumber = (canvasBgCtx: CanvasRenderingContext2D) => {
      const cWidth = canvasWidth.value;
      canvasBgCtx.fillStyle = color.text;
      canvasBgCtx.font = bigFont;
      canvasBgCtx.fillText('12', cWidth / 2 - 10, 38);

      canvasBgCtx.font = smallFont;
      canvasBgCtx.fillText('1', cWidth - 68, cWidth / 5 + 5);
      canvasBgCtx.fillText('2', cWidth - 45, cWidth / 3 + 5);

      canvasBgCtx.font = bigFont;
      canvasBgCtx.fillText('3', cWidth - 35, cWidth / 2 + 5);

      canvasBgCtx.font = smallFont;
      canvasBgCtx.fillText('4', cWidth - 45, (cWidth * 2) / 3 + 5);
      canvasBgCtx.fillText('5', cWidth - 68, (cWidth * 4) / 5 + 5);

      canvasBgCtx.font = bigFont;
      canvasBgCtx.fillText('6', cWidth / 2 - 4, cWidth - 25);

      canvasBgCtx.font = smallFont;
      canvasBgCtx.fillText('7', cWidth / 3 - 4, (cWidth * 4) / 5 + 5);
      canvasBgCtx.fillText('8', cWidth / 5 - 4, (cWidth * 2) / 3 + 5);

      canvasBgCtx.font = bigFont;
      canvasBgCtx.fillText('9', 25, cWidth / 2 + 5);

      canvasBgCtx.font = smallFont;
      canvasBgCtx.fillText('10', cWidth / 5 - 4, cWidth / 3 + 5);
      canvasBgCtx.fillText('11', cWidth / 3 - 4, cWidth / 5 + 5);
    };

    // 画指针
    const drawHand = () => {
      const cWidth = canvasWidth.value;
      const [hour, minute, second] = getTime();
      // const hour = 11;
      // const minute = 36;
      // const second = 5;

      // 时针
      const canvasHourCtx = canvasHourRef.value!.getContext('2d')!;
      const hourPoint = { x: cWidth / 2 - 4, y: cWidth / 2 - 8 };
      addShadow(canvasHourCtx);
      drawHandler(canvasHourCtx, getAngle(hour * 5 + (5 * minute) / 60), () => {
        canvasHourCtx.moveTo(hourPoint.x, hourPoint.y);
        canvasHourCtx.lineTo(hourPoint.x, hourPoint.y - 25);
        canvasHourCtx.lineTo(hourPoint.x + 8, hourPoint.y - 25);
        canvasHourCtx.lineTo(hourPoint.x + 8, hourPoint.y);
        canvasHourCtx.lineTo(hourPoint.x, hourPoint.y);
      });

      // 分针
      const canvasMinuteCtx = canvasMinuteRef.value!.getContext('2d')!;
      const munitePoint = { x: cWidth / 2 - 2, y: cWidth / 2 - 8 };
      addShadow(canvasMinuteCtx);
      drawHandler(canvasMinuteCtx, getAngle(minute + second / 60), () => {
        canvasMinuteCtx.moveTo(munitePoint.x, munitePoint.y);
        canvasMinuteCtx.lineTo(munitePoint.x, munitePoint.y - 35);
        canvasMinuteCtx.lineTo(munitePoint.x + 4, munitePoint.y - 35);
        canvasMinuteCtx.lineTo(munitePoint.x + 4, munitePoint.y);
        canvasMinuteCtx.lineTo(munitePoint.x, munitePoint.y);
      });

      // 秒针
      const canvasSecondCtx = canvasSecondRef.value!.getContext('2d')!;
      const secondPoint = {
        x: cWidth / 2 - 1.5,
        y: cWidth / 2 + 10,
      };
      addShadow(canvasSecondCtx);
      drawHandler(canvasSecondCtx, getAngle(second), () => {
        canvasSecondCtx.moveTo(secondPoint.x, secondPoint.y);
        canvasSecondCtx.lineTo(secondPoint.x, secondPoint.y - 60);
        canvasSecondCtx.lineTo(secondPoint.x + 3, secondPoint.y - 60);
        canvasSecondCtx.lineTo(secondPoint.x + 3, secondPoint.y);
        canvasSecondCtx.lineTo(secondPoint.x, secondPoint.y);
      });
    };

    // 时/分/秒的角度转换
    const getAngle = (rate: number) => (rate / 60) * 360 * (Math.PI / 180);

    // 阴影
    const addShadow = (ctx: CanvasRenderingContext2D) => {
      ctx.shadowBlur = 6;
      ctx.shadowColor = 'rgba(100,100,100,0.6)';
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 2;
    };

    // 指针绘制样式逻辑
    const drawHandler = (
      ctx: CanvasRenderingContext2D,
      angle: number,
      draw: () => void,
    ) => {
      const cWidth = canvasWidth.value;
      ctx.clearRect(0, 0, cWidth, cWidth);
      ctx.beginPath();
      ctx.fillStyle = color.hangBg;
      ctx.translate(cWidth / 2, cWidth / 2);
      ctx.rotate(angle);
      ctx.translate(-cWidth / 2, -cWidth / 2);
      draw();
      ctx.closePath();
      ctx.fill('nonzero');
      ctx.strokeStyle = color.handStrokeStyle;
      ctx.stroke();
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
      canvasBgRef,
      canvasHourRef,
      canvasMinuteRef,
      canvasSecondRef,
    };
  },
});
</script>

<style lang="less" scoped>
@import './styles.less';
</style>
