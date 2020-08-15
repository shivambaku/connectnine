<template>
  <div class='game'>
    <Board
      :pieces='boardPieces'
      @placed='placed'
    />
    <Selector
      :pieces='selectorPieces'
      :selectedIndex='selectedIndex'
      @selected='selected'
    />
  </div>
</template>

<script>
import Board from './Board.vue';
import Selector from './Selector.vue';
import Settings from '../settings';

export default {
  components: {
    Board,
    Selector,
  },
  data() {
    return {
      boardPieces: [],
      selectorPieces: [],
      selectedIndex: 0,
    };
  },
  created() {
    for (let i = 0; i < Settings.boardSize * Settings.boardSize; i += 1) {
      this.boardPieces.push({ value: 0 });
    }

    for (let i = 0; i < Settings.selectorCount; i += 1) {
      this.selectorPieces.push({ value: this.getRandomPiece() });
    }
  },
  computed: {
    selectedPiece: {
      get() {
        return this.selectorPieces[this.selectedIndex];
      },
      set(value) {
        this.selectorPieces[this.selectedIndex] = value;
      },
    },
  },
  methods: {
    getRandomPiece() {
      const rand = Math.random();

      let sum = 0;
      for (let i = 0; i < Settings.randomness.length; i += 1) {
        sum += Settings.randomness[i];
        if (rand <= sum) {
          return i + 1;
        }
      }

      return 0;
    },
    selected(index) {
      this.selectedIndex = index;
    },
    placed(index) {
      this.boardPieces[index].value = this.selectedPiece.value;
      this.selectedPiece.value = this.getRandomPiece();
    },
  },
};
</script>
