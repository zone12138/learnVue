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
      <img
        src="http://p15.qhimg.com/t0102e8b4ee4d05636a.jpg"
        alt=""
        srcset=""
      />
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
const imgContainer = ref<HTMLDivElement>();
const areaContainer = ref<HTMLDivElement>();
const canvas = ref<HTMLCanvasElement>();
let ctx: CanvasRenderingContext2D | null;
let areaStatus = ref("none");
let areaLeft = ref("0px");
let areaTop = ref("0px");
const areaSize = ref("100px");

onMounted(() => {
  console.log("onMounted");
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
  ctx.scale(devicePixelRatio, devicePixelRatio);
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

  // ctx?.drawImage();
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
      background: rgba($color: #fff, $alpha: 0.2);
      cursor: grab;
    }
  }
}
</style>
