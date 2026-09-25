import { bullets, canvas, ctx, players } from "./sys.js"
import { cfg, superOptimal } from "./logs/cfg.js"

const asset = "./assets/";
const imgList = new Map();
export const spaceb = [];

// ============================================================
// 定数
// ============================================================
const PALETTE_COLORS = new Set([
    "crim", "red", "purple", "pink", "cobalt", "blue", "cyan",
    "aqua", "lime", "green", "olive", "gold", "yellow", "orange", "white"
]);

const ANIM_TYPES = {
    fire:  { color: "red",    prefix: "fire" },
    curse: { color: "purple", prefix: "curse" }
};
const ANIM_FRAME_COUNT = 4;
const ANIM_FRAME_INTERVAL = 18;

// OP(強調)演出: 生成から TIMEisOP フレームかけて (OP_ALPHA, OP_SCALE) → (1, 1)
const IsOp = true;
const TIMEisOP = 6;
const OP_ALPHA = 0.4;
const OP_SCALE = 2;

const TYPE_ALIAS = {
    "クナイ": "kunai", "御札": "amulet", "グミ": "gummy", "ナイフ弾": "knife",
    "大弾": "big", "鱗弾": "scale", "米弾": "diamond",
    "陰陽玉": "onmyoutama", "陰陽弾": "onmyoutama", "onmyoudama": "onmyoutama",
    "laser2": "laser",
};

// ============================================================
// 画像ロード(1本化)
// ============================================================
const toCanvas = (img) => {
    const c = document.createElement("canvas");
    c.width = img.width;
    c.height = img.height;
    c.getContext("2d").drawImage(img, 0, 0);
    return c;
};

/**
 * key = `${type}-${color}` のキャッシュを(未ロードなら)ロード開始する。
 * パレット色 → pallets/ から直読み / それ以外 → グロー着色
 */
function loadImg(type, color) {
    const key = `${type}-${color}`;
    if (imgList.has(key)) return key;
    imgList.set(key, "loading");

    const file = TYPE_ALIAS[type] ?? type;
    if (PALETTE_COLORS.has(color)) {
        const img = new Image();
        img.onload = () => imgList.set(key, toCanvas(img));
        img.src = `${asset}pallets/${color}${file}.png`;
    } else {
        const img = new Image();
        img.onload = async () => {
            const colored = new Image();
            colored.onload = () => imgList.set(key, toCanvas(colored));
            colored.src = await setColor(img, color);
        };
        img.src = `${asset}${file}.png`;
    }
    return key;
}

function loadAnimFrames(type) {
    const conf = ANIM_TYPES[type];
    for (let i = 1; i <= ANIM_FRAME_COUNT; i++) {
        const key = `${type}-${conf.color}-${i}`;
        if (imgList.has(key)) continue;
        imgList.set(key, "loading");
        const img = new Image();
        img.onload = () => imgList.set(key, toCanvas(img));
        img.src = `${asset}${conf.prefix}_${i}.png`;
    }
}

/** 弾typeに必要な画像を全部ロード開始(constructor / setter / scolor / CC 共通) */
function preload(type, color) {
    if (ANIM_TYPES[type]) return loadAnimFrames(type);
    loadImg(type, color);
    if (isLaserType(type)) loadImg("normal", color); // 発射地点の飾り用
}

export function CC(type, colors) {
    (Array.isArray(colors) ? colors : [colors]).forEach(c => preload(type, c));
}

async function setColor(img, color, glowAmount = 300) {
    const hex = color.trim().replace("#", "");
    const full = hex.length === 3 ? hex.split("").map(c => c + c).join("") : hex;
    const num = parseInt(full, 16);
    const [r, g, b] = [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    const lerp = (a, b, t) => a + (b - a) * t;

    const steps = [
        [r * 0.20, g * 0.20, b * 0.20],
        [r * 0.65, g * 0.65, b * 0.65],
        [lerp(r, 255, 0.45), lerp(g, 255, 0.45), lerp(b, 255, 0.45)],
        [255, 255, 255]
    ];
    const sample = (gray) => {
        const t = gray / 255;
        let a, bb, k;
        if (t < 0.33)      { a = steps[0]; bb = steps[1]; k = t / 0.33; }
        else if (t < 0.66) { a = steps[1]; bb = steps[2]; k = (t - 0.33) / 0.33; }
        else               { a = steps[2]; bb = steps[3]; k = (t - 0.66) / 0.34; }
        return [lerp(a[0], bb[0], k), lerp(a[1], bb[1], k), lerp(a[2], bb[2], k)];
    };

    const temp = document.createElement("canvas");
    temp.width = img.width;
    temp.height = img.height;
    const tctx = temp.getContext("2d");
    tctx.drawImage(img, 0, 0);
    const imageData = tctx.getImageData(0, 0, temp.width, temp.height);
    const d = imageData.data;
    for (let i = 0; i < d.length; i += 4) {
        const gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        [d[i], d[i + 1], d[i + 2]] = sample(gray);
    }
    tctx.putImageData(imageData, 0, 0);

    const fin = document.createElement("canvas");
    fin.width = img.width;
    fin.height = img.height;
    const fctx = fin.getContext("2d");
    fctx.imageSmoothingEnabled = false;
    fctx.drawImage(temp, 0, 0);
    fctx.globalCompositeOperation = "screen";
    fctx.filter = `blur(${glowAmount}px)`;
    fctx.drawImage(temp, 0, 0);
    return fin.toDataURL("image/png");
}

// ============================================================
// 描画(1本化)
// ============================================================
/**
 * すべての描画はここを通す。
 * @param key    imgListのキー
 * @param opt.vangle  見た目専用の角度オフセット
 * @param opt.spin    star2用の揺れ角
 * @param opt.slice   true なら9-sliceで描画(レーザー本体用)
 */
function drawSprite(key, x, y, w, h, angle, alpha = 1, opt = {}) {
    const img = imgList.get(key);
    if (!img || img === "loading") return false;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2 + (opt.vangle ?? 0) + (opt.spin ?? 0));

    if (opt.slice) {
        // 9-slice: 先端/根本の尖りは原寸、中間だけ引き伸ばす
        const capPx = Math.min(LASER_CAP_PX, Math.floor(img.height / 2));
        const capH = capPx * (w / img.width);
        const bodyH = Math.max(0, h - capH * 2);
        if (bodyH > 0) {
            ctx.drawImage(img, 0, capPx, img.width, img.height - capPx * 2,
                -w / 2, -(capH + bodyH), w, bodyH);
        }
        ctx.drawImage(img, 0, 0, img.width, capPx,
            -w / 2, -(capH + bodyH) - capH, w, capH);
        ctx.drawImage(img, 0, img.height - capPx, img.width, capPx,
            -w / 2, -capH, w, capH);
    } else {
        ctx.drawImage(img, -w / 2, -h / 2, w, h);
    }
    ctx.restore();
    return true;
}

// ============================================================
// 弾ファクトリ
// ============================================================
export function initPool(size = 5000) {
    if (!cfg) return;
    spaceb.length = 0;
    for (let i = 0; i < size; i++) {
        spaceb.push(new Bullet({
            x: 0, y: 0, type: "normal", push: false, active: false, w: 0, h: 0
        }));
    }
}

/**
 * vsize: 見た目専用サイズ(当たり判定に無関係)
 * vangle: 見た目専用角度オフセット(進行方向に無関係)
 */
export function bullet(opts = {}) {
    const p = { x: 0, y: 0, angle: 0, speed: 3, color: "white", w: 10, h: 10, type: "Circle",
        deleteFrame: Infinity, rotate: [], setlist: [], fnlist: [], custom: [], seta: [],
        rd: 1, noAuto: false, push: true, ...opts };

    if (!cfg) return new Bullet(p);

    const a = spaceb.pop();
    if (!a) { console.warn("Bullet pool exhausted!"); return null; }
    a.reset();
    a.setter({ ...p, active: true });
    a.i = bullets.length;
    bullets.push(a);
    return a;
}

export class Bullet {
    constructor(p) {
        this.map = new Map();
        this.smap = new Map();
        this.setter({ active: cfg ? false : true, ...p });
        if (p.push !== false && !cfg) bullets.push(this);
    }

    /** プール方式専用: 初期状態へ戻す */
    reset() {
        this.x = this.y = this.angle = this.speed = this.w = this.timer = 0;
        this.h = 0;
        this.rd = 1;
        this.radius = 0;
        this.color = "white";
        this.type = "normal";
        this.vsize = null;
        this.vangle = 0;
        this.deleteFrame = Infinity;
        this.custom = [];
        this.rotate = [];
        this.seta = [];
        this.noAuto = false;
        this.active = false;
        this.cachedImg = null;
        this.activeLoop = null;
        this.map.clear();
        this.smap.clear();
        this.work = null;
    }

    setter({
        x = 0, y = 0, angle = 0, speed = 3, color = "white",
        w = 10, h = 10, type = "Circle", deleteFrame = Infinity,
        rotate = [], setlist = [], fnlist = [], custom = [], seta = [],
        rd = 1, active = false, noAuto = false, size, vsize, vangle = 0
    }) {
        this.x = x; this.y = y; this.angle = angle; this.speed = speed;
        this.w = size ? size : w;
        this.h = isLaserType(type) ? 999 : (size ? size : h);
        this.vsize = vsize;        // 見た目専用サイズ
        this.vangle = vangle;      // 見た目専用角度
        this.rd = rd;
        this.radius = rd <= 0 ? 0 : (this.w * rd) / 2; // 当たり判定は実サイズ基準
        this.type = type;
        this.color = ANIM_TYPES[type]?.color ?? color; // fire/curseは色固定
        this.imgKey = `${type}-${this.color}`;
        this.timer = 0;
        this.deleteFrame = deleteFrame;
        this.custom = custom;
        this.rotate = rotate;
        this.seta = seta;
        this.noAuto = noAuto;
        this.active = active;
        this.cachedImg = null;
        this.activeLoop = null;

        preload(type, this.color);

        this.map.clear();
        for (const e of fnlist) {
            const f = e.f | 0;
            this.map.set(f, { f, l: e.loop, fn: e.fn, time: (e.time | 0) || 1 });
        }
        this.smap.clear();
        for (const e of setlist) {
            const f = e.f | 0;
            this.smap.set(f, { f, l: e.loop, e: e.e });
        }
    }

    scolor(c) {
        this.color = c;
        this.imgKey = `${this.type}-${c}`;
        this.cachedImg = null;
        preload(this.type, c);
    }

    update() {
        if (cfg && !this.active) return;
        if (superOptimal) return;

        if (this.type === "pre") this.rd = 0;
        this.radius = this.rd <= 0 ? 0 : (this.w * this.rd) / 2;

        // --- fnlist ---
        const func = this.map.get(this.timer);
        if (func?.l) this.activeLoop = func;
        else if (func) func.fn.call(this);
        const loop = this.activeLoop;
        if (loop && this.timer >= loop.f && (this.timer - loop.f) % loop.time === 0) {
            loop.fn.call(this);
        }

        // --- setlist(speed変更) ---
        const sfunc = this.smap.get(this.timer);
        if (sfunc && !sfunc.l) {
            this.speed = typeof sfunc.e === "function" ? sfunc.e.call(this) : sfunc.e;
        }

        // --- seta(angle変更) ---
        this.seta.forEach((e, i) => {
            const isLoop = e.loop ?? false;
            const isNext = e.next ?? true;
            const next = this.seta[i + 1];
            const endFrame = (isNext && next) ? Math.floor(next.f) : Infinity;
            const f = Math.floor(e.f);
            const active = isLoop ? (this.timer >= f && this.timer < endFrame) : this.timer === f;
            if (active) this.angle = typeof e.e === "function" ? e.e.call(this) : e.e;
        });

        // --- rotate ---
        if (this.rotate.length) {
            let last = this.angle;
            const hits = this.rotate.filter(r => (r.loop && r.f <= this.timer && r.lf > this.timer));
            const once = this.rotate.find(r => r.f === this.timer);
            if (once) hits.push(once);
            for (const r of hits) {
                if (r.a === "target") last = pf(this.x, this.y, 0, players[0]);
                else if (typeof r.a === "function") last = r.a.call(this);
                else last = r.a;
            }
            this.angle = last;
        }

        // --- 移動(レーザーは動かない) ---
        if (!isLaserType(this.type)) {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;
        }
        this.timer++;
    }

    /** 削除判定のみ(実際の除去は engine.js 側) */
    shouldRemove() {
        if (this.timer >= this.deleteFrame) return true;
        if (this.noAuto) return false;
        return this.x < -50 || this.x > canvas.w + 50 || this.y < -50 || this.y > canvas.h + 50;
    }

    releaseToPool() {
        const i = this.i;
        const last = bullets[bullets.length - 1];
        bullets[i] = last;
        last.i = i;
        bullets.pop();
        this.reset();
        spaceb.push(this);
    }

    // ------------------------------------------------------------
    // 描画(全種別ここに集約)
    // ------------------------------------------------------------
    draw(ctx, debug = false) {
        if (cfg && !this.active) return;
        if (this.color === "null") return;

        if (isLaserType(this.type)) {
            drawLaser(this);
            return;
        }

        // OP演出(生成直後だけ半透明+拡大)
        let alpha = 1, scale = 1;
        if (IsOp && this.timer < TIMEisOP) {
            const t = this.timer / TIMEisOP;
            alpha = OP_ALPHA + (1 - OP_ALPHA) * t;
            scale = OP_SCALE + (1 - OP_SCALE) * t;
        }
        let w = (this.vsize ?? this.w) * scale;
        let h = (this.vsize ?? this.h) * scale;
        let key = this.imgKey;
        const opt = { vangle: this.vangle };

        if (this.type === "pre") {
            const pulse = Math.sin(((this.timer % 30) / 30) * Math.PI);
            alpha *= 0.4 + pulse * 0.6;
            w *= 0.85 + pulse * 0.3;
            h *= 0.85 + pulse * 0.3;
        } else if (ANIM_TYPES[this.type]) {
            const idx = Math.floor(this.timer / ANIM_FRAME_INTERVAL) % ANIM_FRAME_COUNT + 1;
            key = `${this.type}-${ANIM_TYPES[this.type].color}-${idx}`;
        } else if (this.type === "star2") {
            opt.spin = this.timer*0.05
        }

        drawSprite(key, this.x, this.y, w, h, this.angle, alpha, opt);

        // preの光る星
        if (this.type === "pre") {
            const pulse = Math.sin(((this.timer % 30) / 30) * Math.PI);
            if (pulse > 0.7) drawPreStar(this, w / scale, pulse, alpha);
        }

        if (debug) drawDebugCircle(this);
    }

    hitTestLaser(px, py, hitboxRadius) {
        return hitTestLaser(this, px, py, hitboxRadius);
    }
}

export function pf(x, y, Offset = 0, entity, yy, xx) {
    const tx = xx !== undefined ? xx : (entity ? entity.x : (players[0]?.x || 0));
    const ty = yy !== undefined ? yy : (entity ? entity.y : (players[0]?.y || 0));
    return Math.atan2(ty - y, tx - x) + Offset;
}

function drawDebugCircle(b) {
    ctx.save();
    ctx.strokeStyle = "lime";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(b.x, b.y, b.radius * b.rd, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
}

function drawPreStar(b, baseW, pulse, opAlpha) {
    ctx.save();
    ctx.globalAlpha = ((pulse - 0.7) / 0.3) * opAlpha;
    ctx.translate(b.x, b.y);
    ctx.fillStyle = "#ffffff";
    ctx.shadowColor = "#fff6c8";
    ctx.shadowBlur = 12;
    const s = baseW * 0.25;
    ctx.beginPath();
    ctx.moveTo(0, -s);
    ctx.lineTo(s * 0.25, -s * 0.25);
    ctx.lineTo(s, 0);
    ctx.lineTo(s * 0.25, s * 0.25);
    ctx.lineTo(0, s);
    ctx.lineTo(-s * 0.25, s * 0.25);
    ctx.lineTo(-s, 0);
    ctx.lineTo(-s * 0.25, -s * 0.25);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
}

// ============================================================
// ▼▼▼ レーザー関連(ここより下はレーザー専用) ▼▼▼
// ============================================================
const LASER_CAP_PX = 32;          // laser.png の先端/根本の尖り領域(px)
const LASER_GROW_FRAMES = 12;     // 予告→本体に切り替わるまでの太さ拡大フレーム数

// laser2 は laser のエイリアス(どちらも9-slice方式)
function isLaserType(type) {
    return type === "laser" || type === "laser2";
}

/**
 * レーザー描画:
 *  timer <  speed-12 : 予告線(laserwait)。徐々に濃く・グレーに
 *  timer >= speed-12 : 本体(9-slice) + 発射地点にnormal弾を重ねる
 * ※ レーザーの speed は「発射までのフレーム数」として使われる
 */
function drawLaser(b) {
    const baseW = b.vsize ?? b.w;
    const baseH = b.vsize ?? b.h;
    const fireAt = b.speed - LASER_GROW_FRAMES;

    if (b.timer >= fireAt) {
        const t = Math.min(Math.max((b.timer - fireAt) / LASER_GROW_FRAMES, 0), 1);
        const w = 1 + (baseW - 1) * t;
        drawSprite(b.imgKey, b.x, b.y, w, baseH, b.angle, 1, { slice: true });
        drawSprite(`normal-${b.color}`, b.x, b.y, b.w, b.w, b.angle, 1, { vangle: b.vangle });
    } else {
        // 予告線
        b.waitAlpha = Math.min((b.waitAlpha ?? 0) + 0.05, 1);
        b.colorFactor = Math.min((b.colorFactor ?? 0) + 0.05, 1);
        const v = Math.floor(255 - (255 - 128) * b.colorFactor).toString(16).padStart(2, "0");
        const waitColor = `#${v}${v}${v}`;
        const waitKey = loadImg("laserwait", waitColor);
        drawSprite(waitKey, b.x, b.y, baseW, baseH, b.angle, b.waitAlpha);
    }
}

/** レーザーの当たり判定(根本から angle 方向へ h の線分 + 太さ) */
function hitTestLaser(b, px, py, hitboxRadius) {
    if (b.timer < b.speed) return false; // ← 元コードの typo(speeed)を修正
    const dirX = Math.cos(b.angle);
    const dirY = Math.sin(b.angle);
    const t = Math.max(0, Math.min(b.h, (px - b.x) * dirX + (py - b.y) * dirY));
    const dx = px - (b.x + dirX * t);
    const dy = py - (b.y + dirY * t);
    const halfW = (b.w * 0.87) / 2;
    return dx * dx + dy * dy < (hitboxRadius + halfW * 0.6) ** 2;
}