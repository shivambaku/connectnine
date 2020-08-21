<template>
  <svg class='board' :viewBox='`0 0 ${this.width} ${this.width}`'>
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
        this.$emit('placed', this.itox(i), this.itoy(i));
      }
    },
    scale(value) {
      const t = value / this.boardSize;
      return this.innerWidth * t;
    },
  },
};
</script>
