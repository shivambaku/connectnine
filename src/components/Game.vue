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
          {{score}}
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
      score: 0,
      savedState: {
        boardPieces: [],
        selectorPieces: [],
        futureSelectorPieces: [],
        selectedIndex: 0,
        score: 0,
      },
      canUndo: false,
    };
  },
  mounted() {
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

    if (!this.loadFromLocalStorage()) {
      this.newGame();
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
      this.saveToLocalStorage();
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
        this.score += visited.size * value;

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
      this.score = 0;

      this.saveState();

      this.canUndo = false;

      this.clearStorage();
    },
    undo() {
      const nextPiece = this.selectorPieces[this.savedState.selectedIndex].value;
      this.savedState.futureSelectorPieces[this.savedState.selectedIndex] = nextPiece;
      this.boardPieces = JSON.parse(JSON.stringify(this.savedState.boardPieces));
      this.selectorPieces = JSON.parse(JSON.stringify(this.savedState.selectorPieces));
      this.score = this.savedState.score;
      this.canUndo = false;
      this.saveToLocalStorage();
    },
    saveState() {
      this.savedState.boardPieces = JSON.parse(JSON.stringify(this.boardPieces));
      this.savedState.selectorPieces = JSON.parse(JSON.stringify(this.selectorPieces));
      this.savedState.selectedIndex = this.selectedIndex;
      this.savedState.score = this.score;
      this.savedState.futureSelectorPieces[this.selectedIndex] = null;
      this.canUndo = true;
    },
    saveToLocalStorage() {
      if (this.storageAvailable()) {
        localStorage.setItem('boardPieces', JSON.stringify(this.boardPieces));
        localStorage.setItem('selectorPieces', JSON.stringify(this.selectorPieces));
        localStorage.setItem('savedState', JSON.stringify(this.savedState));
        localStorage.setItem('selectedIndex', this.selectedIndex);
        localStorage.setItem('score', this.score);
        localStorage.setItem('canUndo', this.canUndo);
      }
    },
    loadFromLocalStorage() {
      if (!this.storageAvailable()) {
        return false;
      }

      if (localStorage.getItem('boardPieces')) {
        try {
          this.boardPieces = JSON.parse(localStorage.getItem('boardPieces'));
        } catch {
          localStorage.removeItem('boardPieces');
          return false;
        }
      } else {
        return false;
      }

      if (localStorage.getItem('selectorPieces')) {
        try {
          this.selectorPieces = JSON.parse(localStorage.getItem('selectorPieces'));
        } catch {
          localStorage.removeItem('selectorPieces');
          return false;
        }
      } else {
        return false;
      }

      if (localStorage.getItem('savedState')) {
        try {
          this.savedState = JSON.parse(localStorage.getItem('savedState'));
        } catch {
          localStorage.removeItem('savedState');
          return false;
        }
      } else {
        return false;
      }

      if (localStorage.getItem('selectedIndex')) {
        try {
          this.selectedIndex = parseInt(localStorage.getItem('selectedIndex'), 10);
        } catch {
          localStorage.removeItem('selectedIndex');
          return false;
        }
      } else {
        return false;
      }

      if (localStorage.getItem('score')) {
        try {
          this.score = parseInt(localStorage.getItem('score'), 10);
        } catch {
          localStorage.removeItem('score');
          return false;
        }
      } else {
        return false;
      }

      if (localStorage.getItem('canUndo')) {
        try {
          this.canUndo = localStorage.getItem('canUndo') === 'true';
        } catch {
          localStorage.removeItem('canUndo');
          return false;
        }
      } else {
        return false;
      }

      return true;
    },
    clearStorage() {
      if (this.storageAvailable()) {
        localStorage.clear();
      }
    },
    storageAvailable() {
      try {
        const storageTest = '__storage_test__';
        localStorage.setItem(storageTest, storageTest);
        localStorage.removeItem(storageTest);
        return true;
      } catch {
        return false;
      }
    },
  },
};
</script>
