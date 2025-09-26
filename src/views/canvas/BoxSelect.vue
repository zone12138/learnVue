<template>
  <div class="box-select">
    <div class="box-select-btn">
      <ElColorPicker v-model="selectedColor" />
      <ElSelect v-model="drawType" placeholder="选择类型">
        <ElOption
          v-for="{ label, value } in drawTypeOpts"
          :key="value"
          :label="label"
          :value="value"
        />
      </ElSelect>
      <ElButton type="primary" :disabled="isDrawShape" @click="handleDraw">
        <Icon icon="fluent:pen-28-regular" />
        开始绘制
      </ElButton>
      <ElButton
        type="warning"
        :disabled="!isDrawShape"
        @click="handleCancelDraw"
      >
        <Icon icon="fluent:pen-prohibited-28-regular" />
        取消绘制
      </ElButton>
      <ElButton type="danger" @click="handleClearAll">
        <Icon icon="fluent:pen-sync-28-regular" />
        清除所有
      </ElButton>
      <ElButton type="info" circle title="前进" @click="handleForward">
        <el-icon><DArrowLeft /></el-icon>
      </ElButton>
      <ElButton type="info" circle title="后退" @click="handleBackward">
        <el-icon><DArrowRight /></el-icon>
      </ElButton>
    </div>
    <div ref="containerRef" class="canvas-container">
      <canvas
        ref="canvasRef"
        :width="canvasWidth"
        :height="canvasHeight"
      ></canvas>
      <!-- 增加一层防止右键复制canvas -->
      <canvas
        class="upper-canvas"
        :width="canvasWidth"
        :height="canvasHeight"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
      ></canvas>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash-es";
import { Icon } from "@iconify/vue";

// 画布高度
const canvasHeight = ref(600);
// 画布宽度
const canvasWidth = ref(1200);

// 绘制类型选项
const drawTypeOpts = [
  { label: "矩形", value: "rect" },
  { label: "圆", value: "circle" },
  { label: "椭圆", value: "ellipse" },
] as const;
// 绘制类型
type DrawType = (typeof drawTypeOpts)[number]["value"];
// 图型参数
interface Box {
  type: DrawType; // 绘制类型
  startX: number; // 起始点 x 坐标
  startY: number; // 起始点 y 坐标
  endX: number; // 结束点 x 坐标
  endY: number; // 结束点 y 坐标
  color: string; // 颜色
}
// 绘制参数
type DrawParams = Omit<Box, "type">;
// 当前绘制的所有图型
let boxes: Box[] = [];
// 缓存所有步骤中绘制的图型
let cacheBoxes: Box[][] = [];
// 当前绘制步骤索引
let stepIdx = -1;
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
// 是否正在绘制
const isDrawShape = ref(false);
// 绘制时的起始点
let drawStartPoint: { x: number; y: number } | null = null;
// 是否悬停在上图型上
let isHoverShape = false;
// 悬停时选中的索引
let selectedIdx = -1;
// 是否正在拖动图型
let isDraggingShape = false;
// 拖动时的起始点
let dragStartPoint: { x: number; y: number } | null = null;

const containerRef = ref<HTMLDivElement>();
let pixelRatio = 1, observer: ResizeObserver | null = null;

/**
 * 监听容器大小变化，调整 canvas 大小
 */
const resizeCanvas = () => {
  console.log("resizeCanvas");
  if (!containerRef.value || !ctx) return;
  const newPixelRatio = window.devicePixelRatio || 1;
  if (newPixelRatio === pixelRatio) return;
  pixelRatio = 1 / newPixelRatio;
  canvasHeight.value *= pixelRatio;
  canvasWidth.value *= pixelRatio;
  ctx.scale(pixelRatio, pixelRatio);
  drawAllBoxes();
};


onMounted(() => {
  ctx = canvasRef.value?.getContext("2d") ?? null;
  // if (!containerRef.value) return;
  // observer = new ResizeObserver(resizeCanvas);
  // observer.observe(containerRef.value);
});

// onUnmounted(() => {
//   observer?.disconnect();
// });

/**
 * 开始绘制
 */
const handleDraw = () => {
  if (!ctx) return;
  isDrawShape.value = true;
  isDraggingShape = isHoverShape = false;
  cursorVal.value = "crosshair";
};

/**
 * 取消绘制
 */
const handleCancelDraw = () => {
  if (!ctx) return;
  isDrawShape.value = false;
  cursorVal.value = "default";
};

/**
 * 清除画布
 */
const clearCanvas = () => {
  if (!ctx) return;
  // ctx.reset(); // chrome 99 以上版本支持
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
};

/**
 * 清除所有图型
 */
const handleClearAll = () => {
  clearCanvas();
  boxes = [];
  cacheBoxes = [];
};

/**
 * 前进
 */
const handleForward = () => {
  if (stepIdx < 0) {
    ElMessage.warning("没有可以前进的步骤！");
    return;
  }
  boxes = cloneDeep(cacheBoxes[--stepIdx]) ?? [];
  drawAllBoxes();
};

/**
 * 后退
 */
const handleBackward = () => {
  if (cacheBoxes.length <= stepIdx + 1) {
    ElMessage.warning("没有可以后退的步骤！");
    return;
  }
  boxes = cloneDeep(cacheBoxes[++stepIdx]);
  drawAllBoxes();
};

/**
 * 绘制矩形
 * @param drawParams 绘制参数
 * @param isHoverShape 是否悬停在图型上
 */
const drawRect = (drawParams: DrawParams, isHoverShape?: boolean) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  ctx.setLineDash(isHoverShape ? [5, 5] : []);
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
 * @param isHoverShape 是否悬停在图型上
 */
const drawCircle = (drawParams: DrawParams, isHoverShape?: boolean) => {
  if (!ctx) return;
  const radius =
    Math.sqrt(
      (drawParams.endX - drawParams.startX) ** 2 +
        (drawParams.endY - drawParams.startY) ** 2
    ) / 2;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  ctx.setLineDash(isHoverShape ? [5, 5] : []);
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
 * @param isHoverShape 是否悬停在图型上
 */
const drawEllipse = (drawParams: DrawParams, isHoverShape?: boolean) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  ctx.setLineDash(isHoverShape ? [5, 5] : []);
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
 * @param isHoverShape 是否悬停在图型上
 */
const drawShape = (
  drawType: DrawType,
  drawParams: DrawParams,
  isHoverShape?: boolean
) => {
  if (!ctx) return;
  switch (drawType) {
    case "rect":
      drawRect(drawParams, isHoverShape);
      break;
    case "circle":
      drawCircle(drawParams, isHoverShape);
      break;
    case "ellipse":
      drawEllipse(drawParams, isHoverShape);
      break;
    default:
      break;
  }
};

/**
 * 检查点是否在矩形内
 * @param x 点的x坐标
 * @param y 点的y坐标
 * @param rect 矩形
 */
const isPointInRect = (x: number, y: number, rect: Box): boolean => {
  const minX = Math.min(rect.startX, rect.endX);
  const minY = Math.min(rect.startY, rect.endY);
  const maxX = Math.max(rect.startX, rect.endX);
  const maxY = Math.max(rect.startY, rect.endY);
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};

/**
 * 检查点是否在圆内
 * @param x 点的x坐标
 * @param y 点的y坐标
 * @param circle 圆
 */
const isPointInCircle = (x: number, y: number, circle: Box): boolean => {
  const centerX = (circle.startX + circle.endX) / 2;
  const centerY = (circle.startY + circle.endY) / 2;
  const radius =
    Math.sqrt(
      Math.pow(circle.endX - circle.startX, 2) +
        Math.pow(circle.endY - circle.startY, 2)
    ) / 2;

  const distance = Math.sqrt(
    Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2)
  );
  return distance <= radius;
};

/**
 * 检查点是否在椭圆内
 * @param x 点的x坐标
 * @param y 点的y坐标
 * @param ellipse 椭圆
 */
const isPointInEllipse = (x: number, y: number, ellipse: Box): boolean => {
  const centerX = ellipse.startX + (ellipse.endX - ellipse.startX) / 2;
  const centerY = ellipse.startY + (ellipse.endY - ellipse.startY) / 2;
  const radiusX = Math.abs(ellipse.endX - ellipse.startX) / 2;
  const radiusY = Math.abs(ellipse.endY - ellipse.startY) / 2;

  if (radiusX === 0 || radiusY === 0) return false;

  const normalizedX = (x - centerX) / radiusX;
  const normalizedY = (y - centerY) / radiusY;

  return normalizedX * normalizedX + normalizedY * normalizedY <= 1;
};

/**
 * 检查点是否在形状内
 * @param x 点的x坐标
 * @param y 点的y坐标
 * @param shape 形状
 */
const isPointInShape = (x: number, y: number, shape: Box): boolean => {
  switch (shape.type) {
    case "rect":
      return isPointInRect(x, y, shape);
    case "circle":
      return isPointInCircle(x, y, shape);
    case "ellipse":
      return isPointInEllipse(x, y, shape);
    default:
      return false;
  }
};

/**
 * 查找指定点所在的图型索引
 * @param x 点的x坐标
 * @param y 点的y坐标
 */
const findBoxIdxAtPoint = (x: number, y: number): number => {
  for (let i = 0; i < boxes.length; i++) {
    const box = boxes[i];
    if (isPointInShape(x, y, box)) {
      return i;
    }
  }
  return -1;
};

/**
 * 绘制所有图型
 * @param boxList 图型列表
 */
const drawAllBoxes = (boxList: Box[] = boxes) => {
  clearCanvas();
  boxList.forEach((box, idx) => {
    drawShape(box.type, box, idx === selectedIdx);
  });
};

/**
 * 鼠标按下事件
 * @param e 鼠标事件
 */
const handleMouseDown = (e: MouseEvent) => {
  if (!ctx) return;
  const { offsetX, offsetY } = e;
  if (isDrawShape.value) {
    drawStartPoint = { x: offsetX, y: offsetY };
    return;
  }
  if (isHoverShape) {
    if (selectedIdx > -1) {
      dragStartPoint = { x: offsetX, y: offsetY };
      isDraggingShape = true;
      cursorVal.value = "move";
    }
  }
};

/**
 * 鼠标移动事件
 * @param e 鼠标事件
 */
const handleMouseMove = (e: MouseEvent) => {
  if (!ctx) return;
  const { offsetX, offsetY } = e;
  if (isDrawShape.value) {
    if (drawStartPoint) {
      const { x: startX, y: startY } = drawStartPoint;
      drawAllBoxes();
      drawShape(drawType.value, {
        startX,
        startY,
        endX: offsetX,
        endY: offsetY,
        color: selectedColor.value,
      });
    }
  } else if (isDraggingShape) {
    if (dragStartPoint) {
      const { x: dragStartX, y: dragStartY } = dragStartPoint;
      boxes[selectedIdx].startX += offsetX - dragStartX;
      boxes[selectedIdx].startY += offsetY - dragStartY;
      boxes[selectedIdx].endX += offsetX - dragStartX;
      boxes[selectedIdx].endY += offsetY - dragStartY;
      drawAllBoxes();
      dragStartPoint = { x: offsetX, y: offsetY };
    }
  } else {
    selectedIdx = findBoxIdxAtPoint(offsetX, offsetY);
    isHoverShape = selectedIdx > -1;
    drawAllBoxes();
  }
};

/**
 * 鼠标松开事件
 * @param e 鼠标事件
 */
const handleMouseUp = (e: MouseEvent) => {
  if (!ctx) return;
  if (isDrawShape.value) {
    const { offsetX, offsetY } = e;
    const { x: startX, y: startY } = drawStartPoint ?? { x: 0, y: 0 };
    boxes.push({
      type: drawType.value,
      startX,
      startY,
      endX: offsetX,
      endY: offsetY,
      color: selectedColor.value,
    });
    cacheBoxes = cacheBoxes.slice(0, ++stepIdx);
    cacheBoxes.push(cloneDeep(boxes));
  } else if (isDraggingShape) {
    const draggingShape = boxes[selectedIdx];
    boxes.splice(selectedIdx, 1);
    boxes.push(draggingShape);
    cacheBoxes.push(cloneDeep(boxes));
    stepIdx = cacheBoxes.length - 1;
    cursorVal.value = "default";
  }
  drawStartPoint = null;
  dragStartPoint = null;
  isDraggingShape = false;
};
</script>

<style scoped>
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

  .canvas-container {
    position: relative;
    canvas {
      position: relative;
      height: v-bind(canvasHeight + 'px');
      width: v-bind(canvasWidth + 'px');
      background-color: #000;
      cursor: v-bind(cursorVal);

      &.upper-canvas {
        position: absolute;
        top: 0;
        left: 0;
        background-color: transparent;
      }
    }
  }
}
</style>
