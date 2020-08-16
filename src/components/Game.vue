<template>
  <div class='game'>
    <div class='header'>
      <div style='float: left'>
        <h1 class='title'>
          Connect 9
        </h1>
        <div class='button' @click='newGame'>
          New Game
        </div>
        <div :class='`button ${this.canUndo ? "" : "disabled"}`'
             style='margin-left: 10px'
             @click='undo'>
          Undo
        </div>
      </div>
      <div class='score-container'>
        <div class='score'>
          2342
        </div>
      </div>
    </div>
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
      savedState: {
        boardPieces: [],
        selectorPieces: [],
        futureSelectorPieces: [],
        selectedIndex: 0,
      },
      canUndo: false,
    };
  },
  created() {
    this.newGame();

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
      if (this.savedState.futureSelectorPieces[this.selectedIndex] !== null) {
        return this.savedState.futureSelectorPieces[this.selectedIndex];
      }

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
      const nextValue = this.getRandomPiece();
      this.saveState();
      this.place(x, y, this.selectedPiece.value);
      this.selectedPiece.value = nextValue;
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
    newGame() {
      for (let i = 0; i < Settings.selectorCount; i += 1) {
        this.savedState.futureSelectorPieces.push(null);
      }

      this.boardPieces = [];
      for (let i = 0; i < Settings.boardSize * Settings.boardSize; i += 1) {
        this.boardPieces.push({ value: 0 });
      }

      this.selectorPieces = [];
      for (let i = 0; i < Settings.selectorCount; i += 1) {
        this.selectorPieces.push({ value: this.getRandomPiece() });
      }

      this.selectedIndex = 0;

      this.saveState();

      this.canUndo = false;
    },
    undo() {
      const nextPiece = this.selectorPieces[this.savedState.selectedIndex].value;
      this.savedState.futureSelectorPieces[this.savedState.selectedIndex] = nextPiece;
      this.boardPieces = JSON.parse(JSON.stringify(this.savedState.boardPieces));
      this.selectorPieces = JSON.parse(JSON.stringify(this.savedState.selectorPieces));
      this.canUndo = false;
    },
    saveState() {
      this.savedState.boardPieces = JSON.parse(JSON.stringify(this.boardPieces));
      this.savedState.selectorPieces = JSON.parse(JSON.stringify(this.selectorPieces));
      this.savedState.selectedIndex = this.selectedIndex;
      this.savedState.futureSelectorPieces[this.selectedIndex] = null;
      this.canUndo = true;
    },
  },
};
</script>
