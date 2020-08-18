export default {
  boardSize: 5,
  selectorCount: 3,
  randomness: [0.4, 0.33, 0.22, 0.04, 0.01],
  itox(i) {
    return i % this.boardSize;
  },
  itoy(i) {
    return Math.floor(i / this.boardSize);
  },
};
