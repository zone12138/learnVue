<template>
  <div class="circle-view">
    <div class="circle-view__avatar"></div>
  </div>
</template>

<script lang="ts" setup>
import {defineOptions} from 'vue'
defineOptions({
  name: "头像悬浮效果"
})
</script>

<style lang="scss" scoped>
.circle-view {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &__avatar {
    height: 120px;
    width: 120px;
    border-radius: 50%;
    background: url("@/assets/九宫格.jpeg") center center;
    background-size: contain;
    position: relative;

    &::before,
    &::after {
      content: "";
      position: absolute;
      inset: 0;
      border-radius: 50%;
    }

    &::before {
      background: rgba($color: #000000, $alpha: 0.5);
    }

    &::after {
      background: inherit;
      clip-path: circle(0% at 50% 50%);
      transition: clip-path 0.3s;
    }

    &:hover {
      &::after {
        clip-path: circle(100% at 50% 50%);
      }
    }
  }
}
</style>
