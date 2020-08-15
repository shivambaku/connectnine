<template>
  <svg class='board' :width='width' :height='width'>
    <g :transform='`translate(${this.padding}, ${this.padding})`'>
      <Piece
        v-for='(piece, i) in pieces'
        :key='i'
        :value='piece.value'
        :x='scale(itox(i))'
        :y='scale(itoy(i))'
        :size='pieceSize'
        v-on:click.native='placed(i)'
      />
    </g>
  </svg>
</template>

<script>
import * as d3 from 'd3';
import Piece from './Piece.vue';
import Design from '../design/design';
import Settings from '../settings';

export default {
  props: {
    pieces: Array,
  },
  components: {
    Piece,
  },
  data() {
    return {
      width: Design.board.width,
      padding: Design.board.padding,
      boardSize: Settings.boardSize,
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
        .domain([0, this.boardSize])
        .range([0, this.innerWidth])
        .nice();
    },
    pieceSize() {
      return this.innerWidth / this.boardSize;
    },
  },
  methods: {
    itox(i) {
      return i % this.boardSize;
    },
    itoy(i) {
      return Math.floor(i / this.boardSize);
    },
    placed(i) {
      if (this.pieces[i].value === 0) {
        this.$emit('placed', i);
      }
    },
  },
};
</script>
