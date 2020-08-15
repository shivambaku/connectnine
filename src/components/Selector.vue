<template>
  <div>
    <svg class='selector' :width='width' :height='height'>
      <g :transform='`translate(${this.padding}, ${this.padding})`'>
        <Piece
          v-for='(piece, i) in pieces'
          :key='i'
          :class='i === selectedIndex ? "selected" : ""'
          :value='piece.value'
          :x='scale(i)'
          :y='0'
          :size='pieceSize'
          v-on:click.native='$emit("selected", i)'
        />
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Piece from './Piece.vue';
import Design from '../design/design';
import Settings from '../settings';

export default {
  props: {
    pieces: Array,
    selectedIndex: Number,
  },
  components: {
    Piece,
  },
  data() {
    return {
      width: Design.selector.width,
      padding: Design.selector.padding,
      selectorCount: Settings.selectorCount,
    };
  },
  created() {
  },
  computed: {
    innerWidth() {
      return this.width - 2 * this.padding;
    },
    scale() {
      return d3.scaleLinear()
        .domain([0, this.selectorCount])
        .range([0, this.innerWidth])
        .nice();
    },
    pieceSize() {
      return this.innerWidth / this.selectorCount;
    },
    height() {
      return this.pieceSize + this.padding * 2.0;
    },
  },
  methods: {
  },
};
</script>
