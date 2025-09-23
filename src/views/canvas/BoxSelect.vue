<template>
  <div class="box-select">
    <div class="box-select-btn">
      <ElColorPicker v-model="selectedColor" />
      <ElSelect v-model="drawType" placeholder="选择类型">
        <ElOption
          v-for="item in drawTypeOpts"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </ElSelect>
      <ElButton type="primary" @click="handleDraw">开始绘制</ElButton>
      <ElButton type="warning" @click="handleCancelDraw">取消绘制</ElButton>
      <ElButton type="danger" @click="handleClearAll">清除所有</ElButton>
      <ElButton type="info" title="前进" @click="handleForward">
        <el-icon><DArrowLeft /></el-icon>
      </ElButton>
      <ElButton type="info" title="后退" @click="handleBackward">
        <el-icon><DArrowRight /></el-icon>
      </ElButton>
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
import { ElSelect } from "element-plus";
import { ElButton } from "element-plus";
import { onMounted, ref, shallowReactive } from "vue";

import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash-es";

// 绘制类型选项
const drawTypeOpts = shallowReactive([
  {
    label: "矩形",
    value: "rect",
  },
  {
    label: "圆",
    value: "circle",
  },
  {
    label: "椭圆",
    value: "ellipse",
  },
] as const);

type DrawType = (typeof drawTypeOpts)[number]["value"];
interface Box {
  type: DrawType; // 绘制类型
  startX: number; // 起始点 x 坐标
  startY: number; // 起始点 y 坐标
  endX: number; // 结束点 x 坐标
  endY: number; // 结束点 y 坐标
  color: string; // 颜色
}
type DrawParams = Omit<Box, "type">;
// 所有绘制的选择框
const boxes = ref<Box[]>([]);
// 缓存绘制的选择框
const cacheBoxes = ref<Box[]>([]);
// canvas 元素
const canvasRef = ref<HTMLCanvasElement>();
// canvas 上下文
let ctx: CanvasRenderingContext2D | null = null;
// 鼠标指针样式
const cursorVal = ref("default");
// 选中的颜色
const selectedColor = ref("#ff0000");
// 绘制类型
const drawType = ref<DrawType>("rect");
onMounted(() => {
  ctx = canvasRef.value?.getContext("2d") ?? null;
});

/**
 * 开始绘制
 */
const handleDraw = () => {
  if (!ctx) return;
  cursorVal.value = "crosshair";
};

/**
 * 取消绘制
 */
const handleCancelDraw = () => {
  if (!ctx) return;
  cursorVal.value = "default";
};

/**
 * 清除所有选择框
 */
const handleClearAll = () => {
  if (!ctx) return;
  boxes.value = [];
  cacheBoxes.value = [];
  // ctx.reset(); // chrome 99 以上版本支持
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

/**
 * 前进
 */
const handleForward = () => {
  if (boxes.value.length === 0) {
    ElMessage.warning("没有可以前进的步骤！");
    return;
  }
  boxes.value.pop();
  drawAllBoxes();
};

/**
 * 后退
 */
const handleBackward = () => {
  const len = boxes.value.length;
  if (cacheBoxes.value.length === len) {
    ElMessage.warning("没有可以后退的步骤！");
    return;
  }
  const box = cacheBoxes.value[len];
  boxes.value.push(box);
  drawAllBoxes();
};

/**
 * 绘制矩形
 * @param drawParams
 */
const drawRect = (drawParams: DrawParams) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  ctx.strokeRect(
    drawParams.startX,
    drawParams.startY,
    drawParams.endX - drawParams.startX,
    drawParams.endY - drawParams.startY
  );
  ctx.closePath();
};

/**
 * 绘制圆
 * @param drawParams 绘制参数
 */
const drawCircle = (drawParams: DrawParams) => {
  if (!ctx) return;
  const radius =
    Math.sqrt(
      (drawParams.endX - drawParams.startX) ** 2 +
        (drawParams.endY - drawParams.startY) ** 2
    ) / 2;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  ctx.arc(
    drawParams.startX + (drawParams.endX - drawParams.startX) / 2,
    drawParams.startY + (drawParams.endY - drawParams.startY) / 2,
    radius,
    0,
    2 * Math.PI
  );
  ctx.stroke();
  ctx.closePath();
};

/**
 * 绘制椭圆
 * @param drawParams 绘制参数
 */
const drawEllipse = (drawParams: DrawParams) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  ctx.ellipse(
    drawParams.startX + (drawParams.endX - drawParams.startX) / 2,
    drawParams.startY + (drawParams.endY - drawParams.startY) / 2,
    Math.abs(drawParams.endX - drawParams.startX) / 2,
    Math.abs(drawParams.endY - drawParams.startY) / 2,
    0,
    0,
    2 * Math.PI
  );
  ctx.stroke();
  ctx.closePath();
};

/**
 * 绘制形状
 * @param drawType 绘制类型
 * @param drawParams 绘制参数
 */
const drawShape = (drawType: DrawType, drawParams: DrawParams) => {
  if (!ctx) return;
  switch (drawType) {
    case "rect":
      drawRect(drawParams);
      break;
    case "circle":
      drawCircle(drawParams);
      break;
    case "ellipse":
      drawEllipse(drawParams);
      break;
    default:
      break;
  }
};

/**
 * 绘制所有选择框
 */
const drawAllBoxes = () => {
  if (!ctx) return;
  // ctx.reset() // chrome 99 以上版本支持
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  boxes.value.forEach((box) => {
    drawShape(box.type, box);
  });
};

// 是否正在绘制
const mouseIsDown = ref(false);
// 起始点
const startPoint = ref<{ x: number; y: number } | null>(null);

/**
 * 鼠标按下事件
 * @param e
 */
const handleMouseDown = (e: MouseEvent) => {
  if (!ctx) return;
  if (cursorVal.value !== "crosshair") return;
  mouseIsDown.value = true;
  const { offsetX, offsetY } = e;
  startPoint.value = { x: offsetX, y: offsetY };
};

/**
 * 鼠标移动事件
 * @param e
 */
const handleMouseMove = (e: MouseEvent) => {
  if (!ctx) return;
  if (!mouseIsDown.value) return;
  if (!startPoint.value) return;
  const { offsetX, offsetY } = e;
  const { x: startX, y: startY } = startPoint.value;
  drawAllBoxes();
  drawShape(drawType.value, {
    startX,
    startY,
    endX: offsetX,
    endY: offsetY,
    color: selectedColor.value,
  });
};

/**
 * 鼠标松开事件
 * @param e
 */
const handleMouseUp = (e: MouseEvent) => {
  if (!ctx) return;
  if (cursorVal.value !== "crosshair") return;
  const { offsetX, offsetY } = e;
  const { x: startX, y: startY } = startPoint.value ?? { x: 0, y: 0 };
  boxes.value.push({
    type: drawType.value,
    startX,
    startY,
    endX: offsetX,
    endY: offsetY,
    color: selectedColor.value,
  });
  cacheBoxes.value = cloneDeep(boxes.value);
  mouseIsDown.value = false;
  startPoint.value = null;
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

    .el-select {
      width: 120px;
    }

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
