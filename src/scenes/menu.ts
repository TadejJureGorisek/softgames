import * as PIXI from 'pixi.js';
import { startAceOfShadows } from './aceOfShadows';
import { prepareDialogScene, startDialogueScene } from './magicWords';
import { startPheonixFlame } from './pheonixFlame';

let menuContainer: PIXI.Container;
let aceOfShadowsContainer: PIXI.Container;
let magicContainer: PIXI.Container;
let pheonixContainer: PIXI.Container;
let backContainer: PIXI.Container;

export function menuStart(app: PIXI.Application) {
  menuContainer = new PIXI.Container();
  backContainer = new PIXI.Container();
  aceOfShadowsContainer = startAceOfShadows();
  magicContainer = prepareDialogScene();
  startDialogueScene(
    app,
    magicContainer,
    'https://private-624120-softgamesassignment.apiary-mock.com/v2/magicwords'
  );
  pheonixContainer = startPheonixFlame(app);
  aceOfShadowsContainer.visible = false;
  magicContainer.visible = false;
  backContainer.visible = false;
  pheonixContainer.visible = false;

  app.stage.addChild(menuContainer);
  app.stage.addChild(aceOfShadowsContainer);
  app.stage.addChild(magicContainer);
  app.stage.addChild(pheonixContainer);
  app.stage.addChild(backContainer);

  for (let i = 0; i < 5; i++) {
    if (i === 4) backContainer.addChild(createButton(i));
    else menuContainer.addChild(createButton(i));
  }
}

function createButton(buttonId: number) {
  const buttonWidth = 200;
  const buttonHeight = 60;
  const spacing = 90;

  const names = [
    'Ace Of Shadows',
    'Magic Words',
    'Pheonix Flame',
    'Full Screen',
    'BACK',
  ];
  const container = new PIXI.Container();

  // button background
  const button = new PIXI.Graphics();
  button.rect(-buttonWidth / 2, -buttonHeight / 2, buttonWidth, buttonHeight);
  button.fill(0xaa0000);
  button.eventMode = 'static';
  button.cursor = 'pointer';
  button.on('pointerdown', () => {
    sceneCallbacks(buttonId);
  });
  // button text
  const text = new PIXI.Text({
    text: names[buttonId],
    style: {
      fill: '#ffffff',
      fontSize: 24,
      fontWeight: 'bold',
    },
  });

  text.anchor.set(0.5);

  container.addChild(button);
  container.addChild(text);

  if (buttonId === 4) {
    container.x = 700;
    container.y = 50;
  } else {
    container.x = 400;
    container.y = 250 + (buttonId - 1) * spacing;
  }

  return container;
}
function goFullscreen() {
  const el = document.documentElement;
  if (!document.fullscreenEnabled) {
    console.warn('Fullscreen not enabled by browser.');
    return;
  }

  el.requestFullscreen().catch((err) => {
    console.error('Fullscreen failed:', err);
  });
}

function sceneCallbacks(sceneId: number) {
  menuContainer.visible = false;
  backContainer.visible = true;
  switch (sceneId) {
    case 0:
      aceOfShadowsContainer.visible = true;
      break;
    case 1:
      magicContainer.visible = true;
      break;
    case 2:
      pheonixContainer.visible = true;
      break;
    case 3:
      menuContainer.visible = true;
      backContainer.visible = false;
      goFullscreen();
      break;
    case 4:
      backContainer.visible = false;
      aceOfShadowsContainer.visible = false;
      magicContainer.visible = false;
      pheonixContainer.visible = false;

      menuContainer.visible = true;
      break;
    default:
      console.log('Unknown scene:', sceneId);
  }
}
