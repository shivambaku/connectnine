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
      <g>
        <rect
          ref='test'
          v-for='(d, i) in animationData'
          :key='`animationData${i}`'
          :id='i'
          :class='`${d.level === 1 ? "level1rect" : "level2rect"} piece piece-${d.value}`'
          style='pointer-events: none;'
          rx='6'
          ry='6'
          :x='d.x < d.parentX ? animationScale(d.x) : animationScale(d.parentX)'
          :y='d.y < d.parentY ? animationScale(d.y) : animationScale(d.parentY)'
          :width='d.x === d.parentX ? animationPieceSize : animationTwoPieceSize'
          :height='d.y === d.parentY ? animationPieceSize : animationTwoPieceSize'
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
    boardBus: Object,
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
      animationData: [],
    };
  },
  computed: {
    innerWidth() {
      return this.width - 2 * this.padding;
    },
    pieceSize() {
      return this.innerWidth / this.boardSize;
    },
    animationPieceSize() {
      return this.pieceSize - 2 * Design.piece.padding;
    },
    animationTwoPieceSize() {
      return 2 * (this.animationPieceSize + Design.piece.padding);
    },
  },
  created() {
    this.boardBus.$on('animateConnections', this.animateConnections);
  },
  methods: {
    placed(i) {
      if (this.pieces[i].value === 0) {
        this.$emit('placed', Settings.itox(i), Settings.itoy(i));
      }
    },
    scale(value) {
      const t = value / this.boardSize;
      return this.innerWidth * t;
    },
    animationScale(value) {
      return this.scale(value) + Design.piece.padding;
    },
    animateConnections(animationData, callback) {
      console.log(animationData);
      this.animationData = animationData;

      this.$nextTick(() => {
        const timeline = anime.timeline({
          easing: 'linear',
          duration: 200,
          complete: () => {
            this.animationData = [];
            this.$nextTick(() => {
              callback();
            });
          },
        });

        const xAnimation = (el) => {
          const d = this.animationData[el.id];
          return this.animationScale(d.parentX);
        };

        const yAnimation = (el) => {
          const d = this.animationData[el.id];
          return this.animationScale(d.parentY);
        };

        timeline
          .add({
            targets: '.level2rect',
            keyframes: [
              {
                width: this.animationPieceSize,
                height: this.animationPieceSize,
                x: xAnimation,
                y: yAnimation,
              },
              { opacity: 0.0, duration: 0 },
            ],
          })
          .add({
            targets: '.level1rect',
            keyframes: [
              {
                width: this.animationPieceSize,
                height: this.animationPieceSize,
                x: xAnimation,
                y: yAnimation,
              },
              { opacity: 0.0, duration: 0 },
            ],
          });
      });
    },
  },
};
</script>
