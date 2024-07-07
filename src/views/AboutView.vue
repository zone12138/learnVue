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

  .contain {
    position: absolute;
    inset: 0;
    z-index: 1;
    transition: all 5s linear;

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
