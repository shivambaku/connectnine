<template>
  <g :transform='`translate(${this.padding}, ${this.padding})`'>
    <rect :class='`piece ${this.class}`'
          :rx='rx' :ry='ry'
          :x='x' :y='y' :width='innerSize' :height='innerSize'/>
  </g>
</template>

<script>
import Design from '../design/design';

export default {
  props: {
    value: Number,
    x: Number,
    y: Number,
    size: Number,
  },
  data() {
    return {
      padding: Design.piece.padding,
      rx: Design.piece.rx,
      ry: Design.piece.ry,
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
