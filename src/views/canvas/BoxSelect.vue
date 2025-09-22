<template>
  <div class="box-select">
    <ElButton @click="handleSelectBox">选择框</ElButton>
    <ElButton @click="handleCancelSelectBox">取消选择</ElButton>
    <ElButton @click="handleClearAll">清除所有</ElButton>
    <canvas
      width="1200"
      height="600"
      ref="canvasRef"
      @mousedown="handleMouseDown"
      @mousemove="handleMouseMove"
      @mouseup="handleMouseUp"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { ElButton } from "element-plus";

interface Box {
  startX: number;
  startY: number;
  width: number;
  height: number;
  color: string;
}
const boxes = ref<Box[]>([]);

const canvasRef = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | null = null;
const cursorVal = ref('default');

onMounted(() => {
  ctx = canvasRef.value?.getContext("2d") ?? null;
});

/**
 * 选择框
 */
const handleSelectBox = () => {
  if (!ctx) return;
  cursorVal.value = 'crosshair';
};

/**
 * 取消选择框
 */
const handleCancelSelectBox = () => {
  if (!ctx) return;
  cursorVal.value = 'default';
};

/**
 * 清除所有选择框
 */
const handleClearAll = () => {
  if (!ctx) return;
  boxes.value = [];
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}

/**
 * 绘制所有选择框
 */
const drawAllBoxes = () => {
  boxes.value.forEach(box => {
    if (ctx) {
      ctx.strokeStyle = box.color;
      ctx.strokeRect(box.startX, box.startY, box.width, box.height);
    }
  });
}

// 选择框是否正在绘制
const mouseIsDown = ref(false);
// 选择框起始点
const selectBoxStartPoint = ref<{ x: number; y: number } | null>(null);

/**
 * 鼠标按下事件
 * @param e 
 */
const handleMouseDown = (e: MouseEvent) => {
  if (!ctx) return;
  if (cursorVal.value !== 'crosshair') return;
  mouseIsDown.value = true;
  const { offsetX, offsetY } = e;
  selectBoxStartPoint.value = { x: offsetX, y: offsetY };
};

/**
 * 鼠标移动事件
 * @param e 
 */
const handleMouseMove = (e: MouseEvent) => {
  if (!ctx) return;
  if (!mouseIsDown.value) return;
  if (!selectBoxStartPoint.value) return;
  const { offsetX, offsetY } = e;
  const { x: startX, y: startY } = selectBoxStartPoint.value;
  const width = offsetX - startX;
  const height = offsetY - startY;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  drawAllBoxes();
  ctx.strokeStyle = 'red';
  ctx.strokeRect(startX, startY, width, height);
};

/**
 * 鼠标松开事件
 * @param e 
 */
const handleMouseUp = (e: MouseEvent) => {
  if (!ctx) return;
  const { offsetX, offsetY } = e;
  const { x: startX, y: startY } = selectBoxStartPoint.value ?? { x: 0, y: 0 };
  boxes.value.push({
    startX,
    startY,
    width: offsetX - startX,
    height: offsetY - startY,
    color: 'red',
  });
  mouseIsDown.value = false;
  selectBoxStartPoint.value = null;
};
</script>

<style>
.box-select {
  width: 100%;
  height: 100%;

  canvas {
    background-color: black;
    cursor: v-bind(cursorVal);
  }
}
</style>
