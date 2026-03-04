import * as PIXI from 'pixi.js';
import { menuStart } from './scenes/menu';

const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

async function start() {
    const app = new PIXI.Application();

    await app.init({
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        resizeTo: window,
        background: '#89b2ff',
    });

    document.body.style.margin = '0';
    document.body.appendChild(app.canvas);

    menuStart(app);
    const fpsText = new PIXI.Text({
        text: 'FPS: 0',
        style: {
            fill: '#ffffff',
            fontSize: 14,
        },
    });

    fpsText.x = 10;
    fpsText.y = 10;

    app.stage.addChild(fpsText);

    app.ticker.add(() => {
        fpsText.text = 'FPS: ' + Math.round(app.ticker.FPS);
    });

    resize(app);
    window.addEventListener('resize', () => resize(app));
}

function resize(app: PIXI.Application) {
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    const scale = Math.min(screenWidth / GAME_WIDTH, screenHeight / GAME_HEIGHT);

    app.renderer.resize(screenWidth, screenHeight);

    app.stage.scale.set(scale);

    app.stage.x = (screenWidth - GAME_WIDTH * scale) / 2;
    app.stage.y = (screenHeight - GAME_HEIGHT * scale) / 2;
}

start();
