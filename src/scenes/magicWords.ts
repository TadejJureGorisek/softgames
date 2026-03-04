import * as PIXI from 'pixi.js';
import { gsap } from 'gsap';
import { EmojiText } from '../tools/EmojiText';

type EndpointData = {
  dialogue: Array<{ name: string; text: string }>;
  emojies: Array<{ name: string; url: string }>;
  avatars: Array<{ name: string; url: string; position: 'left' | 'right' }>;
};

type EmojiMap = Record<string, PIXI.Texture>;

type AvatarMap = Record<
  string,
  { texture: PIXI.Texture; position: 'left' | 'right' }
>;

let scrollTarget = 0;
let dragging = false;
let lastY = 0;
let viewHeight = 300;
let title: PIXI.Text;
export function prepareDialogScene() {
  const scene = new PIXI.Container();

  title = new PIXI.Text({
    text: 'Dialogue Loading...',
    style: { fill: '#ffffff', fontSize: 34, fontWeight: '700' },
  });
  title.x = 40;
  title.y = 20;
  scene.addChild(title);

  return scene;
}
function clamp(scene: PIXI.Container) {
  const minY = -(scene.height - viewHeight);
  const maxY = 0;
  scrollTarget = Math.max(minY, Math.min(maxY, scrollTarget));
}
export async function startDialogueScene(
  app: PIXI.Application,
  scene: PIXI.Container,
  endpointUrl: string
) {
  const data = await fetchJson(endpointUrl);

  const avatarMap: AvatarMap = {};
  const emojiMap: EmojiMap = {};

  await Promise.all(
    data.avatars.map(async (a) => {
      const tex = await loadTextureFromUrl(a.url);
      avatarMap[a.name] = { texture: tex, position: a.position };
    })
  );
  await Promise.all(
    data.emojies.map(async (e) => {
      const tex = await loadTextureFromUrl(e.url);
      emojiMap[e.name] = tex;
    })
  );
  title.visible = false;

  for (const line of data.dialogue) {
    const row = new PIXI.Container();
    const who = avatarMap[line.name];
    const side: 'left' | 'right' = who?.position ?? 'left';
    if (who) {
      const avatar = new PIXI.Sprite(who.texture);

      avatar.width = 40;
      avatar.height = 40;

      avatar.x = 60;
      avatar.y = -20;
      row.addChild(avatar);
    }

    const nameText = new PIXI.Text({
      text: line.name,
      style: { fill: '#ffd37a', fontSize: 18, fontWeight: '700' },
    });
    nameText.x = who ? 100 : 70;
    nameText.y = who ? 0 : -10;

    const descText = new EmojiText(
      line.text,
      { fill: '#ffd37a', fontSize: 18, fontWeight: '700' },
      emojiMap,
      400
    );
    descText.x = who ? 100 : 80;
    descText.y = who ? 30 : 20;

    row.addChild(nameText);
    row.addChild(descText);

    const bubble = makeBubble(side === 'left', row);
    bubble.x = side === 'left' ? 0 : 70;
    bubble.y = scene.height + (scene.height !== 0 ? 20 : 0);
    scene.addChild(bubble);
  }

  scene.eventMode = 'static';
  scene.hitArea = new PIXI.Rectangle(0, 0, 800, 3000);

  window.addEventListener('wheel', (e) => {
    scrollTarget -= e.deltaY * 0.6;
    clamp(scene);
    gsap.to(scene, { y: scrollTarget, duration: 0.4 });
  });

  scene.on('pointerdown', (e) => {
    dragging = true;
    lastY = e.global.y;
  });

  scene.on('pointermove', (e) => {
    if (!dragging) return;

    const dy = e.global.y - lastY;
    lastY = e.global.y;

    scrollTarget += dy;
    clamp(scene);

    scene.y = scrollTarget;
  });

  scene.on('pointerup', () => (dragging = false));
  scene.on('pointerupoutside', () => (dragging = false));
}

export function makeBubble(leftSide: boolean, content: PIXI.Container) {
  const padding = 12;
  const radius = 16;
  const fill = leftSide ? 0x1b2a38 : 0x2a3f52;

  const bubble = new PIXI.Container();
  const bg = new PIXI.Graphics();
  bg.roundRect(
    65,
    -10,
    content.width + padding * 2,
    content.height + padding * 2,
    radius
  );
  bg.fill(fill);

  content.x = padding;
  content.y = padding;
  bubble.addChild(bg);
  bubble.addChild(content);

  return bubble;
}

function loadTextureFromUrl(url: string): Promise<PIXI.Texture> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous'; // important for remote images
    img.onload = () => resolve(PIXI.Texture.from(img));
    img.onerror = () => reject(new Error(`Failed to load image: ${url}`));
    img.src = url;
  });
}

async function fetchJson(url: string): Promise<EndpointData> {
  const res = await fetch(url);
  if (!res.ok)
    throw new Error(`Endpoint failed: ${res.status} ${res.statusText}`);
  return (await res.json()) as EndpointData;
}
