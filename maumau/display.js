import { createGame, getTopCard } from './game.js';

const SUIT_SYMBOLS = Object.freeze({
  hearts: '♥',
  diamonds: '♦',
  clubs: '♣',
  spades: '♠',
});

const SUIT_NAMES = Object.freeze({
  hearts: 'Herz',
  diamonds: 'Karo',
  clubs: 'Kreuz',
  spades: 'Pik',
});

const RANK_SHORT = Object.freeze({
  '7': '7',
  '8': '8',
  '9': '9',
  '10': '10',
  'Jack': 'Bube',
  'Queen': 'Dame',
  'King': 'König',
  'Ace': 'Ass'
});

const RED_SUITS = new Set(['hearts', 'diamonds']);

function el(tag, className, text) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
}

function createCardElement(card) {
    const node = el('div', 'card');
    if (RED_SUITS.has(card.suit)) node.classList.add('card--red');
    node.setAttribute('role', 'img');
    node.setAttribute('aria-label', `${SUIT_NAMES[card.suit]} ${SUIT_NAMES[card.rank]}`);
    node.append(
        el('span', 'card_rank', RANK_SHORT[card.rank]),
        el('span', 'card_suit', SUIT_SYMBOLS[card.suit])
    );
    return node;
}

function createBackElement() {
    const node = el('div', 'card card--back');
    node.setAttribute('aria-hidden', 'true');
    return node;
}

export function render(state, root) {
    const [me, ...opponents] = state.players;

    const opponentsSection = el('section', 'opponents');
    opponents.forEach((opponent, index) => {
        const box = el('div', 'opponent');
        box.append(el('h2', 'area-title', `Gegner ${index + 1} (${opponent.hand.length} Karten)`));
        const row = el('div', 'hand');
        row.append(...opponent.hand.map(createBackElement));
        box.append(row);
        opponentsSection.append(box);
    });
    
    const table = el('section', 'table');
    const drawPile = el('div', 'pile');
    drawPile.append(createBackElement(), el('p', 'pile_label', `Ziehstapel (${state.drawPile.length})`));
    const discardPile = el('div', 'pile');
    discardPile.append(createCardElement(getTopCard(state)), el('p', 'pile_label', 'Ablage'));
    table.append(drawPile, discardPile);

    const playerSection = el('section', 'player');
    playerSection.append(el('h2', 'area-title', 'Deine Hand'));
    const hand = el('div', 'hand');
    hand.append(...me.hand.map(createCardElement));
    playerSection.append(hand);

    root.replaceChildren(opponentsSection, table, playerSection);
}

const root = document.getElementById('game');
if (root) {
    render(createGame({playerCount:2}), root);
}