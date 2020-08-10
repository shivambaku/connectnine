<template>
  <div>
    <svg class='board' :width='width' :height='height'>
      <g :transform='`translate(${this.padding}, ${this.padding})`'>
        <Piece v-for='(piece, i) in pieces'
              :key='i'
              :value='piece.value'
              :x='scale(i)'
              :y='0'
              :size='pieceSize'/>
      </g>
    </svg>
  </div>
</template>

<script>
import * as d3 from 'd3';
import Piece from './Piece.vue';
import Settings from '../settings';

export default {
  components: {
    Piece,
  },
  data() {
    return {
      width: Settings.selectorWidth,
      selectorCount: Settings.selectorCount,
      padding: Settings.selectorPadding,
      pieces: [],
    };
  },
  created() {
    for (let i = 0; i < this.selectorCount; i += 1) {
      this.pieces.push({ value: 0 });
    }
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

<style scoped>
.board {
  -webkit-border-radius: 10px;
  -moz-border-radius: 10px;
  border-radius: 10px;
  background: rgb(166, 206, 227);
  overflow: hidden;
}
</style>
