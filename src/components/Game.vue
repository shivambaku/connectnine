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
          {{gameState.score}}
        </div>
      </div>
    </div>
    <Board
      :pieces='gameState.boardPieces'
      @placed='placed'
    />
    <Selector
      :pieces='gameState.selectorPieces'
      :selectedIndex='gameState.selectedIndex'
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
      version: '1.0.0',
      gameState: {
        boardPieces: [],
        selectorPieces: [],
        selectedIndex: 0,
        score: 0,
      },
      savedState: {},
      canUndo: false,
      futureSelectorPieces: [],
    };
  },
  mounted() {
    window.addEventListener('keydown', (event) => {
      if (!event.defaultPrevented) {
        switch (event.code) {
          case 'Digit1':
            this.gameState.selectedIndex = 0;
            break;
          case 'Digit2':
            this.gameState.selectedIndex = 1;
            break;
          case 'Digit3':
            this.gameState.selectedIndex = 2;
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
        return this.gameState.selectorPieces[this.gameState.selectedIndex];
      },
      set(value) {
        this.gameState.selectorPieces[this.gameState.selectedIndex] = value;
      },
    },
  },
  methods: {
    getRandomPiece() {
      if (this.futureSelectorPieces[this.gameState.selectedIndex] !== null) {
        return this.futureSelectorPieces[this.gameState.selectedIndex];
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
      this.gameState.selectedIndex = index;
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
      this.gameState.boardPieces[index].value = value;

      // check if connections were formed
      const visited = new Set();
      this.checkConnections(x, y, value, visited);

      // a connection was formed
      if (visited.size >= 3) {
        this.gameState.score += visited.size * value;

        // besides the placed piece, set all visited pieces to empty
        visited.delete(index);

        visited.forEach((visitedIndex) => {
          this.gameState.boardPieces[visitedIndex].value = 0;
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
      return this.gameState.boardPieces[index].value === value;
    },
    newGame() {
      this.futureSelectorPieces = [];
      for (let i = 0; i < Settings.selectorCount; i += 1) {
        this.futureSelectorPieces.push(null);
      }

      this.gameState.boardPieces = [];
      for (let i = 0; i < Settings.boardSize * Settings.boardSize; i += 1) {
        this.gameState.boardPieces.push({ value: 0 });
      }

      this.gameState.selectorPieces = [];
      for (let i = 0; i < Settings.selectorCount; i += 1) {
        this.gameState.selectorPieces.push({ value: this.getRandomPiece() });
      }

      this.gameState.selectedIndex = 0;
      this.gameState.score = 0;

      this.saveState();
      this.clearStorage();

      this.canUndo = false;
    },
    undo() {
      const nextPiece = this.gameState.selectorPieces[this.savedState.selectedIndex].value;
      this.futureSelectorPieces[this.savedState.selectedIndex] = nextPiece;
      this.canUndo = false;
      this.gameState = JSON.parse(JSON.stringify(this.savedState));

      this.saveToLocalStorage();
    },
    saveState() {
      this.savedState = JSON.parse(JSON.stringify(this.gameState));
      this.futureSelectorPieces[this.gameState.selectedIndex] = null;
      this.canUndo = true;
    },
    saveToLocalStorage() {
      if (this.storageAvailable()) {
        const store = {
          version: this.version,
          gameState: this.gameState,
          savedState: this.savedState,
          futureSelectorPieces: this.futureSelectorPieces,
          canUndo: this.canUndo,
        };
        localStorage.setItem('gameStore', JSON.stringify(store));
      }
    },
    loadFromLocalStorage() {
      if (this.storageAvailable()) {
        try {
          const store = JSON.parse(localStorage.getItem('gameStore'));
          if (store !== null && store.version === this.version) {
            this.gameState = store.gameState;
            this.savedState = store.savedState;
            this.futureSelectorPieces = store.futureSelectorPieces;
            this.canUndo = store.canUndo;
            return true;
          }
        } catch {
          localStorage.removeItem('gameStore');
        }
      }
      return false;
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
