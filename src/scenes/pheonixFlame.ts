import * as PIXI from 'pixi.js';

type Particle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
};

export function startPheonixFlame(app: PIXI.Application) {
  const container = new PIXI.Container();
  container.x = -170;
  container.y = -250;

  const graphics = new PIXI.Graphics();
  graphics.blendMode = 'add';
  container.addChild(graphics);

  const MAX_PARTICLES = 10;
  const particles: Particle[] = [];

  const fireX = 500;
  const fireY = 700;

  function resetParticle(p: Particle) {
    p.x = fireX + (Math.random() - 0.5) * 20;
    p.y = fireY;
    p.vx = (Math.random() - 0.5) * 1;
    p.vy = -Math.random() * 3 - 0.1;
    p.life = 50;
  }

  // Create particles once
  for (let i = 0; i < MAX_PARTICLES; i++) {
    const p: Particle = { x: 0, y: 0, vx: 0, vy: 0, life: 0 };
    resetParticle(p);
    particles.push(p);
  }

  app.ticker.add(() => {
    graphics.clear();
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
      if (p.life <= 0) {
        resetParticle(p);
      }
      const alpha = p.life / 30;
      graphics.circle(p.x, p.y, 6);
      graphics.fill({ color: 0xff6600, alpha });
    }
  });

  return container;
}
