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

import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash-es";
import { Icon } from "@iconify/vue";

// 绘制类型选项
const drawTypeOpts = [
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
] as const;
// 绘制类型
type DrawType = (typeof drawTypeOpts)[number]["value"];
// 选择框
interface Box {
  type: DrawType; // 绘制类型
  startX: number; // 起始点 x 坐标
  startY: number; // 起始点 y 坐标
  endX: number; // 结束点 x 坐标
  endY: number; // 结束点 y 坐标
  color: string; // 颜色
  selected?: boolean; // 是否选中
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
// 是否正在绘制
const isDrawShape = ref(false);
// 绘制时的起始点
const startPoint = ref<{ x: number; y: number } | null>(null);
// 是否悬停在选择框上
const isHoverShape = ref(false);
// 悬停时选中的索引
const selectedIdx = ref<number>(-1);
// 是否正在拖动选择框
const isDraggingShape = ref(false);
// 拖动时的起始点
const dragStartPoint = ref<{ x: number; y: number } | null>(null);

onMounted(() => {
  ctx = canvasRef.value?.getContext("2d") ?? null;
});

/**
 * 开始绘制
 */
const handleDraw = () => {
  if (!ctx) return;
  isDrawShape.value = true;
  isDraggingShape.value = isHoverShape.value = false;
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
 * @param drawParams 绘制参数
 */
const drawRect = (drawParams: DrawParams, isHoverShape?: boolean) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  if (isHoverShape) {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }
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
const drawCircle = (drawParams: DrawParams, isHoverShape?: boolean) => {
  if (!ctx) return;
  const radius =
    Math.sqrt(
      (drawParams.endX - drawParams.startX) ** 2 +
        (drawParams.endY - drawParams.startY) ** 2
    ) / 2;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  if (isHoverShape) {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }
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
const drawEllipse = (drawParams: DrawParams, isHoverShape?: boolean) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  if (isHoverShape) {
    ctx.setLineDash([5, 5]);
  } else {
    ctx.setLineDash([]);
  }
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
 * 查找指定点所在的选择框索引
 * @param x 点的x坐标
 * @param y 点的y坐标
 */
const findBoxIdxAtPoint = (x: number, y: number): number => {
  for (let i = 0; i < boxes.value.length; i++) {
    const box = boxes.value[i];
    if (isPointInShape(x, y, box)) {
      return i;
    }
  }
  return -1;
};

/**
 * 绘制所有选择框
 * @param boxList 选择框列表
 */
const drawAllBoxes = (boxList: Box[] = boxes.value) => {
  if (!ctx) return;
  // ctx.reset() // chrome 99 以上版本支持
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  boxList.forEach((box, idx) => {
    drawShape(box.type, box, idx === selectedIdx.value);
  });
};

/**
 * 鼠标按下事件
 * @param e
 */
const handleMouseDown = (e: MouseEvent) => {
  if (!ctx) return;
  const { offsetX, offsetY } = e;
  if (isDrawShape.value) {
    startPoint.value = { x: offsetX, y: offsetY };
    return;
  }
  if (isHoverShape.value) {
    if (selectedIdx.value > -1) {
      dragStartPoint.value = { x: offsetX, y: offsetY };
      isDraggingShape.value = true;
      cursorVal.value = "move";
    }
  }
};

/**
 * 鼠标移动事件
 * @param e
 */
const handleMouseMove = (e: MouseEvent) => {
  if (!ctx) return;
  const { offsetX, offsetY } = e;
  if (isDrawShape.value) {
    if (startPoint.value) {
      const { x: startX, y: startY } = startPoint.value;
      drawAllBoxes();
      drawShape(drawType.value, {
        startX,
        startY,
        endX: offsetX,
        endY: offsetY,
        color: selectedColor.value,
      });
    }
  } else if (isDraggingShape.value) {
    if (dragStartPoint.value) {
      const { x: dragStartX, y: dragStartY } = dragStartPoint.value;
      boxes.value[selectedIdx.value].startX += offsetX - dragStartX;
      boxes.value[selectedIdx.value].startY += offsetY - dragStartY;
      boxes.value[selectedIdx.value].endX += offsetX - dragStartX;
      boxes.value[selectedIdx.value].endY += offsetY - dragStartY;
      drawAllBoxes();
      dragStartPoint.value = { x: offsetX, y: offsetY };
    }
  } else {
    selectedIdx.value = findBoxIdxAtPoint(offsetX, offsetY);
    isHoverShape.value = selectedIdx.value > -1;
    drawAllBoxes();
  }
};

/**
 * 鼠标松开事件
 * @param e
 */
const handleMouseUp = (e: MouseEvent) => {
  if (!ctx) return;
  if (isDrawShape.value) {
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
  } else if (isDraggingShape.value) {
    // dragStartPoint.value = null;
    // isDraggingShape.value = false;
    // cursorVal.value = "default";
  }
  startPoint.value = null;
  dragStartPoint.value = null;
  isDraggingShape.value = false;
  cursorVal.value = "default";
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

  canvas {
    background-color: black;
    cursor: v-bind(cursorVal);
  }
}
</style>
