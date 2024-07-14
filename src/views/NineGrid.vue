<template>
  <div class="nine-grid" ref="nineGrid">
    <div class="nine-grid__content">
      <div v-for="item in 9" :key="item" class="nine-grid__content-item"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from "vue";
const nineGrid = ref<HTMLDivElement>();

onMounted(() => {
  handleSetPosition();
});

const handleSetPosition = () => {
  if (!nineGrid.value) return;
  const nineGridChild = nineGrid.value.querySelectorAll(
    ".nine-grid__content-item"
  );
  nineGridChild.forEach((item: Element, index: number) => {
    if (item instanceof HTMLElement) {
      const row = Math.floor(index / 3);
      const col = index % 3;
      item.style.setProperty("--bgposX", `${-col * 100}px`); // 左移，所以是负数
      item.style.setProperty("--bgposY", `${-row * 100}px`); // 左移，所以是负数
      item.style.setProperty("--x", `${(col - 1) * 20}px`);
      item.style.setProperty("--y", `${(row - 1) * 20}px`);
    }
  });
};
</script>

<style lang="scss" scoped>
.nine-grid {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &__content {
    display: grid;
    grid-template-columns: repeat(3, 100px);
    grid-template-rows: repeat(3, 100px);

    &-item {
      background: url("../assets/九宫格.jpeg");
      background-size: 300px 300px; // 背景图片大小
      background-position: var(--bgposX, 0) var(--bgposY, 0);
      transform: translate(var(--x, 0), var(--y, 0));
      transition: all 0.3s;
    }
    &:hover {
      .nine-grid__content-item {
        transform: translate(0, 0);
      }
    }
  }
}
</style>
