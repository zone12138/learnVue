<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-15 10:09:22
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-15 10:27:49
 * @FilePath: \vue3-project\src\views\AvatarSurround.vue
 * @Description: 环绕
-->
<template>
  <div class="avatar-surround">
    <div class="avatar-surround__content" :style="{ '--count': count }">
      <div
        v-for="(v, i) in count"
        :key="v"
        class="avatar-surround__content-item"
      >
        <img :src="imageData[i]" alt="" srcset="" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useImage } from "../hook/useImage";
import { ref } from "vue";
const { getImage } = useImage();
const count = ref(5);
const imageData = getImage(count.value);

console.log(imageData);
</script>

<style lang="scss" scoped>
$outsideSize: 400px;
$insideSize: 100px;

@keyframes rotation {
  to {
    transform: rotate(calc(360deg - var(--initDeg, 0deg)));
  }
}
.avatar-surround {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  &__content {
    height: $outsideSize;
    width: $outsideSize;
    border: 1px solid #000;
    border-radius: 50%;
    position: relative;
    animation: rotation 10s linear infinite;

    &-item {
      height: $insideSize;
      width: $insideSize;
      border-radius: 50%;
      overflow: hidden;
      position: absolute;
      top: calc($insideSize / -2);
      left: calc(($outsideSize - $insideSize) / 2);
      transform-origin: center calc(($outsideSize + $insideSize) / 2);

      > img {
        height: 100%;
        width: 100%;
      }

      $count: 5;

      @for $i from 1 through $count {
        &:nth-child(#{$i}) {
          $rotateDeg: calc(($i - 1) * 360deg / $count);
          transform: rotate($rotateDeg);

          > img {
            --initDeg: #{$rotateDeg};
            transform: rotate(-$rotateDeg);
            animation: rotation 10s linear infinite reverse;
          }
        }
      }
    }
  }
}
</style>
