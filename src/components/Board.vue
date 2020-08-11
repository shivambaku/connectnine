<template>
  <svg class='board' :width='size' :height='size'>
    <g :transform='`translate(${this.padding}, ${this.padding})`'>
      <Piece v-for='(piece, i) in pieces'
            :key='i'
            :value='piece.value'
            :x='scale(itox(i))'
            :y='scale(itoy(i))'
            :size='pieceSize'/>
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
import Piece from './Piece.vue';
import Settings from '../settings/settings';

export default {
  props: {
    pieces: Array,
  },
  components: {
    Piece,
  },
  data() {
    return {
      size: Settings.boardWidth,
      boardSize: Settings.boardSize,
      padding: Settings.boardPadding,
    };
  },
  created() {
  },
  computed: {
    innerSize() {
      return this.size - 2 * this.padding;
    },
    scale() {
      return d3.scaleLinear()
        .domain([0, this.boardSize])
        .range([0, this.innerSize])
        .nice();
    },
    pieceSize() {
      return this.innerSize / this.boardSize;
    },
  },
  methods: {
    itox(i) {
      return i % this.boardSize;
    },
    itoy(i) {
      return Math.floor(i / this.boardSize);
    },
  },
};
</script>
