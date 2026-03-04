import * as PIXI from 'pixi.js';

const MAX = 10;

export function startPheonixFlame(app: PIXI.Application) {
  const container = new PIXI.Container();

  const g = new PIXI.Graphics()
    .circle(0, 0, 26)
    .fill({ color: 0xffffff, alpha: 0.18 })
    .circle(0, -18, 14)
    .fill({ color: 0xffffff, alpha: 0.35 });
  const tex = app.renderer.generateTexture(g);
  g.destroy();

  const pool: { s: PIXI.Sprite; life: number; vy: number; drift: number }[] =
    [];
  for (let i = 0; i < MAX; i++) {
    const s = new PIXI.Sprite(tex);
    s.anchor.set(0.5);
    s.blendMode = 'add';
    s.tint = 0xff3300; // red
    s.visible = false;
    container.addChild(s);
    pool.push({ s, life: 0, vy: 0, drift: Math.random() * 6.28 });
  }

  const origin = { x: 400, y: 400 };

  function spawn(p: (typeof pool)[number]) {
    p.life = 1;
    p.vy = -(80 + Math.random() * 80); // px/sec
    p.drift = Math.random() * 6.28;

    p.s.visible = true;
    p.s.alpha = 0;
    p.s.scale.set(0.5 + Math.random() * 0.6);
    p.s.position.set(origin.x + (Math.random() - 0.5) * 18, origin.y);
  }

  let spawnTimer = 0;

  app.ticker.add((t) => {
    const dt = t.deltaMS / 1000;

    // spawn particles slowly
    spawnTimer += dt;
    if (spawnTimer > 0.06) {
      spawnTimer = 0;
      const dead = pool.find((p) => p.life <= 0);
      if (dead) spawn(dead);
    }

    for (const p of pool) {
      if (p.life <= 0) continue;

      // reduce life
      p.life -= dt * 1.2;

      // move upward
      p.s.y += p.vy * dt;

      // smooth sideways movement
      p.drift += dt * 6;
      p.s.x += Math.sin(p.drift) * 18 * dt;

      // fade out
      p.s.alpha = p.life;

      // slowly grow
      p.s.scale.x *= 1 + dt * 0.15;
      p.s.scale.y *= 1 + dt * 0.15;

      // slight rotation
      p.s.rotation = Math.sin(p.drift) * 0.15;

      // hide when dead
      if (p.life <= 0) p.s.visible = false;
    }
  });

  return container;
}
