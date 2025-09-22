<template>
  <div class="hello">
    <input type="text" :value="modelValue" />
    <button @click="clickFn">click</button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HelloWorld",
  props: {
    modelValue: String,
  },
  methods: {
    clickFn() {
      this.$emit('update:modelValue', '2024-02-01')
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
