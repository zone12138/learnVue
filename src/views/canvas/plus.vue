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
      <ElButton
        type="primary"
        :disabled="cursorVal !== 'default'"
        @click="handleDraw"
      >
        <Icon icon="fluent:pen-28-regular" />
        开始绘制
      </ElButton>
      <ElButton
        type="warning"
        :disabled="cursorVal === 'default'"
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
      @mouseleave="handleMouseLeave"
    ></canvas>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, computed } from "vue";

import { DArrowLeft, DArrowRight } from "@element-plus/icons-vue";
import { ElMessage } from "element-plus";
import { cloneDeep } from "lodash-es";
import { Icon } from "@iconify/vue";

// 绘制类型选项
const drawTypeOpts = [
  { label: "矩形", value: "rect" },
  { label: "圆", value: "circle" },
  { label: "椭圆", value: "ellipse" }
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
const mouseIsDown = ref(false);

// 起始点
const startPoint = ref<{ x: number; y: number } | null>(null);

// 新增：当前悬浮的图形索引
const hoveredBoxIndex = ref<number | null>(null);

// 新增：当前选中的图形索引
const selectedBoxIndex = ref<number | null>(null);

// 新增：拖拽偏移量
const dragOffset = ref<{ x: number; y: number } | null>(null);

// 计算属性：当前的光标样式
const canvasCursor = computed(() => {
  if (cursorVal.value === "crosshair") return "crosshair";
  if (hoveredBoxIndex.value !== null || selectedBoxIndex.value !== null) return "move";
  return "default";
});

onMounted(() => {
  ctx = canvasRef.value?.getContext("2d") ?? null;
});

/**
 * 开始绘制
 */
const handleDraw = () => {
  if (!ctx) return;
  cursorVal.value = "crosshair";
  selectedBoxIndex.value = null; // 取消选中状态
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
  hoveredBoxIndex.value = null;
  selectedBoxIndex.value = null;
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
 * @param isDashed 是否虚线
 */
const drawRect = (drawParams: DrawParams, isDashed = false) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  
  // 设置虚线样式
  if (isDashed) {
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
 * @param isDashed 是否虚线
 */
const drawCircle = (drawParams: DrawParams, isDashed = false) => {
  if (!ctx) return;
  const radius = Math.sqrt(
    Math.pow(drawParams.endX - drawParams.startX, 2) + 
    Math.pow(drawParams.endY - drawParams.startY, 2)
  ) / 2;
  
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  
  // 设置虚线样式
  if (isDashed) {
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
 * @param isDashed 是否虚线
 */
const drawEllipse = (drawParams: DrawParams, isDashed = false) => {
  if (!ctx) return;
  ctx.beginPath();
  ctx.strokeStyle = drawParams.color;
  
  // 设置虚线样式
  if (isDashed) {
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
 * @param isDashed 是否虚线
 */
const drawShape = (drawType: DrawType, drawParams: DrawParams, isDashed = false) => {
  if (!ctx) return;
  switch (drawType) {
    case "rect":
      drawRect(drawParams, isDashed);
      break;
    case "circle":
      drawCircle(drawParams, isDashed);
      break;
    case "ellipse":
      drawEllipse(drawParams, isDashed);
      break;
    default:
      break;
  }
};

/**
 * 检查点是否在矩形内
 */
const isPointInRect = (x: number, y: number, rect: Box): boolean => {
  const minX = Math.min(rect.startX, rect.endX);
  const maxX = Math.max(rect.startX, rect.endX);
  const minY = Math.min(rect.startY, rect.endY);
  const maxY = Math.max(rect.startY, rect.endY);
  
  return x >= minX && x <= maxX && y >= minY && y <= maxY;
};

/**
 * 检查点是否在圆内
 */
const isPointInCircle = (x: number, y: number, circle: Box): boolean => {
  const centerX = circle.startX + (circle.endX - circle.startX) / 2;
  const centerY = circle.startY + (circle.endY - circle.startY) / 2;
  const radius = Math.sqrt(
    Math.pow(circle.endX - circle.startX, 2) + 
    Math.pow(circle.endY - circle.startY, 2)
  ) / 2;
  
  const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
  return distance <= radius;
};

/**
 * 检查点是否在椭圆内
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
 * 检查点是否在图形内
 */
const isPointInShape = (x: number, y: number, box: Box): boolean => {
  switch (box.type) {
    case "rect":
      return isPointInRect(x, y, box);
    case "circle":
      return isPointInCircle(x, y, box);
    case "ellipse":
      return isPointInEllipse(x, y, box);
    default:
      return false;
  }
};

/**
 * 查找鼠标指向的图形索引
 */
const findBoxAtPoint = (x: number, y: number): number | null => {
  // 从后往前查找，优先选择上层图形
  for (let i = boxes.value.length - 1; i >= 0; i--) {
    if (isPointInShape(x, y, boxes.value[i])) {
      return i;
    }
  }
  return null;
};

/**
 * 绘制所有选择框
 */
const drawAllBoxes = () => {
  if (!ctx) return;
  
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  
  // 绘制所有图形
  boxes.value.forEach((box, index) => {
    // 如果是选中的图形，绘制虚线
    const isSelected = index === selectedBoxIndex.value;
    drawShape(box.type, box, isSelected);
  });
  
  // 单独绘制悬浮的图形（如果有）
  if (hoveredBoxIndex.value !== null && hoveredBoxIndex.value !== selectedBoxIndex.value) {
    const box = boxes.value[hoveredBoxIndex.value];
    drawShape(box.type, box, true); // 虚线显示
  }
};

/**
 * 鼠标按下事件
 * @param e
 */
const handleMouseDown = (e: MouseEvent) => {
  if (!ctx) return;
  
  const { offsetX, offsetY } = e;
  
  // 如果正在绘制模式
  if (cursorVal.value === "crosshair") {
    mouseIsDown.value = true;
    startPoint.value = { x: offsetX, y: offsetY };
    return;
  }
  
  // 检查是否点击了某个图形
  const boxIndex = findBoxAtPoint(offsetX, offsetY);
  
  if (boxIndex !== null) {
    selectedBoxIndex.value = boxIndex;
    const box = boxes.value[boxIndex];
    
    // 计算拖拽偏移量
    const centerX = box.startX + (box.endX - box.startX) / 2;
    const centerY = box.startY + (box.endY - box.startY) / 2;
    dragOffset.value = { x: centerX - offsetX, y: centerY - offsetY };
    
    // 进入拖拽模式
    mouseIsDown.value = true;
    drawAllBoxes();
  } else {
    // 点击空白处，取消选中
    selectedBoxIndex.value = null;
    drawAllBoxes();
  }
};

/**
 * 鼠标移动事件
 * @param e
 */
const handleMouseMove = (e: MouseEvent) => {
  if (!ctx) return;
  
  const { offsetX, offsetY } = e;
  
  // 处理拖拽模式
  if (mouseIsDown.value && selectedBoxIndex.value !== null && dragOffset.value !== null) {
    const boxIndex = selectedBoxIndex.value;
    const box = boxes.value[boxIndex];
    
    // 计算图形的宽度和高度
    const width = box.endX - box.startX;
    const height = box.endY - box.startY;
    
    // 计算新的中心点
    const newCenterX = offsetX + dragOffset.value.x;
    const newCenterY = offsetY + dragOffset.value.y;
    
    // 更新图形位置
    box.startX = newCenterX - width / 2;
    box.endX = newCenterX + width / 2;
    box.startY = newCenterY - height / 2;
    box.endY = newCenterY + height / 2;
    
    drawAllBoxes();
    return;
  }
  
  // 处理绘制模式
  if (mouseIsDown.value && cursorVal.value === "crosshair" && startPoint.value) {
    const { x: startX, y: startY } = startPoint.value;
    drawAllBoxes();
    drawShape(drawType.value, {
      startX,
      startY,
      endX: offsetX,
      endY: offsetY,
      color: selectedColor.value,
    });
    return;
  }
  
  // 处理悬浮效果
  if (!mouseIsDown.value && cursorVal.value === "default") {
    const boxIndex = findBoxAtPoint(offsetX, offsetY);
    
    if (boxIndex !== hoveredBoxIndex.value) {
      hoveredBoxIndex.value = boxIndex;
      drawAllBoxes();
    }
  }
};

/**
 * 鼠标松开事件
 * @param e
 */
const handleMouseUp = (e: MouseEvent) => {
  if (!ctx) return;
  
  mouseIsDown.value = false;
  
  // 处理绘制完成
  if (cursorVal.value === "crosshair" && startPoint.value) {
    const { offsetX, offsetY } = e;
    const { x: startX, y: startY } = startPoint.value;
    
    // 防止绘制过小的图形
    const minSize = 5;
    const width = Math.abs(offsetX - startX);
    const height = Math.abs(offsetY - startY);
    
    if (width >= minSize || height >= minSize) {
      boxes.value.push({
        type: drawType.value,
        startX,
        startY,
        endX: offsetX,
        endY: offsetY,
        color: selectedColor.value,
      });
      cacheBoxes.value = cloneDeep(boxes.value);
    }
    
    startPoint.value = null;
    drawAllBoxes();
  }
  
  // 重置拖拽状态
  dragOffset.value = null;
};

/**
 * 鼠标离开画布事件
 */
const handleMouseLeave = () => {
  if (!mouseIsDown.value) {
    hoveredBoxIndex.value = null;
    drawAllBoxes();
  }
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
    cursor: v-bind(canvasCursor);
  }
}
</style>