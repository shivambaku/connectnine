<template>
  <div class='game'>
    <Board :pieces='pieces'/>
    <Selector/>
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
      pieces: [],
    };
  },
  created() {
    for (let i = 0; i < Settings.boardSize * Settings.boardSize; i += 1) {
      this.pieces.push({ value: 0 });
    }
  },
  computed: {
  },
  methods: {
  },
};
</script>
