<!--
 * @Author: xie 1459547902@qq.com
 * @Date: 2024-07-04 09:43:10
 * @LastEditors: xie 1459547902@qq.com
 * @LastEditTime: 2024-07-15 16:17:13
 * @FilePath: \vue3-project\src\views\HomeView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    class="home"
    @mouseenter="handleOutsideMouseEnter"
    @mouseleave="handleOutsideMouseLeave"
    @mousemove="handleOutsideMouseMove"
    @mouseover="handleOutsideMouseOver"
  >
    <div
      @mouseenter="handleInsideMouseEnter"
      @mouseleave="handleInsideMouseLeave"
      @mousemove="handleInsideMouseMove"
      @mouseover="handleInsideMouseOver"
    ></div>
  </div>
</template>

<script lang="ts" setup>
const handleOutsideMouseEnter = () => {
  console.log("handleOutsideMouseEnter");
};
const handleInsideMouseEnter = () => {
  console.log("handleInsideMouseEnter");
};
const handleOutsideMouseLeave = () => {
  console.log("handleOutsideMouseLeave");
};
const handleInsideMouseLeave = () => {
  console.log("handleInsideMouseLeave");
};
const handleOutsideMouseMove = () => {
  console.log("handleOutsideMouseMove");
};
const handleInsideMouseMove = () => {
  console.log("handleInsideMouseMove");
};
const handleOutsideMouseOver = () => {
  console.log("handleOutsideMouseOver");
};
const handleInsideMouseOver = () => {
  console.log("handleInsideMouseOver");
};
</script>

<style lang="scss" scoped>
.home {
  height: 100%;
  width: 100%;
  background-color: red;

  > div {
    height: 100px;
    width: 100px;
    background-color: blue;
  }
}
</style>
