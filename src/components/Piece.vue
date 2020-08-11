<template>
  <g :transform='`translate(${this.padding}, ${this.padding})`'>
    <rect :class='`piece ${this.class}`'
          :x='x' :y='y' :width='innerSize' :height='innerSize'/>
  </g>
</template>

<script>
import Settings from '../settings/settings';

export default {
  props: {
    value: Number,
    x: Number,
    y: Number,
    size: Number,
  },
  data() {
    return {
      padding: Settings.piecePadding,
    };
  },
  computed: {
    innerSize() {
      return this.size - 2 * this.padding;
    },
    class() {
      return `piece-${this.value}`;
    },
  },
  created() {
  },
};
</script>
