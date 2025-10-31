<!--
 * @FileDescription: 
 * @Author: 谢灿锐
 * @Date: 2025-09-29 09:04:58
-->
<template>
  <div ref="boxSelect" @click="drawAllBoxes" @pointerdown="handlePointerDown" @pointermove="handlePointerMove" @pointerup="handlePointerUp"></div>
</template>

<script lang="ts">
import { onMounted, ref } from "vue";

export default {
  name: "testSetup",
  setup(_, {expose}) {
    const boxSelect = ref(null);
    const drawAllBoxes = () => {
      if (!boxSelect.value) {
        return;
      }
    };
    const handlePointerDown = (e: PointerEvent) => {
      console.log("pointerdown", e);
      if (e.button !== 0) {
        return;
      }
    }
    const handlePointerMove = (e: PointerEvent) => {
      console.log("pointermove", e);
    }
    const handlePointerUp = (e: PointerEvent) => {
      console.log("pointerup", e);
    }
    expose({
      drawAllBoxes,
    })
    return {
      drawAllBoxes,
      handlePointerDown,
      handlePointerMove,
      handlePointerUp,
    }
  },
};
</script>

<style lang="scss" scoped>
div {
  width: 100px;
  height: 100px;
  background-color: red;
}

</style>
