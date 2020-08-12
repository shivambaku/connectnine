<template>
  <g :transform='`translate(${this.padding}, ${this.padding})`'>
    <rect :class='`piece ${this.class}`'
          :rx='rx' :ry='ry'
          :x='x' :y='y' :width='innerSize' :height='innerSize'/>
    <text v-if='value !== 0' class='piece-text'
          dominant-baseline="central" text-anchor="middle"
          :x='x' :y='y' :dx='innerSize / 2' :dy='innerSize / 2'>
          {{value}}
    </text>
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
