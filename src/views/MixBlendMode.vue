<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-17 10:09:02
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-17 10:18:05
 * @FilePath: \vue3-project\src\views\MixBlendMode.vue
 * @Description: mix-blend-mode: defferent
-->
<template>
  <div class="mix-blend-mode"></div>
</template>

<script lang="ts" setup></script>

<style lang="scss" scoped>
@keyframes move {
  0% {
    transform: translate(-30%, -50%);
  }
  100% {
    transform: translate(-70%, -50%);
  }
}
.mix-blend-mode {
  height: 100%;
  width: 100%;
  background-image: linear-gradient(45deg, #000 50%, #fff 50%);

  &::before {
    content: "MIX BLEND MODE";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 5vw;
    color: #fff;
    mix-blend-mode: difference;
    animation: move 3s infinite alternate;
  }
}
</style>
