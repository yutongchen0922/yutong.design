/**
 * <pixel-pet> — a frameless pixel cloud companion.
 *
 *   <script src="pixel-pet.js"></script>
 *   <pixel-pet></pixel-pet>
 *
 * No background by default — sits on whatever's behind it.
 *
 * Sizing:
 *   <pixel-pet style="width: 280px; height: 280px"></pixel-pet>
 *
 * Themable CSS custom properties:
 *   --pet-body, --pet-body-highlight, --pet-outline,
 *   --pet-cheek, --pet-heart, --pet-zzz, --pet-sparkle, --pet-eye-white
 *   (set --pet-bg if you want a fill behind the cloud — defaults to transparent)
 *
 * Interactions:
 *   • idle           — gentle breathing + slow horizontal drift, occasional blinks
 *   • cursor near    — eyes track cursor across the canvas
 *   • cursor closer  — small lift, mouth opens slightly
 *   • cursor on pet  — soft smile, blush, hearts drift up
 *   • click/tap      — small surprise puff with sparkles
 *   • cursor away 5s — falls asleep with Zzz's
 *
 * Events:
 *   pet:state-change  detail: { state }
 *   pet:click         detail: { x, y }
 */
class PixelPet extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          --pet-bg: transparent;
          --pet-body: #f1f3f5;            /* cool cloud white */
          --pet-body-highlight: #fbfdff;
          --pet-outline: #3a3d45;
          --pet-cheek: #5a87c4;
          --pet-heart: #5a87c4;
          --pet-zzz: #5a87c4;
          --pet-sparkle: #5a87c4;
          --pet-eye-white: #f1f3f5;

          display: inline-block;
          width: 220px;
          height: 220px;
          contain: layout paint;
        }
        .stage {
          position: relative;
          width: 100%;
          height: 100%;
          background: var(--pet-bg);
          cursor: pointer;
          touch-action: manipulation;
          user-select: none;
          -webkit-user-select: none;
        }
        canvas {
          width: 100%;
          height: 100%;
          image-rendering: pixelated;
          image-rendering: crisp-edges;
          display: block;
        }
        .effect {
          position: absolute;
          pointer-events: none;
          font-family: 'Pixelify Sans', ui-monospace, 'Courier New', monospace;
          font-weight: 700;
          letter-spacing: 0.5px;
          line-height: 1;
          will-change: transform, opacity;
        }
        @keyframes float-up {
          0%   { transform: translate(-50%, 0) scale(0.5); opacity: 0; }
          18%  { opacity: 1; transform: translate(-50%, -6px) scale(1); }
          100% { transform: translate(calc(-50% + var(--dx, 0px)), -42px) scale(1.05); opacity: 0; }
        }
        .heart {
          color: var(--pet-heart);
          font-size: 18px;
          animation: float-up 1.8s cubic-bezier(.2,.8,.4,1) forwards;
        }
        @keyframes zzz-float {
          0%   { opacity: 0; transform: translate(0, 4px) rotate(-12deg) scale(0.6); }
          22%  { opacity: 1; transform: translate(4px, 0) rotate(-8deg) scale(1); }
          100% { opacity: 0; transform: translate(24px, -36px) rotate(16deg) scale(1.05); }
        }
        .zzz {
          color: var(--pet-zzz);
          font-size: 18px;
          animation: zzz-float 2.6s ease-out forwards;
        }
        @keyframes sparkle-pop {
          0%   { transform: translate(-50%, -50%) scale(0) rotate(0); opacity: 0; }
          45%  { transform: translate(-50%, -50%) scale(1) rotate(120deg); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(0) rotate(280deg); opacity: 0; }
        }
        .sparkle {
          color: var(--pet-sparkle);
          font-size: 14px;
          animation: sparkle-pop 0.7s ease-out forwards;
        }
        @media (prefers-reduced-motion: reduce) {
          .heart, .zzz, .sparkle { animation-duration: 0.001s; }
        }
      </style>
      <div class="stage" part="stage" role="img" aria-label="Pixel cloud that responds to your cursor">
        <canvas width="64" height="64"></canvas>
      </div>
    `;

    this.stage = this.shadowRoot.querySelector('.stage');
    this.canvas = this.shadowRoot.querySelector('canvas');
    this.ctx = this.canvas.getContext('2d');
    this.ctx.imageSmoothingEnabled = false;

    // ─── State ───────────────────────────────────────────────
    this._state = 'idle';
    this.lastInteraction = performance.now();
    this.cursor = { x: -1, y: -1, active: false };
    this.t = 0;
    this.bounceT = 0;
    this.surpriseT = 0;
    this.lastHeart = 0;
    this.lastZzz = 0;
    this.blinkOffset = Math.floor(Math.random() * 300);
    this.driftPhase = Math.random() * Math.PI * 2;
    this.colors = this._readColors();

    this._attachListeners();
    this._loop = this._loop.bind(this);
    this._raf = requestAnimationFrame(this._loop);
  }

  disconnectedCallback() {
    cancelAnimationFrame(this._raf);
    if (this._mo) this._mo.disconnect();
  }

  set state(v) {
    if (this._state === v) return;
    this._state = v;
    this.dispatchEvent(new CustomEvent('pet:state-change', { detail: { state: v } }));
  }
  get state() { return this._state; }

  _readColors() {
    const cs = getComputedStyle(this);
    const get = (n, fallback) => cs.getPropertyValue(n).trim() || fallback;
    return {
      body:       get('--pet-body', '#f1f3f5'),
      highlight:  get('--pet-body-highlight', '#fbfdff'),
      outline:    get('--pet-outline', '#3a3d45'),
      cheek:      get('--pet-cheek', '#ff8fab'),
      eyeWhite:   get('--pet-eye-white', '#f1f3f5'),
    };
  }

  _attachListeners() {
    this.stage.addEventListener('pointermove', (e) => {
      const rect = this.stage.getBoundingClientRect();
      this.cursor.x = ((e.clientX - rect.left) / rect.width) * 64;
      this.cursor.y = ((e.clientY - rect.top) / rect.height) * 64;
      this.cursor.active = true;
      this.lastInteraction = performance.now();
    });
    this.stage.addEventListener('pointerleave', () => {
      this.cursor.active = false;
    });
    this.stage.addEventListener('pointerdown', (e) => {
      this.surpriseT = 1;
      this._spawnSparkles();
      this.lastInteraction = performance.now();
      const rect = this.stage.getBoundingClientRect();
      this.dispatchEvent(new CustomEvent('pet:click', {
        detail: {
          x: ((e.clientX - rect.left) / rect.width) * 64,
          y: ((e.clientY - rect.top) / rect.height) * 64,
        }
      }));
    });
    this._mo = new MutationObserver(() => this.colors = this._readColors());
    this._mo.observe(this, { attributes: true, attributeFilter: ['style', 'class'] });
  }

  _spawnHeart() {
    const h = document.createElement('div');
    h.className = 'effect heart';
    h.textContent = '\u2665';
    const offset = (Math.random() * 22 - 11);
    h.style.left = `calc(50% + ${offset}px)`;
    h.style.top = '46%';
    h.style.setProperty('--dx', (Math.random() * 18 - 9) + 'px');
    this.stage.appendChild(h);
    setTimeout(() => h.remove(), 1900);
  }

  _spawnSparkles() {
    for (let i = 0; i < 3; i++) {
      const s = document.createElement('div');
      s.className = 'effect sparkle';
      s.textContent = ['\u2726', '\u2727', '\u2605'][i % 3];
      s.style.left = (32 + Math.random() * 36) + '%';
      s.style.top = (28 + Math.random() * 32) + '%';
      s.style.animationDelay = (i * 0.06) + 's';
      this.stage.appendChild(s);
      setTimeout(() => s.remove(), 900);
    }
  }

  _spawnZzz() {
    const z = document.createElement('div');
    z.className = 'effect zzz';
    z.textContent = 'z';
    z.style.left = '62%';
    z.style.top = '36%';
    this.stage.appendChild(z);
    setTimeout(() => z.remove(), 2600);
  }

  _loop(now) {
    this.t++;

    const cx = 32, cy = 34;
    let dist = Infinity;
    if (this.cursor.active) {
      const dx = this.cursor.x - cx;
      const dy = this.cursor.y - cy;
      dist = Math.sqrt(dx*dx + dy*dy);
    }

    // ─── State machine ──────────────────────────────────────
    const idleMs = now - this.lastInteraction;
    if (this.surpriseT > 0.5) {
      this.state = 'surprised';
    } else if (idleMs > 5000 && !this.cursor.active) {
      this.state = 'sleeping';
    } else if (dist < 12) {
      this.state = 'happy';
    } else if (dist < 24) {
      this.state = 'excited';
    } else if (this.cursor.active) {
      this.state = 'curious';
    } else {
      this.state = 'idle';
    }

    const targetBounce = (this.state === 'excited' || this.state === 'happy') ? 1 : 0;
    this.bounceT += (targetBounce - this.bounceT) * 0.12;
    if (this.surpriseT > 0) this.surpriseT = Math.max(0, this.surpriseT - 0.035);

    if (this.state === 'happy' && this.t - this.lastHeart > 60) {
      this._spawnHeart();
      this.lastHeart = this.t;
    }
    if (this.state === 'sleeping' && this.t - this.lastZzz > 110) {
      this._spawnZzz();
      this.lastZzz = this.t;
    }

    this._draw();
    this._raf = requestAnimationFrame(this._loop);
  }

  // ─── Drawing ───────────────────────────────────────────────
  _draw() {
    const ctx = this.ctx;
    const c = this.colors;
    ctx.clearRect(0, 0, 64, 64);

    // Cloud-appropriate motion: clearly horizontal, like a cloud blown by wind
    // Two superimposed sines at different periods so the path doesn't repeat mechanically
    const dt = this.t + this.driftPhase * 100;
    let bounceX = Math.sin(dt * 0.010) * 4
                + Math.sin(dt * 0.0042 + 1.7) * 1.6;
    let bounceY = 0;
    let breathe = 0;

    if (this.state === 'excited') {
      bounceY = -Math.abs(Math.sin(this.t * 0.13)) * 1.6 * this.bounceT;
    } else if (this.state === 'happy') {
      bounceY = -Math.abs(Math.sin(this.t * 0.10)) * 0.8 * this.bounceT;
    }
    if (this.surpriseT > 0) {
      bounceY -= Math.sin(this.surpriseT * Math.PI) * 4;
    }
    if (this.state === 'sleeping') {
      breathe = Math.sin(this.t * 0.018) * 0.5;
      bounceX *= 0.4; // sleeping cloud drifts more slowly
    }

    const cx = 32 + bounceX;
    const cy = 34 + bounceY + breathe;

    // ─── Shadow ──────────────────────────────────────────
    const liftAmt = Math.max(0, -bounceY) / 8;
    const shadowW = 11 - liftAmt * 3;
    ctx.fillStyle = `rgba(58, 61, 69, ${0.15 - liftAmt * 0.06})`;
    this._fillEllipse(ctx, 32 + bounceX, 52, shadowW, 1.4); // shadow drifts with the cloud

    this._drawBody(ctx, c, cx, cy);
    this._drawFace(ctx, c, cx, cy);

    if (this.state === 'happy' || this.state === 'excited') {
      ctx.fillStyle = c.cheek;
      ctx.fillRect(Math.round(cx - 8), Math.round(cy + 2), 2, 1);
      ctx.fillRect(Math.round(cx + 7), Math.round(cy + 2), 2, 1);
    }
  }

  // ─── Cloud body: overlapping puffs with unified outline ──
  _drawBody(ctx, c, cx, cy) {
    // [dx, dy, rx, ry] relative to (cx, cy). Symmetric layout.
    const puffs = [
      [-7, -1, 5, 4],   // left puff
      [-4, -4, 4, 4],   // top-left puff
      [ 0, -5, 5, 5],   // top-center puff (tallest)
      [ 4, -4, 4, 4],   // top-right puff
      [ 7, -1, 5, 4],   // right puff
      [ 0,  2, 10, 4],  // main body underneath
    ];

    // Outline pass — each puff drawn 1px larger creates a unified silhouette
    ctx.fillStyle = c.outline;
    for (const [dx, dy, rx, ry] of puffs) {
      this._fillEllipse(ctx, cx + dx, cy + dy, rx + 1, ry + 1);
    }
    // Body pass — original size, drawn on top, covers internal outline pixels
    ctx.fillStyle = c.body;
    for (const [dx, dy, rx, ry] of puffs) {
      this._fillEllipse(ctx, cx + dx, cy + dy, rx, ry);
    }

    // Highlight on the top-center puff (suggests light from upper-left)
    ctx.fillStyle = c.highlight;
    ctx.fillRect(Math.round(cx - 2), Math.round(cy - 7), 2, 1);
    ctx.fillRect(Math.round(cx - 3), Math.round(cy - 6), 1, 1);
    ctx.fillRect(Math.round(cx - 1), Math.round(cy - 5), 1, 1);
  }

  _drawFace(ctx, c, cx, cy) {
    const eyeY = Math.round(cy);
    const eyeOX = 4;
    const cxR = Math.round(cx);

    // Mouth
    const my = Math.round(cy + 4);
    ctx.fillStyle = c.outline;
    if (this.state === 'happy') {
      ctx.fillRect(cxR - 1, my, 2, 1);
      ctx.fillRect(cxR - 2, my - 1, 1, 1);
      ctx.fillRect(cxR + 1, my - 1, 1, 1);
    } else if (this.state === 'excited') {
      ctx.fillRect(cxR - 1, my, 2, 1);
    } else if (this.state === 'sleeping') {
      ctx.fillRect(cxR, my, 1, 1);
    } else if (this.state === 'surprised') {
      ctx.fillRect(cxR - 1, my, 2, 2);
    } else {
      ctx.fillRect(cxR - 1, my + 1, 2, 1);
    }

    // Eyes
    if (this.state === 'sleeping') {
      ctx.fillStyle = c.outline;
      ctx.fillRect(cxR - eyeOX - 1, eyeY + 1, 4, 1);
      ctx.fillRect(cxR + eyeOX - 1, eyeY + 1, 4, 1);
      return;
    }
    if (this.state === 'happy') {
      this._drawHappyEye(ctx, c, cxR - eyeOX, eyeY);
      this._drawHappyEye(ctx, c, cxR + eyeOX, eyeY);
      return;
    }
    if (this.state === 'surprised') {
      this._drawWideEye(ctx, c, cxR - eyeOX, eyeY);
      this._drawWideEye(ctx, c, cxR + eyeOX, eyeY);
      return;
    }

    const blinkPhase = (this.t + this.blinkOffset) % 330;
    if (blinkPhase < 5) {
      ctx.fillStyle = c.outline;
      ctx.fillRect(cxR - eyeOX - 1, eyeY + 1, 4, 1);
      ctx.fillRect(cxR + eyeOX - 1, eyeY + 1, 4, 1);
      return;
    }

    // Tracking: pupil at one of 4 corners of the 2×2 white
    let px = 0, py = 0;
    if (this.cursor.active) {
      const dx = this.cursor.x - cx;
      const dy = this.cursor.y - cy;
      const len = Math.max(Math.sqrt(dx*dx + dy*dy), 1);
      px = Math.round(dx / len);
      py = Math.round(dy / len * 0.8);
    }
    this._drawTrackingEye(ctx, c, cxR - eyeOX, eyeY, px, py);
    this._drawTrackingEye(ctx, c, cxR + eyeOX, eyeY, px, py);
  }

  // Original 4×4 square eye — 2×2 white inset, 1px pupil that lives in one of 4 corners
  _drawTrackingEye(ctx, c, x, y, px, py) {
    ctx.fillStyle = c.outline;
    ctx.fillRect(x - 1, y - 1, 4, 4);
    ctx.fillStyle = c.eyeWhite;
    ctx.fillRect(x, y, 2, 2);
    const ox = px > 0 ? 1 : 0;
    const oy = py > 0 ? 1 : 0;
    ctx.fillStyle = c.outline;
    ctx.fillRect(x + ox, y + oy, 1, 1);
  }

  // Surprised — full 4×4 with pupil at bottom-left for the wide-eyed look
  _drawWideEye(ctx, c, x, y) {
    ctx.fillStyle = c.outline;
    ctx.fillRect(x - 1, y - 1, 4, 4);
    ctx.fillStyle = c.eyeWhite;
    ctx.fillRect(x, y, 2, 2);
    ctx.fillStyle = c.outline;
    ctx.fillRect(x, y + 1, 1, 1);
  }

  // Happy ^^ — 4-pixel smile arc
  _drawHappyEye(ctx, c, x, y) {
    ctx.fillStyle = c.outline;
    ctx.fillRect(x - 1, y + 1, 1, 1);
    ctx.fillRect(x, y, 1, 1);
    ctx.fillRect(x + 1, y, 1, 1);
    ctx.fillRect(x + 2, y + 1, 1, 1);
  }

  _fillEllipse(ctx, cx, cy, rx, ry) {
    if (rx <= 0) return;
    for (let y = -Math.ceil(ry); y <= Math.ceil(ry); y++) {
      const w = Math.sqrt(Math.max(0, 1 - (y / ry) ** 2)) * rx;
      ctx.fillRect(Math.round(cx - w), Math.round(cy + y), Math.max(1, Math.round(w * 2)), 1);
    }
  }
}

if (!customElements.get('pixel-pet')) {
  customElements.define('pixel-pet', PixelPet);
}
