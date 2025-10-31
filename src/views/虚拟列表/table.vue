<!--
 * @FileDescription: 虚拟列表表格
 * @Author: xie
 * @Date: 2025-10-28 10:37:02
-->
<template>
  <header>
    <h1>虚拟列表表格</h1>
    <el-button type="primary" @click="createRandomTableData">
        创建随机数据
    </el-button>
    <span>{{ tableData.length }}条数据</span>
  </header>
  <div class="virtual-table" ref="tableRef">
    <ElTable :data="actualRenderData" height="100%">
      <ElTableColumn prop="id" label="ID" width="80" />
      <ElTableColumn prop="date" label="日期" width="180" />
      <ElTableColumn prop="name" label="姓名" width="180" />
      <ElTableColumn prop="address" label="地址" />
    </ElTable>
  </div>
</template>

<script lang="ts" setup>
import { useVirtualList } from "@/hook/useVirtualList";
import { onMounted, ref } from "vue";

const tableData = ref<any[]>([]);

const tableRef = ref(null);

const { actualRenderData } = useVirtualList({
  data: tableData,
  parentContainer: tableRef,
  scrollContainer: ".el-scrollbar__wrap",
  actualHeightContainer: ".el-scrollbar__view",
  translateContainer: ".el-table__body",
  itemContainer: ".el-table__row",
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
        : `车速海慧寺v封神榜覅我i今年福建师范老师看来你`,
  }));
};
</script>

<style lang="scss" scoped>
.virtual-table {
  width: 600px;
  height: 500px;
  overflow: auto;
}
</style>
