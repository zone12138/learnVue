<template>
  <div class="box-select">
    <div class="box-select-btn">
      <ElColorPicker v-model="selectedColor" />
      <ElButton @click="handleSelectBox">选择框</ElButton>
      <ElButton @click="handleSelectCircle">选择圆</ElButton>
      <ElButton @click="handleCancelSelectBox">取消选择</ElButton>
      <ElButton @click="handleClearAll">清除所有</ElButton>
    </div>
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
import { ElButton } from "element-plus";
import { onMounted, ref } from "vue";

type SelectType = 'rect' | 'circle';

interface Box {
  type: SelectType;
  startX: number;
  startY: number;
  width: number;
  height: number;
  color: string;
}
// 所有选择框
const boxes = ref<Box[]>([]);
// canvas 元素
const canvasRef = ref<HTMLCanvasElement>();
// canvas 上下文
let ctx: CanvasRenderingContext2D | null = null;
// 鼠标指针样式
const cursorVal = ref('default');
// 选中的颜色
const selectedColor = ref('#ff0000');
// 选中的类型
const selectType = ref('rect');

onMounted(() => {
  ctx = canvasRef.value?.getContext("2d") ?? null;
});

/**
 * 选择框
 */
const handleSelectBox = () => {
  if (!ctx) return;
  cursorVal.value = 'crosshair';
  selectType.value = 'rect';
};

/**
 * 选择圆
 */
const handleSelectCircle = () => {
  if (!ctx) return;
  cursorVal.value = 'crosshair';
  selectType.value = 'circle';
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
  ctx.strokeStyle = selectedColor.value;
  ctx.strokeRect(startX, startY, width, height);
};

/**
 * 鼠标松开事件
 * @param e 
 */
const handleMouseUp = (e: MouseEvent) => {
  if (!ctx) return;
  if (cursorVal.value !== 'crosshair') return;
  const { offsetX, offsetY } = e;
  const { x: startX, y: startY } = selectBoxStartPoint.value ?? { x: 0, y: 0 };
  boxes.value.push({
    type: selectType.value as SelectType,
    startX,
    startY,
    width: offsetX - startX,
    height: offsetY - startY,
    color: selectedColor.value,
  });
  mouseIsDown.value = false;
  selectBoxStartPoint.value = null;
};
</script>

<style>
.box-select {
  width: 100%;
  height: 100%;

  .box-select-btn {
    display: flex;
    gap: 16px;
    margin-bottom: 10px;

    .el-button {
      margin: 0;
    }
  }

  canvas {
    background-color: black;
    cursor: v-bind(cursorVal);
  }
}
</style>
