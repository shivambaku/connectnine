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
      <g :transform='`translate(${151}, ${151})`'>
      <path
        class='svg-attributes-demo'
        d='M4,4 4,148 148,148 148,80 74,80 74,4 z'
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
              { d: 'M4,4 4,148 74,148 74,80 74,80 74,4z' },
              { d: 'M4,4 4,74 74,74 74,74 74,74 74,4z' },
              { opacity: 0.0 },
            ],
            baseFrequency: 0,
            scale: 1,
            direction: 'normal',
            easing: 'linear',
            duration: 500,
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
