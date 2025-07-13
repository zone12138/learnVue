<template>
  <div class="sticky-scroll">
    <div v-for="v in allImage" :key="v">
      <img :src="v" alt="" srcset="" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineOptions } from "vue";
import { useImage } from "@/hook/useImage";
const { allImage } = useImage();

defineOptions({
  name: '粘性滚动'
})
</script>

<style lang="scss" scoped>
// scroll-margin 作用在滚动元素中的子元素
// scroll-padding 作用在滚动元素本身

.sticky-scroll {
  height: 100%;
  width: 100%;
  display: flex;
  overflow-y: hidden;
  overflow: auto;
  scroll-snap-type: x mandatory;

  > div {
    height: 100%;
    width: 100%;
    flex-shrink: 0;
    overflow: hidden;
    scroll-snap-align: center;
    img {
      height: 100%;
      width: 100%;
    }
  }
}
</style>
