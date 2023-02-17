<template>
  <div class="tags">
    <!-- <div class="tags-bg" :style="bgStyle"></div> -->
    <ul
      class="tags-wrap"
      :style="{
        'flex-direction': direction == 'horizontal' ? 'row' : 'column',
      }"
    >
      <li class="tags-bg" :style="bgStyle"></li>
      <li
        v-for="(item, index) of tagList"
        :key="index"
        :class="{ active: tag == index }"
        @click="taggleTag(index)"
      >
        {{ item.name }}
      </li>
    </ul>
  </div>
</template>
<script setup>
import { computed } from "vue";

const props = defineProps({
  tag: {
    type: Number,
    default: 0,
  },
  tagList: Array,
  direction: {
    type: String,
    default: "horizontal",
  },
});
const emits = defineEmits(["update:tag", "tab-click"]);
const taggleTag = (index) => {
  emits("update:tag", index);
  emits("tab-click", index);
};

const bgStyle = computed(() => {
  let perc = 100 / props.tagList.length;
  let posi = props.tag * perc;
  if (props.direction == "horizontal") {
    return {
      left: posi + "%",
      height: "100%",
      width: perc + "%",
    };
  } else {
    return {
      top: posi + "%",
      height: perc + "%",
      width: "100%",
    };
  }
});
</script>
<style lang="less" scoped>
.tags {
  height: 40px;
  background: var(--color-fill-1);
  border-radius: 6px;
  padding: 4px;
  font-size: 16px;

  .tags-wrap {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    position: relative;
    left: 0;
    .tags-bg {
      position: absolute;
      background: var(--color-bg-1);
      border-radius: 6px;
      left: 0;
      top: 0;
      transition: all 0.3s;
    }
    li {
      z-index: 10;
      flex: 1;
      height: 100%;
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: var(--color-text-2);
      cursor: pointer;
      &:hover {
        color: rgb(var(--primary-6));
        font-weight: bold;
      }
    }
    .active {
      color: rgb(var(--primary-6));
      font-weight: bold;
    }
  }
}
</style>
