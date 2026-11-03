export const SUITS = Object.freeze(['hearts', 'diamonds', 'clubs', 'spades']);

export const RANKS = Object.freeze(['7', '8', '9', '10', 'Jack', 'Queen', 'King', 'Ace']);

export function createDeck() {
    return SUITS.flatMap((suit) =>
        RANKS.map((rank) => Object.freeze({ id: `${suit}-${rank}`, suit, rank }))
    );
}

export function shuffle(cards, random = Math.random) {
    const copy = [...cards];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}

export function canPlayCard(card, topCard, wishedSuit = null) {
    if (card.rank === 'jack') return true;
    if (wishedSuit !== null) return card.suit === wishedSuit;
    return card.suit === topCard.suit || card.rank === topCard.rank;
}

export function getPlayableCards(hand, topCard, wishedSuit = null) {
    return hand.filter((card) => canPlayCard(card, topCard, wishedSuit));
}