<template>
  <g :transform='`translate(${this.padding}, ${this.padding})`'>
    <rect class='piece'
          :x='x' :y='y' :fill='color' :width='innerSize' :height='innerSize' :opacity='0.35'/>
  </g>
</template>

<script>
import * as d3 from 'd3';
import Settings from '../settings';

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
    color() {
      return d3.schemePaired[this.value + 1];
    },
  },
  created() {
  },
};
</script>
