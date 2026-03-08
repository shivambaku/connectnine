import type { ClientGameState, ClientPlayer, ConnectionAnimationDataPart, ScoreAnimationInfo } from '~~/shared/types/interfaces'
import { onKeyDown, useStorage } from '@vueuse/core'
import { Filter } from 'bad-words'
import { defineStore } from 'pinia'

export const useGameStore = defineStore('gameStore', () => {
    const gameState = ref({} as ClientGameState)
    const selectedIndex = ref(0)
    const paused = ref(false)
    const playerId = useStorage<string>('playerId', null)
    const currentName = ref('guest')
    const awaitingServer = ref(false)
    const filter = new Filter()
    const { status: loadingGameStatus, refresh: load } = useLazyFetch('/api/game/load', {
        method: 'POST',
        body: { playerId: playerId.value },
        onResponse({ response }) {
            const clientPlayer: ClientPlayer = response._data
            playerId.value = clientPlayer.id
            currentName.value = clientPlayer.currentName
            gameState.value = clientPlayer.currentGameState
            return response._data
        },
    })
    let animating = false
    let placedCachedGameState: string | null = null

    // Track the highest number before the current move for detecting milestones
    let preMovHighestNumber = 0

    // const load = async () => {
    //   const clientPlayer = await $fetch('/api/game/load', { method: 'post', body: { playerId: playerId.value } });
    //   playerId.value = clientPlayer.id;
    //   currentName.value = clientPlayer.currentName;
    //   gameState.value = clientPlayer.currentGameState;
    // };

    async function newGame() {
        if (animating || awaitingServer.value)
            return

        awaitingServer.value = true
        gameState.value = await $fetch('/api/game/new', { method: 'post', body: { playerId: playerId.value } })
        awaitingServer.value = false
    };

    const place = async (x: number, y: number) => {
        if (awaitingServer.value)
            return

        awaitingServer.value = true
        gameState.value
            = await $fetch('/api/game/place', { method: 'post', body: { playerId: playerId.value, x, y, selectedIndex: selectedIndex.value } })
        awaitingServer.value = false
    }

    const placeInCacheIfAnimating = async (x: number, y: number) => {
        awaitingServer.value = true
        const response = await $fetch('/api/game/place', { method: 'post', body: { playerId: playerId.value, x, y, selectedIndex: selectedIndex.value } })

        // if animating then save the response and set it after animation is done
        // if done after animation then directly set the gameState
        if (animating)
            placedCachedGameState = JSON.stringify(response)
        else
            gameState.value = response
        awaitingServer.value = false
    }

    const setPlacedCacheToGameState = () => {
        if (placedCachedGameState !== null) {
            gameState.value = JSON.parse(placedCachedGameState)
            placedCachedGameState = null
        }
    }

    const select = async (i: number) => {
        selectedIndex.value = i
    }

    onKeyDown(['1', '2', '3'], (e) => {
        if (paused.value)
            return
        select(Number.parseInt(e.key) - 1)
    })

    const undo = async () => {
        if (animating || awaitingServer.value || paused.value)
            return

        awaitingServer.value = true
        gameState.value = gameState.value.previousState ? JSON.parse(gameState.value.previousState) : gameState.value
        gameState.value = await $fetch('/api/game/undo', { method: 'post', body: { playerId: playerId.value } })
        awaitingServer.value = false
    }

    const boardSize = computed(() => {
        if (!gameState.value.boardPieces)
            return 5

        return Math.sqrt(gameState.value.boardPieces.length)
    })

    const sameValue = (index: number, value: number) => {
        return gameState.value.boardPieces[index] === value
    }

    const outOfBounds = (x: number, y: number) => {
        return x < 0 || x >= boardSize.value || y < 0 || y >= boardSize.value
    }

    const xytoi = (x: number, y: number) => {
        return y * boardSize.value + x
    }

    const checkConnections = (x: number, y: number, value: number, visited: Set<number>, connectionAnimationDataPart: Array<ConnectionAnimationDataPart>, parentX: number, parentY: number, level: number) => {
        const index = xytoi(x, y)
        if (!outOfBounds(x, y) && sameValue(index, value) && !visited.has(index)) {
            visited.add(index)

            if (level !== 0) {
                connectionAnimationDataPart.push({
                    x,
                    y,
                    parentX,
                    parentY,
                    level,
                    value,
                })
            }

            checkConnections(x, y + 1, value, visited, connectionAnimationDataPart, x, y, level + 1)
            checkConnections(x + 1, y, value, visited, connectionAnimationDataPart, x, y, level + 1)
            checkConnections(x, y - 1, value, visited, connectionAnimationDataPart, x, y, level + 1)
            checkConnections(x - 1, y, value, visited, connectionAnimationDataPart, x, y, level + 1)
        }
    }

    type AnimateConnectionFn = (data: ConnectionAnimationDataPart[], callback: () => void) => void
    type OnMilestoneFn = (scoreInfo: ScoreAnimationInfo) => void

    const animatedPlaceHelper = (x: number, y: number, value: number, animateConnection: AnimateConnectionFn, onMilestone: OnMilestoneFn) => {
        const index = xytoi(x, y)

        // place the piece
        gameState.value.boardPieces[index] = value

        // check if connections were formed
        const visited = new Set<number>()
        const connectionAnimationData = new Array<ConnectionAnimationDataPart>()
        checkConnections(x, y, value, visited, connectionAnimationData, x, y, 0)

        // a connection was formed
        if (visited.size >= 3) {
            gameState.value.score += visited.size * value * 10

            // besides the placed piece set all visited pieces to empty
            visited.delete(index)
            for (const visitedIndex of visited)
                gameState.value.boardPieces[visitedIndex] = 0

            const newValue = value + 1

            // reaching 9: clear the 9 cell (connected tiles already cleared above), then fly it
            if (newValue >= 9) {
                gameState.value.boardPieces[index] = 9

                // Reaching 9 is always a milestone
                const scoreInfo: ScoreAnimationInfo = 9 > preMovHighestNumber
                    ? { type: 'new_highest', value: 9, sourceX: x, sourceY: y }
                    : { type: 'count_increase', value: 9, sourceX: x, sourceY: y }

                animateConnection(connectionAnimationData, () => {
                    // Clear only the 9 cell from the board
                    gameState.value.boardPieces[index] = 0

                    // Unblock the board immediately so the player can place the next piece.
                    // The fly-to-score animation is purely cosmetic and runs independently.
                    animating = false
                    setPlacedCacheToGameState()

                    // Fire-and-forget: fly the 9 to the score container
                    onMilestone(scoreInfo)
                })
            }
            else {
                gameState.value.boardPieces[index] = newValue

                animateConnection(connectionAnimationData, () => {
                    // Recurse: the new value might chain into more connections
                    animatedPlaceHelper(x, y, newValue, animateConnection, onMilestone)
                })
            }
        }
        else {
            // No more connections — chain has ended.
            // Unblock the board immediately.
            animating = false
            setPlacedCacheToGameState()

            // Check if this value is a new highest number — fly it to the score (cosmetic).
            // Count increases (same highest) are handled in-place by watchers in index.vue.
            if (value > preMovHighestNumber) {
                const scoreInfo: ScoreAnimationInfo = { type: 'new_highest', value, sourceX: x, sourceY: y }
                onMilestone(scoreInfo)
            }
        }
    }

    const animatedPlace = (x: number, y: number, animateConnection: AnimateConnectionFn, onMilestone: OnMilestoneFn) => {
        if (animating || awaitingServer.value)
            return

        animating = true

        // Snapshot the pre-move highest number for milestone detection
        preMovHighestNumber = gameState.value.highestNumber

        placeInCacheIfAnimating(x, y)

        // run the game logic on the client as well while waiting for the real response
        animatedPlaceHelper(x, y, gameState.value.selectorPieces[selectedIndex.value], animateConnection, onMilestone)

        // set the selected piece to the next piece
        gameState.value.selectorPieces[selectedIndex.value] = gameState.value.nextSelectorPiece
    }

    const registerName = async (name: string) => {
        if (filter.isProfane(name))
            return false

        currentName.value = name
        await $fetch('/api/game/registername', { method: 'post', body: { playerId: playerId.value, name: currentName.value } })
        return true
    }

    return { gameState, selectedIndex, paused, boardSize, registeredName: currentName, loadingGameStatus, load, newGame, place, select, undo, animatedPlace, registerName }
})
