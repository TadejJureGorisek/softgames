import * as PIXI from 'pixi.js';

export class EmojiText extends PIXI.Container {
  constructor(
    text: string,
    style: Partial<PIXI.TextStyle>,
    emojiMap: Record<string, PIXI.Texture>,
    maxWidth: number
  ) {
    super();

    const parts = text.split(/(\{.*?\})/);

    let x = 0;
    let y = 0;

    const lineHeight = ((style.fontSize as number) || 18) + 6;

    parts.forEach((part) => {
      const match = part.match(/\{(.*?)\}/);
      if (match) {
        const name = match[1];
        const tex = emojiMap[name];
        if (tex) {
          const size = 22;
          if (x + size > maxWidth) {
            x = 0;
            y += lineHeight;
          }
          const sprite = new PIXI.Sprite(tex);
          sprite.width = size;
          sprite.height = size;
          sprite.x = x;
          sprite.y = y;
          this.addChild(sprite);
          x += size;
        }
      } else if (part.length > 0) {
        const words = part.split(' ');
        words.forEach((word, index) => {
          const content = index === 0 ? word : ' ' + word;
          const txt = new PIXI.Text({
            text: content,
            style,
          });
          if (x + txt.width > maxWidth) {
            x = 0;
            y += lineHeight;
          }
          txt.x = x;
          txt.y = y;
          this.addChild(txt);
          x += txt.width;
        });
      }
    });
  }
}
