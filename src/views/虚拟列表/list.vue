<!--
 * @FileDescription: 虚拟列表
 * @Author: xie
 * @Date: 2025-10-28 10:37:02
-->
<template>
  <header>
    <h1>虚拟列表</h1>
    <el-button type="primary" @click="createRandomTableData">
        创建随机数据
    </el-button>
    <span>{{ tableData.length }}条数据</span>
  </header>
  <div class="virtual-list" ref="listRef">
    <div class="scroll-container">
      <div class="actual-height-container">
        <ul class="translate-container">
          <li v-for="item in actualRenderData" :key="item.id">
            {{ item.id }} - {{ item.date }} {{ item.name }} {{ item.address }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useVirtualList } from "@/hook/useVirtualList";
import { onMounted, ref } from "vue";

const tableData = ref<any[]>([]);

const listRef = ref(null);

const { actualRenderData } = useVirtualList({
  data: tableData,
  parentContainer: listRef,
  scrollContainer: ".scroll-container",
  actualHeightContainer: ".actual-height-container",
  translateContainer: ".translate-container",
  itemContainer: "li",
  itemHeight: 50,
  size: 10,
  buffer: 5,
});

onMounted(() => {
  createRandomTableData();
});

const createRandomTableData = () => {
  const randomLength = Math.floor(Math.random() * 10000) + 10000;
  tableData.value = Array.from({ length: randomLength }, (_, index) => ({
    id: index + 1,
    date: `2025-10-28 ${index % 24}:${index % 60}`,
    name: `用户${index}`,
    address:
      index % 2 === 0
        ? `地址${index}`
        : `谁牛年大吉腐败噶空间发四v我给很温柔弄完了反奶副科级网课`,
  }));
};
</script>

<style lang="scss" scoped>
.virtual-list {
  width: 600px;
  height: 500px;
  overflow: auto;

  .scroll-container {
    // height: 100%;
  }
}
</style>
