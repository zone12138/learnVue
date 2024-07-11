<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-11 14:42:15
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-11 14:50:11
 * @FilePath: \vue3-project\src\views\FireworkView.vue
 * @Description: 放大器
-->
<template>
  <div ref="canvasContainer" class="img-magnifier">
    <div class="img-magnifier__img" ref="imgContainer">
      <img ref="image" alt="" srcset="" />
      <div class="img-magnifier__img__area" ref="areaContainer"></div>
    </div>
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
} from "vue";
import { useImage } from "../hook/useImage";
const { getRandomImage } = useImage();
let imgPath = ref("");
const imgContainer = ref<HTMLDivElement>();
const image = ref<HTMLImageElement>();
const areaContainer = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | null;
let areaStatus = ref("none");
let areaLeft = ref("0px");
let areaTop = ref("0px");
const areaSize = ref("100px");
let areaBgColor = ref("rgba(255, 255, 255, 0.2)");

onMounted(() => {
  console.log("onMounted");
  imgPath.value = getRandomImage();
  if (!image.value) return;
  image.value.src = getRandomImage();
  init();
  imgContainer.value?.addEventListener("mousemove", handleMousemove);
  imgContainer.value?.addEventListener("mouseover", handleMouseover);
  imgContainer.value?.addEventListener("mouseleave", handleMouseleave);
});

onActivated(() => {
  console.log("onActivated");
});

onDeactivated(() => {
  console.log("onDeactivated");
});

onBeforeUnmount(() => {
  console.log("onBeforeUnmount");
});

const init = () => {
  if (!canvas.value) return;
  canvas.value.height = 300;
  canvas.value.width = 300;
  ctx = canvas.value.getContext("2d");
  if (!ctx) return;
  // ctx.scale(devicePixelRatio, devicePixelRatio);
};

const handleMousemove = (e: MouseEvent) => {
  const { clientX, clientY } = e;
  const {
    left = 0,
    top = 0,
    width = 0,
    height = 0,
  } = imgContainer.value?.getBoundingClientRect() || {};

  areaLeft.value =
    calcBounds(clientX - left, width, parseFloat(areaSize.value)) + "px";
  areaTop.value =
    calcBounds(clientY - top, height, parseFloat(areaSize.value)) + "px";

  if (!image.value || !canvas.value) return;
  const XRatio = image.value.width / image.value.naturalWidth;
  const YRatio = image.value.height / image.value.naturalHeight;
  ctx?.drawImage(
    image.value,
    parseFloat(areaLeft.value) / XRatio,
    parseFloat(areaTop.value) / YRatio,
    parseFloat(areaSize.value) / XRatio,
    parseFloat(areaSize.value) / YRatio,
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );

  const imageData = ctx?.getImageData(
    0,
    0,
    canvas.value.width,
    canvas.value.height
  );
  const data = imageData?.data || [];

  let totalLuminance = 0;
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    totalLuminance += luminance;
  }
  const averageLuminance = totalLuminance / (data.length / 4);
  areaBgColor.value =
    averageLuminance > 128 ? "rgba(0, 0, 0, 0.2)" : "rgba(255, 255, 255, 0.2)";
};

const handleMouseover = () => {
  areaStatus.value = "block";
};

const handleMouseleave = () => {
  areaStatus.value = "none";
  ctx?.clearRect(0, 0, canvas.value?.width || 0, canvas.value?.height || 0);
};

const calcBounds = (
  mouseP: number,
  containerR: number,
  areaR: number
): number => {
  let value = Math.max(mouseP - areaR / 2, 0);
  value = Math.min(value, containerR - areaR);
  return value;
};
</script>

<style lang="scss" scoped>
.img-magnifier {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &__img {
    position: relative;
    height: 300px;
    width: 300px;

    > img {
      height: 100%;
      width: 100%;
    }

    &__area {
      position: absolute;
      top: v-bind(areaTop);
      left: v-bind(areaLeft);
      width: v-bind(areaSize);
      height: v-bind(areaSize);
      background-blend-mode: lighten;
      display: v-bind(areaStatus);
      background: v-bind(areaBgColor);
      cursor: grab;
    }
  }
  canvas {
    margin-left: 8px;
  }
}
</style>
