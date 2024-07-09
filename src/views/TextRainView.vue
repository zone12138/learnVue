<template>
  <div ref="canvasContainer">
    <canvas ref="canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
const canvasContainer = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | null;
const fontSize = 14;
let column: number;
let charIndex: Array<number>;

onMounted(() => {
  const width: number = canvasContainer.value!.clientWidth;
  const height: number = canvasContainer.value!.clientHeight;
  ctx = canvas.value!.getContext("2d");
  canvas.value!.height = height;
  canvas.value!.width = width;
  column = Math.floor(width / fontSize);
  charIndex = Array.from({ length: column }, () => 0);
  draw();
  setInterval(draw, 30);
});

const draw = () => {
  ctx!.fillStyle = "rgba(0,0,0,0.1)";
  ctx!.fillRect(0, 0, canvas.value!.width, canvas.value!.height);
  ctx!.fillStyle = "#00ff00";
  ctx!.textBaseline = "top";
  ctx!.font = "14px sans-serif";

  for (let i = 0; i < column; i++) {
    ctx?.fillText(getRandomChar(), i * fontSize, charIndex[i] * fontSize);
    if (
      charIndex[i] * fontSize > canvas.value!.height &&
      Math.random() > 0.99
    ) {
      charIndex[i] = 0;
    } else {
      charIndex[i]++;
    }
  }
};

const getRandomChar = () => {
  const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
  return chars[Math.floor(Math.random() * chars.length)];
};
</script>

<style lang="scss" scoped>
div {
  height: 100%;
  width: 100%;
}
</style>
