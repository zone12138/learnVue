<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-08 10:36:30
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-09 16:26:04
 * @FilePath: \vue3-project\src\views\GridView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="grid">
    <div class="grid-card" v-for="item in imageArr" :key="item">
      <img :src="item" alt="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const imageArr = ref([
  "http://p15.qhimg.com/t0102e8b4ee4d05636a.jpg",
  "http://p16.qhimg.com/t017f7a2395db6de879.jpg",
  "http://p19.qhimg.com/t01ac4e0b17cd4465f3.jpg",
  "http://p16.qhimg.com/t018e953fdd4266aebe.jpg",
  "http://p19.qhimg.com/t0151309202cd85dc7a.jpg",
  "http://p15.qhimg.com/t0114fed81a50837050.jpg",
  "http://p15.qhimg.com/t01ca637fbd3fc2927e.jpg",
  "http://p18.qhimg.com/t0198d2c0447d99569e.jpg",
  "http://p18.qhimg.com/t01fa426a58807bf4ba.jpg",
  "http://p15.qhimg.com/t0152bec756e80346e8.jpg",
  "http://p19.qhimg.com/t01c05a430b7d7ac81b.jpg",
  "http://p19.qhimg.com/t0165a1825aaeb23b5a.jpg",
  "http://p18.qhimg.com/t0166f47c6a4785af9e.jpg",
]);
</script>

<style lang="scss" scoped>
@keyframes turnCard {
  from {
    opacity: 0;
    transform: scale(0.3);
    filter: hue-rotate(180deg);
  }
  to {
    opacity: 1;
    transform: scale(1);
    filter: none;
  }
}
.grid {
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-areas:
    "a b c d"
    "e x x f"
    "g x x h"
    "i j k l";
  grid-template-rows: repeat(4, minmax(0px, 1fr));
  gap: 10px;

  $area: a, b, c, d, f, h, l, k, j, i, g, e, x;

  > div {
    $time: 0.4s;
    opacity: 0;
    animation: turnCard $time ease-in-out forwards;
    @for $i from 1 through length($area) {
      &:nth-child(#{$i}) {
        grid-area: nth($area, $i);
        animation-delay: calc(($i) * $time);
      }
    }

    > img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}
</style>
