<template>
  <div class='game'>
    <div>
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

    window.addEventListener('keydown', (event) => {
      if (!event.defaultPrevented) {
        switch (event.code) {
          case 'Digit1':
            this.selectedIndex = 0;
            break;
          case 'Digit2':
            this.selectedIndex = 1;
            break;
          case 'Digit3':
            this.selectedIndex = 2;
            break;
          default:
            return;
        }

        // Consume the event so it doesn't get handled twice
        event.preventDefault();
      }
    }, true);
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
    xytoi(x, y) {
      return y * Settings.boardSize + x;
    },
    placed(x, y) {
      this.place(x, y, this.selectedPiece.value);
      this.selectedPiece.value = this.getRandomPiece();
    },
    place(x, y, value) {
      // place the piece
      const index = this.xytoi(x, y);
      this.boardPieces[index].value = value;

      // check if connections were formed
      const visited = new Set();
      this.checkConnections(x, y, value, visited);

      // a connection was formed
      if (visited.size >= 3) {
        // besides the placed piece, set all visited pieces to empty
        visited.delete(index);

        visited.forEach((visitedIndex) => {
          this.boardPieces[visitedIndex].value = 0;
        });

        this.place(x, y, value + 1);
      }
    },
    checkConnections(x, y, value, visited) {
      const index = this.xytoi(x, y);
      if (!this.outOfBounds(x, y) && this.sameValue(x, y, value) && !visited.has(index)) {
        visited.add(index);

        this.checkConnections(x, y + 1, value, visited);
        this.checkConnections(x + 1, y, value, visited);
        this.checkConnections(x, y - 1, value, visited);
        this.checkConnections(x - 1, y, value, visited);
      }
    },
    outOfBounds(x, y) {
      return x < 0 || x >= Settings.boardSize || y < 0 || y >= Settings.boardSize;
    },
    sameValue(x, y, value) {
      const index = this.xytoi(x, y);
      return this.boardPieces[index].value === value;
    },
  },
};
</script>
