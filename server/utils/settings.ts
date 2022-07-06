export default {
  boardSize: 5,
  selectorCount: 3,
  randomness: [
    [0.7, 0.30], // Initial
    [0.5, 0.30, 0.20], // After a 3
    [0.49, 0.30, 0.20, 0.01], // After a 4
    [0.488, 0.30, 0.20, 0.01, 0.002], // After a 5
  ],
};
