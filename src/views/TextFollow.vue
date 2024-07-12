<template>
  <div class="text-follow" ref="container">
    <span
      ref="label"
      v-for="v in textCount"
      :key="v"
      :style="{ '--delay': v }"
      class="text-follow__label"
    >
      {{ text }}
    </span>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onBeforeUnmount } from "vue";
const text = ref("Text Follow");
const container = ref<HTMLDivElement>();
const label = ref<HTMLSpanElement[]>([]);
const textLeft = ref("50%");
const textTop = ref("50%");
let textCount = ref(6);

onMounted(() => {
  container.value?.addEventListener("mousemove", handleMousemove);
});

onBeforeUnmount(() => {
  container.value?.removeEventListener("mousemove", handleMousemove);
});

const handleMousemove = (e: MouseEvent) => {
  requestAnimationFrame(() => {
    if (!container.value || !label.value || label.value.length === 0) return;
    const { clientX, clientY } = e;
    const [cTop, cLeft, cWidth, cHeight] = getClientRect(container.value);
    const { width, height } = label.value[0].getBoundingClientRect();
    container.value?.getBoundingClientRect() || {};
    if (clientY > cTop + cHeight - height) {
      textTop.value = cHeight - height + "px";
    } else {
      textTop.value = clientY - cTop + "px";
    }

    if (clientX > cLeft + cWidth - width) {
      textLeft.value = cWidth - width + "px";
    } else {
      textLeft.value = clientX - cLeft + "px";
    }
  });
};

const getClientRect = (container: HTMLElement) => {
  const {
    left = 0,
    top = 0,
    width = 0,
    height = 0,
  } = container?.getBoundingClientRect() || {};
  return [top, left, width, height];
};
</script>

<style lang="scss" scoped>
.text-follow {
  height: 100%;
  width: 100%;
  position: relative;

  &__label {
    position: absolute;
    top: v-bind(textTop);
    left: v-bind(textLeft);
    font-size: 56px;
    -webkit-text-stroke: 1px;
    -webkit-text-stroke-color: #000;
    color: transparent;
    user-select: none;
    pointer-events: none;
    transition: all 0.1s linear;
    transition-delay: calc(var(--delay) * 0.002s);
  }
}
</style>
