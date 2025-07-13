<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-18 17:55:00
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-19 17:34:25
 * @FilePath: \vue3-project\src\views\ImageFragmentation.vue
 * @Description: 图片碎片化
-->
<template>
  <div class="image-fragmentation">
    <div class="image-fragmentation__container" ref="container">
      <div
        class="image-fragmentation__container-item"
        v-for="v in row * col"
        :key="v"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, defineOptions } from "vue";
const row = ref(16);
const col = ref(16);
const boxWidth = ref("0px");
const boxHeight = ref("0px");
const container = ref<HTMLDivElement>();

defineOptions({
  name: "图片碎片化"
})

onMounted(async () => {
  console.log("result");
  createSmallBox();
});

const createSmallBox = () => {
  if (!container.value) return;
  const { width, height } = container.value.getBoundingClientRect();
  boxWidth.value = `${width / col.value}px`;
  boxHeight.value = `${height / row.value}px`;
  const boxList = container.value.querySelectorAll(
    ".image-fragmentation__container-item"
  );
  boxList.forEach((item: Element, index) => {
    if (item instanceof HTMLElement) {
      const x = index % col.value;
      const y = Math.floor(index / col.value);
      const randomFlag = Math.random() > 0.5;
      item.style.backgroundPosition = `-${x * parseFloat(boxWidth.value)}px -${
        y * parseFloat(boxHeight.value)
      }px`;
      item.style.animationDelay = `${
        Math.random() * col.value * row.value * 0.005
      }s`;
      item.style.setProperty(
        "--rotateX",
        randomFlag ? "rotateX(-180deg)" : "rotateX(0deg)"
      );
      item.style.setProperty(
        "--rotateY",
        randomFlag ? "rotateY(0deg)" : "rotateY(-180deg)"
      );
    }
  });
};
</script>

<style lang="scss" scoped>
@keyframes smallBoxAnimate {
  0% {
    opacity: 0;
    transform: var(--rotateX) var(--rotateY) scale(0.8);
  }
  40% {
    opacity: 0;
    transform: var(--rotateX) var(--rotateY) scale(0.8);
  }
  70% {
    opacity: 1;
    transform: rotateX(0) rotateY(0) scale(0.8);
  }
  100% {
    opacity: 1;
    transform: rotateX(0) rotateY(0) scale(1);
  }
}

.image-fragmentation {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &__container {
    height: 512px;
    width: 512px;
    display: flex;
    /* 小块自动换行排列 */
    flex-wrap: wrap;
    justify-content: center;

    &-item {
      --rotateX: rotateX(0);
      --rotateY: rotateY(0);
      transform: var(--rotateX) var(--rotateY) scale(0.8);
      // 块的大小是整数时才不会出现白边
      height: v-bind(boxHeight);
      width: v-bind(boxWidth);
      background: url("@/assets/九宫格.jpeg");
      background-repeat: no-repeat;
      background-size: 512px 512px;
      opacity: 0;
      animation: smallBoxAnimate 2s linear forwards;
    }
  }
}
</style>
