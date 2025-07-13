<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-10 09:26:22
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-11 11:59:31
 * @FilePath: \vue3-project\src\views\TextRainView.vue
 * @Description: 文字雨
-->
<template>
  <div ref="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {
  ref,
  onMounted,
  onActivated,
  onDeactivated,
  onBeforeUnmount,
  defineOptions
} from "vue";
const canvasContainer = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | null;
const fontSize = 14 * devicePixelRatio;
let column: number;
let charIndex: Array<number>;
let timer: number;

defineOptions({
  name: '文字雨'
})

onMounted(() => {
  console.log("onMounted");
});

onActivated(() => {
  console.log("onActivated");
  init();
});

onDeactivated(() => {
  console.log("onDeactivated");
  clearInterval(timer);
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
  clearInterval(timer);
});

const init = () => {
  if (!canvasContainer.value) return;
  if (!canvas.value) return;
  ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  const height = canvasContainer.value.clientHeight;
  const width = canvasContainer.value.clientWidth;
  canvas.value.style.height = height + "px";
  canvas.value.style.width = width + "px";
  canvas.value.height = height * devicePixelRatio;
  canvas.value.width = width * devicePixelRatio;
  ctx.scale(devicePixelRatio, devicePixelRatio);
  column = Math.floor(canvas.value.width / fontSize);
  charIndex = Array.from({ length: column }, () => 0);
  draw();
  timer = window.setInterval(draw, 30);
};

const draw = () => {
  if (!ctx || !canvas.value) return;
  ctx.fillStyle = "rgba(0,0,0,0.1)";
  ctx?.fillRect(0, 0, canvas.value.width, canvas.value.height);
  ctx.fillStyle = "#00ff00";
  ctx.textBaseline = "top";
  ctx.font = `${fontSize}px sans-serif`;

  for (let i = 0; i < column; i++) {
    ctx?.fillText(getRandomChar(), i * fontSize, charIndex[i] * fontSize);
    if (charIndex[i] * fontSize > canvas.value.height && Math.random() > 0.99) {
      charIndex[i] = 0;
    } else {
      charIndex[i]++;
    }
  }
};

const getRandomChar = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  return chars[Math.floor(Math.random() * chars.length)];
};
</script>

<style lang="scss" scoped>
div {
  height: 100%;
  width: 100%;
}
</style>
