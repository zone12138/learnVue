<template>
  <ElContainer class="cdz">
    <ElAside>
      <ElTree
        :data="treeData"
        :props="props"
        ref="treeRef"
        @node-click="handleNodeClick"
      />
    </ElAside>
    <ElMain>
      <nav>
        <ElButton :type="activeBtn === 1 ? 'primary' : 'default'" @click="activeBtn = 1">一号节点</ElButton>
        <ElButton :type="activeBtn === 2 ? 'primary' : 'default'" @click="activeBtn = 2">五号节点</ElButton>
      </nav>
      <keep-alive>
        <component :is="activeBtn === 1 ? A : B" :nodeData="nodeData" />
      </keep-alive>
    </ElMain>
  </ElContainer>
</template>

<script lang="ts" setup>
import { ElContainer, ElAside, ElMain, ElButton, ElTree } from "element-plus";
import { ref, h } from "vue";
const treeData = ref([
  {
    id: 1,
    name: "一级 1",
    children: [
      {
        id: 2,
        name: "二级 1-1",
        children: [
          {
            id: 3,
            name: "三级 1-1-1",
          },
          {
            id: 4,
            name: "三级 1-1-2",
          },
        ],
      },
      {
        id: 5,
        name: "二级 1-2",
      },
    ],
  },
]);
const props = {
  children: "children",
  label: "name",
};

const nodeData = ref({});

const handleNodeClick = (node: any) => {
  nodeData.value = node;
};

const activeBtn = ref(1);

const A = {
  name: "AComp",
  props: {
    nodeData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      count: ref(0),
    };
  },
  watch: {
    nodeData() {
      console.log(" ++++ A:  nodeData changed");
    },
  },
  render() {
    return h("div", {}, `count: 1`);
  },
};

const B = {
  name: "BComp",
  props: {
    nodeData: {
      type: Object,
      default: () => ({}),
    },
  },
  setup() {
    return {
      count: ref(0),
    };
  },
  watch: {
    nodeData() {
      console.log(" ==== B:  nodeData changed");
    },
  },
  render() {
    return h("div", {}, `count: 2`);
  },
};
</script>

<style scoped>
.cdz {
  width: 100%;
  height: 100%;
}
</style>
