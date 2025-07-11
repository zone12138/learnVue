<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-04 09:43:10
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-08 10:10:25
 * @FilePath: \vue3-project\src\views\AboutView.vue
 * @Description: 打字机效果
-->
<template>
  <div class="about">
    {{ message }}
    <div class="contain">
      <span>{{ message }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from "vue";
const message = ref(
  "Here is a random piece of English for you: The sun was setting over the mountains, painting the sky with hues of orange and purple. A gentle breeze rustled the leaves of the ancient oak tree, as if whispering secrets to the world. The birds chirped merrily, oblivious to the passing of time. In the distance, a small stream flowed peacefully, its water glistening in the fading light. It was a scene of tranquility and beauty that soothed the soul. "
);
</script>

<style lang="scss" scoped>
@property --p {
  syntax: "<percentage>";
  initial-value: 0%;
  inherits: false;
}

@keyframes typeWriter {
  to {
    --p: 100%;
  }
}

.about {
  position: relative;
  font-weight: bold;
  text-indent: 2em;
  // word-break: break-all; // 不会因为单词连贯而换行

  .contain {
    position: absolute;
    inset: 0;

    span {
      color: transparent;
      background: linear-gradient(
        to right,
        transparent var(--p),
        #fff calc(var(--p) + 30px)
      );
      animation: typeWriter 5s linear forwards;
    }
  }
}
</style>
