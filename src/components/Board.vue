<template>
  <svg class='board' :viewBox='`0 0 ${this.width} ${this.width}`'>
    <g :transform='`translate(${this.padding}, ${this.padding})`'>
      <Piece
        v-for='(piece, i) in pieces'
        :key='i'
        :value='piece.value'
        :x='scale(settings.itox(i))'
        :y='scale(settings.itoy(i))'
        :size='pieceSize'
        v-on:click.native='placed(i)'
      />
      <g :transform='`translate(${scale(2)}, ${scale(2)})`'>
        <path
          class='svg-attributes-demo'
          d='m4,4 v138 a6,6 0 0 0 6,6 h132 a6,6 0 0 0 6,-6 v-56
          a6,6, 0 0 0 -6,-6 h-70 v-70 a6,6, 0 0 0 -6,-6 h-56 a6,6, 0 0 0 -6,6 z'
          style="fill: #FFFFB3; pointer-events: none;"
          opacity='0'
        />
      </g>
    </g>
  </svg>
</template>

<script>
import anime from 'animejs/lib/anime.es';
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
      settings: Settings,
    };
  },
  mounted() {
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
    placed(i) {
      if (this.pieces[i].value === 0) {
        this.$emit('placed', Settings.itox(i), Settings.itoy(i));

        if (this.pieces[i].value === 2) {
          anime({
            targets: ['.svg-attributes-demo'],
            keyframes: [
              { opacity: 1.0, duration: 0 },
              { d: 'm4,4 v138 a6,6 0 0 0 6,6 h56 a6,6 0 0 0 6,-6 v-56 a0,0, 0 0 0 0,0 h-0 v-70 a6,6, 0 0 0 -6,-6 h-56 a6,6, 0 0 0 -6,6 z' },
              { d: 'm4,4 v62 a6,6 0 0 0 6,6 h56 a6,6 0 0 0 6,-6 v-0 a0,0, 0 0 0 0,0 h-0 v-56 a6,6, 0 0 0 -6,-6 h-56 a6,6, 0 0 0 -6,6 z' },
              { opacity: 0.0 },
              { d: 'm4,4 v138 a6,6 0 0 0 6,6 h132 a6,6 0 0 0 6,-6 v-56 a6,6, 0 0 0 -6,-6 h-70 v-70 a6,6, 0 0 0 -6,-6 h-56 a6,6, 0 0 0 -6,6 z', duration: 0 },
            ],
            baseFrequency: 0,
            scale: 1,
            direction: 'normal',
            easing: 'linear',
            duration: 2000,
          });
        }
      }
    },
    scale(value) {
      const t = value / this.boardSize;
      return this.innerWidth * t;
    },
  },
};
</script>
