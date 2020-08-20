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
      <g ref='connectionAnimationGroup'>
        <rect
          v-for='(d, i) in animationData'
          :key='`animationData${i}`'
          :id='i'
          :class='d.level === 1 ? "level1rect" : "level2rect"'
          style='pointer-events: none;'
          fill='#FFFFb3'
          rx='6'
          ry='6'
          :x='d.x < d.parentX ? scale(d.x) : scale(d.parentX)'
          :y='d.y < d.parentY ? scale(d.y) : scale(d.parentY)'
          :width='d.x === d.parentX ? pieceSize : pieceSize * 2'
          :height='d.y === d.parentY ? pieceSize : pieceSize * 2'
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
    animationData: Array,
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
  computed: {
    innerWidth() {
      return this.width - 2 * this.padding;
    },
    pieceSize() {
      return this.innerWidth / this.boardSize;
    },
  },
  updated() {
    this.animateConnections();
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
    animateConnections() {
      const timeline = anime.timeline({
        easing: 'linear',
        duration: 300,
      });

      // const widthAnimation = (el) => {
      //   const d = this.animationData[el.id];
      //   return d.x == d.parentX ? this.pieceSize;
      // };

      // const heightAnimation = (el) => {
      //   const d = this.animationData[el.id];
      //   return d.y == d.parentY ? this.pieceSize;
      // };

      const xAnimation = (el) => {
        const d = this.animationData[el.id];
        return this.scale(d.parentX);
      };

      const yAnimation = (el) => {
        const d = this.animationData[el.id];
        return this.scale(d.parentY);
      };

      timeline
        .add({
          targets: '.level2rect',
          keyframes: [
            {
              width: this.pieceSize,
              height: this.pieceSize,
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
              width: this.pieceSize,
              height: this.pieceSize,
              x: xAnimation,
              y: yAnimation,
            },
            { opacity: 0.0 },
          ],
        });
    },
  },
};
</script>
