<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-16 18:05:40
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-17 09:46:42
 * @FilePath: \vue3-project\src\views\ParallaxScroll.vue
 * @Description: 视差滚动
-->
<template>
  <div class="parallax-scroll">
    <div
      v-for="(v, i) in imageArr"
      :key="v"
      :style="{ 'background-image': `url(${v})`, 'background-size': 'cover' }"
    >
      <span>{{ textArr[i] }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, defineOptions } from "vue";
import { useImage } from "@/hook/useImage";
const { getImage } = useImage();
const count = ref(8);
const imageArr = getImage(count.value);
const textArr = ref([
  "人生自古谁无死，留取丹心照汗青",
  "纸上得来终觉浅，绝知此事要躬行",
  "卧看牵牛织女星，不知织女今何在",
  "天生我材必有用，千金散尽还复来",
  "黄沙百战穿金甲，不破楼兰终不还",
  "纵使金光已远去，不识青青牛郎织女",
  "醉里挑灯看剑，梦回吹角连营",
  "采菊东篱下，悠然见南山",
  "行路难，行路难，多歧路，今安在？",
  "生活不止眼前的苟且，还有诗和远方",
]);

defineOptions({
  name: '视差滚动'
})

</script>

<style lang="scss" scoped>
.parallax-scroll {
  height: 100%;
  width: 100%;
  overflow-y: auto;

  > div {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-attachment: fixed;
    > span {
      color: #fff;
      font-size: 38px;
      mix-blend-mode: difference;
    }
  }
}
</style>
