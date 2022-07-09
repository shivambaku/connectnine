export default {
  boardSize: 5,
  selectorCount: 3,
  randomness: [
    [0.7, 0.30], // Initial
    [0.5, 0.30, 0.20], // After a 3
    [0.485, 0.30, 0.20, 0.015], // After a 4
    [0.481, 0.30, 0.20, 0.015, 0.004], // After a 5
  ],
};
