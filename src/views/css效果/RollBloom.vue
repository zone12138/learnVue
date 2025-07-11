<template>
  <div class="roll-bloom">
    <div class="roll-bloom__container" ref="container">
      <div
        v-for="(v, i) in count"
        :key="v"
        class="roll-bloom__container-item"
        :style="{ '--bgColor': colorArr[i] }"
      ></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted } from "vue";
import { getRandomColorArrayWithoutRepeat } from "@/lib/color";
const count = ref(120);
const colorArr = getRandomColorArrayWithoutRepeat(count.value);
const container = ref<HTMLDivElement>();

onMounted(() => {
  handleObserver();
});

const handleObserver = () => {
  if (!container.value) return;
  // 有个缺陷，如果 roll-bloom__container-item 初始状态不在可视区域（比如：translateX(-600px), 超出了可视区域），则不会触发进入事件
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-active");
      } else {
        entry.target.classList.remove("is-active");
      }
    });
  });
  const targetArr = container.value.querySelectorAll(
    ".roll-bloom__container-item"
  );
  targetArr.forEach((v) => {
    observer.observe(v);
  });
};
</script>

<style lang="scss" scoped>
.roll-bloom {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  justify-content: center;

  &__container {
    width: 100%;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    display: grid;
    grid-template-columns: repeat(3, 100px);
    justify-content: center;
    gap: 20px;

    &-item {
      height: 100px;
      border-radius: 16px;
      background-color: var(--bgColor);
      mix-blend-mode: difference;
      transition: all 0.5s;

      &:nth-child(3n + 1) {
        transform: translateX(-200px) scale(0);
      }

      &:nth-child(3n + 2) {
        transform: translateX(0) scale(0);
      }

      &:nth-child(3n + 3) {
        transform: translateX(200px) scale(0);
      }

      &.is-active {
        transform: translateX(0) scale(1);
      }
    }
  }
}
</style>
