import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

let currentCard = 0;

const offsetX = 2; // slight sideways shift
const offsetY = 2; // vertical stacking

const deckSize = 144;
const deckX = 400;
const deckY = 250;
const duration = 2;

let resetting = false;

export function startAceOfShadows() {
  const container = new PIXI.Container();
  container.sortableChildren = true;

  const cards: PIXI.Sprite[] = [];

  for (let i = 0; i < deckSize; i++) {
    const card = new PIXI.Sprite(PIXI.Texture.WHITE);
    card.anchor.set(0.5);
    card.width = 200;
    card.height = offsetY;
    let color = Math.floor(Math.random() * 0xffffff);

    while (color === 0x89b2ff) {
      color = Math.floor(Math.random() * 0xffffff);
    }
    card.tint = color;
    card.x =
      deckX +
      (Math.random() > 0.5
        ? Math.random() * offsetX
        : -Math.random() * offsetX);
    card.y = deckY + i * offsetY;
    card.zIndex = i;

    container.addChild(card);
    cards.push(card);
  }

  gsap.registerPlugin(MotionPathPlugin);

  setInterval(() => {
    if (!resetting) moveNextCard(cards);
    else moveCardBack(cards);
  }, 1000);
  return container;
}

function moveCardBack(cards: PIXI.Sprite[]) {
  if (currentCard === cards.length) currentCard = cards.length - 1
  const card = cards[currentCard];

  if (gsap.isTweening(card)) return;
  gsap.to(card, {
    duration: duration,
    ease: 'power1.inOut',
    motionPath: {
      path: [
        { x: card.x, y: card.y },
        { x: deckX, y: deckY + currentCard * offsetY - 60 },
        {
          x:
            deckX +
            (Math.random() > 0.5
              ? Math.random() * offsetX
              : -Math.random() * offsetX),
          y: deckY + currentCard * offsetY,
        },
      ],
    },
  });
  currentCard--;
  if (currentCard === -1) resetting = false;
}

function moveNextCard(cards: PIXI.Sprite[]) {
  if (currentCard === -1) currentCard = 0
  const card = cards[currentCard];
  if (gsap.isTweening(card)) return;

  gsap.to(card, {
    duration: duration,
    ease: 'power1.inOut',
    motionPath: {
      path: [
        { x: card.x, y: card.y },
        { x: card.x + (currentCard % 2 === 0 ? 200 : -200), y: card.y - 60 },
        {
          x: card.x + (currentCard % 2 === 0 ? 300 : -300),
          y: deckY + (deckSize - 1 - currentCard / 2) * offsetY,
        },
      ],
    },
  });
  currentCard++;
  if (currentCard === deckSize) resetting = true;
}
