<script setup lang="ts">
import type { ScoreAnimationInfo } from '~~/shared/types/interfaces'
import { createTimeline } from 'animejs'
import { storeToRefs } from 'pinia'

const gameStore = useGameStore()
const { gameState, selectedIndex, paused, boardSize, loadingGameStatus } = storeToRefs(gameStore)
const { newGame, animatedPlace, select, undo } = gameStore
const showNewGameConfirmation = ref(false)

const loading = computed(() => loadingGameStatus.value === 'pending')

// Refs for score animation targets
const scoreContainerRef = ref<HTMLElement | null>(null)
const boardRef = ref<any>(null)

// Template refs for animated elements
const countOutgoingRef = ref<SVGTextElement | null>(null)
const countIncomingRef = ref<SVGTextElement | null>(null)
const scorePieceGroupRef = ref<SVGGElement | null>(null)

// Rolling counter state
const displayedCount = ref(0)
const outgoingCount = ref<number | null>(null)

// Track displayed highest number (for the rank piece)
const displayedHighestNumber = ref(0)

// When true, watchers defer — the fly-to-score animation will handle score updates
const isFlyingToScore = ref(false)

// Whether the game has been loaded at least once (skip animations on initial load)
const hasInitialized = ref(false)

// Watch count changes — animate on change (unless flying, which handles its own animation)
watch(() => gameState.value.highestNumberCount, (newVal) => {
    if (isFlyingToScore.value)
        return
    if (!hasInitialized.value) {
        // First load — just set the value silently
        displayedCount.value = newVal
        return
    }
    if (newVal !== displayedCount.value) {
        animateCountChange(newVal)
    }
}, { immediate: true })

// Watch rank changes — animate on change (unless flying, which handles its own animation)
watch(() => gameState.value.highestNumber, (newVal) => {
    if (isFlyingToScore.value)
        return
    if (!hasInitialized.value) {
        // First load — just set the value silently
        displayedHighestNumber.value = newVal
        return
    }
    if (newVal !== displayedHighestNumber.value) {
        animateRankChange(newVal)
        // When rank changes, count resets to 1
        animateCountChange(gameState.value.highestNumberCount)
    }
}, { immediate: true })

onMounted(() => {
    paused.value = false

    // Mark initialized after first tick so watchers can start animating
    nextTick(() => {
        hasInitialized.value = true

        if (boardRef.value && scoreContainerRef.value) {
            boardRef.value.setScoreAnimationContext(onScoreAnimation, onFlyStart, scoreContainerRef.value)
        }
    })
})

// Watch for ref changes to update the board's context
watch([scoreContainerRef, boardRef], () => {
    if (boardRef.value && scoreContainerRef.value) {
        boardRef.value.setScoreAnimationContext(onScoreAnimation, onFlyStart, scoreContainerRef.value)
    }
})

/**
 * Called when a flying tile arrives at the score container (any milestone).
 * Triggers the appropriate score animation (counter roll and/or rank pulse).
 * Also releases the isFlyingToScore flag so watchers resume normal behavior.
 */
function onScoreAnimation(info: ScoreAnimationInfo) {
    isFlyingToScore.value = false

    if (info.type === 'new_highest') {
        animateRankChange(info.value)
        animateCountChange(1)
    }
    else if (info.type === 'count_increase') {
        animateCountChange(displayedCount.value + 1)
    }
}

/**
 * Called by the board BEFORE starting the fly-to-score animation.
 * Prevents watchers from prematurely updating the score display.
 */
function onFlyStart() {
    isFlyingToScore.value = true
}

/**
 * Animate the xN counter rolling from old value to new value.
 * Old number slides up and fades, new number slides in from below.
 */
function animateCountChange(newCount: number) {
    if (newCount === displayedCount.value)
        return

    outgoingCount.value = displayedCount.value
    displayedCount.value = newCount

    nextTick(() => {
        const outgoing = countOutgoingRef.value
        const incoming = countIncomingRef.value

        const timeline = createTimeline({
            defaults: { ease: 'outCubic', duration: 300 },
            onComplete: () => {
                outgoingCount.value = null
            },
        })

        if (outgoing) {
            timeline.add(outgoing, {
                translateY: '-14px',
                opacity: 0,
            }, 0)
        }
        if (incoming) {
            timeline.add(incoming, {
                translateY: '0px',
                opacity: 1,
            }, 0)
        }
    })
}

/**
 * Animate the rank tile: pulse/scale bounce when highest number changes.
 */
function animateRankChange(newValue: number) {
    if (newValue === displayedHighestNumber.value)
        return

    displayedHighestNumber.value = newValue

    nextTick(() => {
        const group = scorePieceGroupRef.value
        if (!group)
            return

        createTimeline({
            defaults: { ease: 'outBack' },
        })
            .add(group, {
                scale: 1.3,
                duration: 200,
            })
            .add(group, {
                scale: 1,
                duration: 400,
                ease: 'outElastic(1, 0.5)',
            })
    })
}

function newGameClick() {
    paused.value = true
    showNewGameConfirmation.value = true
}

function closeConfirmation() {
    paused.value = false
    showNewGameConfirmation.value = false
}

async function newGameConfirmationClick() {
    closeConfirmation()
    await newGame()
}
</script>

<template>
    <div>
        <div>
            <div :class="`game ${paused ? 'paused' : ''} ${loading ? 'loading' : ''}`">
                <div class="header">
                    <div style="float: left">
                        <h1 class="title">
                            Connect 9
                        </h1>
                        <Button :loading="loading" @click="newGameClick">
                            New Game
                        </Button>
                        <Button :loading="loading" style="margin-left: 10px"
                            :disabled="gameState.previousState === null" @click="undo">
                            Undo
                        </Button>
                    </div>
                    <div v-if="loading" class="score-container skeleton" />
                    <div v-else ref="scoreContainerRef" class="score-container">
                        <svg viewBox="0 0 140 80" width="100%" style="overflow: visible">
                            <!-- Rank piece with scale animation group -->
                            <g ref="scorePieceGroupRef" class="score-piece-group"
                                :style="{ transformOrigin: '70px 29px' }">
                                <Piece class="score" :value="displayedHighestNumber" :x="45" :y="4" :width="50"
                                    :padding="0" :radius="6" />
                            </g>
                            <!-- Count badge background -->
                            <rect fill="var(--game-foreground-color)" :rx="2" :ry="2" :x="85" :y="32" :width="28"
                                :height="22" />
                            <!-- Clip path for count rolling animation -->
                            <clipPath id="count-clip">
                                <rect :x="85" :y="32" :width="28" :height="22" />
                            </clipPath>
                            <!-- Count text with rolling animation -->
                            <g class="count-text-group" clip-path="url(#count-clip)">
                                <!-- Outgoing count (slides up during animation) -->
                                <text v-if="outgoingCount !== null" ref="countOutgoingRef" :x="99" :y="44"
                                    dominant-baseline="middle" text-anchor="middle" font-size="12" fill="white"
                                    font-style="italic">x{{ outgoingCount }}</text>
                                <!-- Current count (slides in from below during animation, or static) -->
                                <text ref="countIncomingRef" :x="99" :y="44" dominant-baseline="middle"
                                    text-anchor="middle" font-size="12" fill="white" font-style="italic"
                                    :style="outgoingCount !== null ? { transform: 'translateY(14px)', opacity: 0 } : {}">x{{
                                        displayedCount }}</text>
                            </g>
                            <text x="50%" y="82%" dominant-baseline="hanging" text-anchor="middle" font-size="12"
                                fill="var(--game-foreground-color)" font-style="italic">{{ gameState.highestNumberMoves
                                }} moves</text>
                        </svg>
                    </div>
                </div>
                <div style="position: relative;">
                    <div v-if="loading" class="loader">
                        Loading...
                    </div>
                    <Board ref="boardRef" :loading="loading" :padding="10" :width="400" :piece-padding="4"
                        :piece-radius="6" :board-size="boardSize" :pieces="gameState.boardPieces" :unclickable="paused"
                        @animated-place="animatedPlace" />
                    <div v-show="showNewGameConfirmation" class="confirmation-overlay">
                        <Confirmation text="Start new game?" @yes="newGameConfirmationClick" @no="closeConfirmation" />
                    </div>
                </div>
                <Selector :loading="loadingGameStatus === 'pending'" :padding="10" :width="200"
                    :selected-index="selectedIndex" :pieces="gameState.selectorPieces" :unclickable="paused"
                    @select="select" />
            </div>
            <div class="rules">
                <h4>How to Play</h4>
                <p>
                    Select one of the three available numbers and place it in an empty spot.
                    <br>
                    Connect three or more of the same adjacent numbers to get a higher number.
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.game {
    max-width: 400px;
    min-width: 300px;
    margin: 0 auto;
}

.game .button {
    background: var(--game-background-color);
    color: var(--game-foreground-color);
}

@media(hover: hover) and (pointer: fine) {
    .game:not(.paused) .button:not(.skeleton):hover {
        background: var(--game-foreground-color);
        color: var(--game-background-color);
        cursor: pointer;
    }

    .game.paused .button:hover {
        cursor: default;
    }
}

.game .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
}

.game .header .title {
    letter-spacing: 2px;
    font-size: 38px;
    margin: 5px 0px 10px;
    white-space: nowrap;
}

.game .header .score-container {
    background: var(--game-background-color);
    width: 35%;
    min-width: 90px;
    margin-left: 10px;
    border-radius: 10px;
    align-self: stretch;
    margin-top: 10px;
    display: flex;
    align-items: center;
}

.game .header .score-container.skeleton {
    opacity: 0.5;
    min-height: 80px;
}

.game .confirmation-overlay {
    position: absolute;
    width: 62.5%;
    height: 36%;
    top: 32%;
    left: 18.75%;
}

.rules h4 {
    margin-top: 30px;
    margin-bottom: 0px;
    font-size: 18px;
}

@media screen and (max-width: 550px) {
    .rules br {
        display: none;
    }
}

.rules p {
    font-size: 15px;
    font-weight: 200;
    margin: 5px;
}
</style>
