import { createDeck, shuffle } from './rules.js';

export const HAND_SIZE = 5;

const MIN_PLAYERS = 2;
const MAX_PLAYERS = 4;

export function createGame({ playerCount = 2, random = Math.random } = {}) {
    if (!Number.isInteger(playerCount) || playerCount < MIN_PLAYERS || playerCount > MAX_PLAYERS) {
        throw new RangeError(`playerCount must be an integer between ${MIN_PLAYERS} and ${MAX_PLAYERS}`);
    }

    const deck = shuffle(createDeck(), random);

    const players = Array.from({length: playerCount}, (index) => ({
        id: `player-${index}`,
        hand: [],
    }));

    const dealtCount = playerCount * HAND_SIZE;
    for (let i = 0; i < dealtCount; i++) {
        players[i % playerCount].hand.push(deck[i]);
    }

    const firstDiscard = deck[dealtCount];

    const drawPile = deck.slice(dealtCount + 1);

    return {
        players,
        drawPile,
        discardPile: [firstDiscard],
        currentPlayerIndex: 0,
        status: 'playing',
    };
}

export function getTopCard(state) {
    return state.discardPile[state.discardPile.length - 1];
}