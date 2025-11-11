<template>
  <h1>TEST</h1>
  <loading-btn type="primary" :loading="true" @click="handleClick">
    加载按钮
  </loading-btn>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import loadingBtn from "@/components/Repackage/loadingBtn.vue";

export default defineComponent({
  name: "Test",
  components: {
    loadingBtn,
  },
  methods: {
    handleClick() {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("加载完成");
          resolve("加载完成");
        }, 2000);
      });
    },
  },
});
</script>
