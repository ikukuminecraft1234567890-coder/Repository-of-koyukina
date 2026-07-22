const imgList = new Map();
import { bullets, canvas, ctx, players } from "./sys.js"
import { cfg } from "./logs/cfg.js"
const asset = "./assets/";

// --- 💡 オブジェクトプール用の配列（cfg=true のときのみ実質使用） ---
export const spaceb = [];

/**
 * 画像に幻想彩色（Glow Filter）処理を施し、DataURLを返却する関数
 */
async function setColor(img, color, glowAmount = 300) {
    const parseHexToRgb = (hexStr) => {
        const match = hexStr.trim().match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
        if (!match) return [58, 111, 255];
        let hex = match[1];
        if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
        const num = parseInt(hex, 16);
        return [(num >> 16) & 255, (num >> 8) & 255, num & 255];
    };

    const lerp = (a, b, t) => a + (b - a) * t;

    const baseRgb = parseHexToRgb(color);
    const [r, g, b] = baseRgb;
    const steps = [
        [r * 0.20, g * 0.20, b * 0.20],
        [r * 0.65, g * 0.65, b * 0.65],
        [lerp(r, 255, 0.45), lerp(g, 255, 0.45), lerp(b, 255, 0.45)],
        [255, 255, 255]
    ];

    const sampleGradient = (gray) => {
        let t = gray / 255;
        let a, b, k;
        if (t < 0.33) {      a = steps[0]; b = steps[1]; k = t / 0.33; }
        else if (t < 0.66) { a = steps[1]; b = steps[2]; k = (t - 0.33) / 0.33; }
        else {               a = steps[2]; b = steps[3]; k = (t - 0.66) / 0.34; }
        return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), lerp(a[2], b[2], k)];
    };

    const tempCanvas = document.createElement("canvas");
    const tempCtx = tempCanvas.getContext("2d");
    tempCanvas.width = img.width;
    tempCanvas.height = img.height;

    tempCtx.drawImage(img, 0, 0);
    const imageData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
    const d = imageData.data;

    for (let i = 0; i < d.length; i += 4) {
        let gray = d[i] * 0.299 + d[i + 1] * 0.587 + d[i + 2] * 0.114;
        let [gR, gG, gB] = sampleGradient(gray);
        d[i] = gR; d[i + 1] = gG; d[i + 2] = gB;
    }
    tempCtx.putImageData(imageData, 0, 0);

    const finalCanvas = document.createElement("canvas");
    const finalCtx = finalCanvas.getContext("2d");
    finalCtx.imageSmoothingEnabled = false;
    finalCtx.webkitImageSmoothingEnabled = false;

    finalCanvas.width = img.width;
    finalCanvas.height = img.height;

    finalCtx.drawImage(tempCanvas, 0, 0);

    finalCtx.globalCompositeOperation = "screen";
    finalCtx.filter = `blur(${glowAmount}px)`;
    finalCtx.drawImage(tempCanvas, 0, 0);
    finalCtx.filter = "none";
    finalCtx.globalCompositeOperation = "source-over";

    return finalCanvas.toDataURL("image/png");
}

export async function CC(type, colors) {
    let imgType = type;
    if (imgType === "クナイ") imgType = "kunai";
    else if (imgType === "御札") imgType = "amulet";
    else if (imgType === "グミ") imgType = "gummy";
    else if (imgType === "ナイフ弾") imgType = "knife";
    else if (imgType === "大弾") imgType = "big";
    else if (imgType === "鱗弾") imgType = "scale";
    else if (imgType === "米弾") imgType = "diamond";
    else if (imgType === "陰陽玉" || imgType === "陰陽弾" || imgType === "onmyoutama" || imgType === "onmyoudama") imgType = "onmyoutama";
    else if (imgType === "laser") imgType = "laser";
    const baseImg = new Image();
    baseImg.src = asset + imgType + ".png";

    await new Promise(resolve => baseImg.onload = resolve);
    const colorArray = Array.isArray(colors) ? colors : [colors];

    colorArray.forEach(color => {
        const key = `${type}-${color}`;
        if (imgList.has(key)) return;

        imgList.set(key, "loading");
        setColor(baseImg, color).then(dataUrl => {
            const coloredImg = new Image();
            coloredImg.src = dataUrl;
            coloredImg.onload = () => {
                const c = document.createElement("canvas");
                c.width = baseImg.width;
                c.height = baseImg.height;
                c.getContext("2d").drawImage(coloredImg, 0, 0);
                imgList.set(key, c);
            };
        });
    });
}

function idraw(type, x, y, w, h, angle, color, alpha = 1) {
    const key = `${type}-${color}`;
    const cached = imgList.get(key);

    if (!cached || cached === "loading") {
        if (!cached) {
            imgList.set(key, "loading");
            const baseImg = new Image();
            baseImg.src = asset + type + ".png";
            baseImg.onload = function() {
                setColor(baseImg, color).then(dataUrl => {
                    const coloredImg = new Image();
                    coloredImg.src = dataUrl;
                    coloredImg.onload = function() {
                        const resCanvas = document.createElement("canvas");
                        resCanvas.width = baseImg.width;
                        resCanvas.height = baseImg.height;
                        resCanvas.getContext("2d").drawImage(coloredImg, 0, 0);
                        imgList.set(key, resCanvas);
                    };
                });
            };
        }
        return;
    }

    ctx.save();
    ctx.globalAlpha = alpha; // 💡 透明度を反映
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.drawImage(cached, -w / 2, -h / 2, w, h);
    ctx.restore();
}

/**
 * プール初期化（cfg=true のときだけ呼ぶ。5000個プリアロケート）
 */
export function initPool(size = 5000) {
    if (!cfg) return;
    spaceb.length = 0;
    for (let i = 0; i < size; i++) {
        spaceb.push(new Bullet({
            x: 0, y: 0, angle: 0, speed: 0, color: "white", w: 0, h: 0,
            type: "normal", deleteFrame: Infinity, rotateE: 0, rotateF: Infinity,
            rotate: [], slowF: 0, slowE: 1, fastF: Infinity, fastE: 1,
            highEx: false, slowEx: false, AcF: Infinity, AcA: 0,
            setlist: [], fnlist: [], push: false, custom: [], seta: [],
            rd: 1, active: false
        }));
    }
}

/**
 * 弾を生成するファクトリ関数。
 * cfg=true: プールから取り出して再利用（spaceb.pop → reset → setter）
 * cfg=false: 都度 new Bullet で生成（bullets.push は Bullet 内部で実行）
 */
export function bullet({
    x, y, angle = 0, speed = 3, color = "white", w = 10, h = 10,
    type = "Circle", deleteFrame = Infinity, rotateE = 0, rotateF = Infinity,
    rotate = [], slowF = 0, slowE = 1, fastF = Infinity, fastE = 1,
    highEx = false, slowEx = false, AcF = Infinity, AcA = angle,
    setlist = [], fnlist = [], push = true, custom = [], seta = [],
    active = true, rd = 1,
} = {}) {
    if (cfg) {
        // --- オブジェクトプール方式 ---
        const a = spaceb.pop();
        if (!a) {
            console.warn("Bullet pool exhausted!");
            return null;
        }
        a.reset();
        a.setter({
            x, y, angle, speed, color, w, h, type, deleteFrame,
            rotateE, rotateF, rotate, slowF, slowE, fastF, fastE,
            highEx, slowEx, AcF, AcA, setlist, fnlist, custom, seta,
            active: true,
        });
        a.active = true;
        a.i = bullets.length;
        bullets.push(a);
        return a;
    } else {
        // --- 通常方式 ---
        return new Bullet({
            x, y, angle, speed, color, w, h, type, deleteFrame,
            rotateE, rotateF, rotate, slowF, slowE, fastF, fastE,
            highEx, slowEx, AcF, AcA, setlist, fnlist, push, custom, seta,
            rd,
        });
    }
}

export class Bullet {
    constructor({
        x, y, angle = 0, speed = 3, color = "white",
        w = 10, h = 10, type = "Circle",
        deleteFrame = Infinity,
        rotateE = 0,
        rotateF = Infinity,
        rotate = [],
        slowF = 0, slowE = 1,
        fastF = Infinity, fastE = 1, highEx = false, slowEx = false, AcF = Infinity, AcA = angle,
        setlist = [], fnlist = [], push = true, custom = [], seta = [], rd = 1,
        active = cfg ? false : true,
    }) {
        this.custom = custom;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.w = w;
        this.h = type !== "laser" ? h : 999;
        this.radius = rd <= 0 ? 0 : (w * rd) / 2;
        this.rd = rd
        this.color = color;
        this.type = type;
        this.timer = 0;
        this.deleteFrame = deleteFrame;
        this.setlist = setlist;
        this.fnlist = fnlist;
        this.rotateE = rotateE;
        this.rotateF = rotateF;
        this.rotate = rotate;

        this.slowF = slowF;
        this.slowE = slowE;
        this.fastF = fastF;
        this.fastE = fastE;
        this.fastEx = highEx;
        this.slowEx = slowEx;
        this.AcF = AcF;
        this.AcA = AcA;
        this.seta = seta
        this.active = active;
        if (push && !cfg) bullets.push(this); // プール方式のときは bullet() 側で push 済み
        CC(type, [color]);
    }

    /**
     * プール方式専用：オブジェクトを初期状態へ戻す
     */
    reset() {
        this.custom = [];
        this.x = 0;
        this.y = 0;
        this.angle = 0;
        this.speed = 0;
        this.w = 0;
        this.rd = 1
        this.color = "FFFFFF";
        this.type = "nomal";
        this.h = this.type !== "laser" ? 0 : 999;
        this.radius = this.rd <= 0 ? 0 : (this.w * this.rd) / 2;
        this.timer = 0;
        this.deleteFrame = Infinity;
        this.setlist = [];
        this.fnlist = [];
        this.rotateE = 0;
        this.rotateF = Infinity;
        this.rotate = [];

        this.slowF = Infinity;
        this.slowE = 1;
        this.fastF = Infinity;
        this.fastE = 1;
        this.fastEx = false;
        this.slowEx = false;
        this.AcF = Infinity;
        this.AcA = 0;
        this.seta = []
        this.active = false
    }

    /**
     * プール方式専用：既存インスタンスへ新しいパラメータを再設定する
     */
    setter({
        x, y, angle = 0, speed = 3, color = "white",
        w = 10, h = 10, type = "Circle",
        deleteFrame = Infinity,
        rotateE = 0,
        rotateF = Infinity,
        rotate = [],
        slowF = 0, slowE = 1,
        fastF = Infinity, fastE = 1, highEx = false, slowEx = false, AcF = Infinity, AcA = angle,
        setlist = [], fnlist = [], push = true, custom = [], seta = [], rd = 1, active = false,
    }) {
        this.custom = custom;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.w = w;
        this.h = type !== "laser" ? h : 999;
        this.radius = rd <= 0 ? 0 : (w * rd) / 2;
        this.rd = rd
        this.color = color;
        this.type = type;
        this.timer = 0;
        this.deleteFrame = deleteFrame;
        this.setlist = setlist;
        this.fnlist = fnlist;
        this.rotateE = rotateE;
        this.rotateF = rotateF;
        this.rotate = rotate;

        this.slowF = slowF;
        this.slowE = slowE;
        this.fastF = fastF;
        this.fastE = fastE;
        this.fastEx = highEx;
        this.slowEx = slowEx;
        this.AcF = AcF;
        this.AcA = AcA;
        this.seta = seta
    }

    update() {
        if (cfg && !this.active) return;
        if (this.timer > this.slowF) {
            if (this.slowEx) this.speed *= this.slowE;
            else if (this.timer === this.slowF + 1) this.speed *= this.slowE;
            if (this.timer > this.AcF) this.angle = this.AcA;
        }
        if (this.timer > this.fastF) {
            if (this.fastEx) this.speed *= this.fastE;
            else if (this.timer === this.fastF + 1) this.speed *= this.fastE;
        }

    if (this.setlist.length) {let newspeed = this.speed;
        let speedMultiplier = 1;
this.setlist.forEach((e, i) => {
            const isLoop = e.loop ?? false;
            const type = e.type ?? "set";
            const isNext = e.next ?? true;

            const next = this.setlist[i + 1];
            const endFrame = (isNext && next) ? next.f : Infinity;

            const isActive = (isLoop && this.timer >= e.f && this.timer < endFrame) ||
                             (!isLoop && this.timer === e.f);

            if (isActive) {
                const val = (typeof e.e === "function") ? e.e.call(this) : e.e;
                if (type === "x") {
                    speedMultiplier = val;
                } else {
                    newspeed = val;
                }
            }
        });

        this.speed = newspeed * speedMultiplier;
}
      if (this.fnlist.length) this.fnlist.forEach((e) => {
            const isLoop = e.loop ?? false;
            const isActive = isLoop ? (this.timer >= e.f) : (this.timer === e.f);
            if (isActive && typeof e.fn === "function") {
                e.fn.call(this);
            }
        });

    if (this.seta.length)this.seta.forEach((e, i) => {
            const isLoop = e.loop ?? false;
            const type = e.type ?? "set";
            const isNext = e.next ?? true;

         const next = this.seta[i + 1];
            const endFrame = (isNext && next) ? next.f : Infinity;

            const isActive = (isLoop && this.timer >= e.f && this.timer < endFrame) ||
                             (!isLoop && this.timer === e.f);

            if (isActive) {
                const val = (typeof e.e === "function") ? e.e.call(this) : e.e;
                this.angle = val;
            }
        });

      if (this.rotate.length){
          
      const looplist = []
        let LastAngle = this.angle
        this.rotate.forEach((r) => {
            if (r.loop && r.f <= this.timer && r.lf > this.timer) looplist.push(r)
        });
        const tr = this.rotate.find(r => r.f === this.timer);
        if (tr) looplist.push(tr);

        [...new Set(looplist)].forEach((targetRotate) => {
            if (targetRotate.a === "target") {
                LastAngle = pf(this.x, this.y, 0, players[0]);
            } else if (typeof targetRotate.a === "function") {
                LastAngle = targetRotate.a.call(this);
            } else {
                LastAngle = targetRotate.a;
            }
        })
        this.angle = LastAngle
}
        if (this.timer >= this.rotateF) {
            this.angle += this.rotateE;
        }
        const is = this.type === "laser"
        if (!is) {
            this.x += Math.cos(this.angle) * this.speed;
        }
        if (!is) {
            this.y += Math.sin(this.angle) * this.speed;
        }
        this.timer++;
    }

    /**
     * 削除すべきかどうかの「判定のみ」を行う。配列からの実際の除去は呼び出し側(engine.js)が担当する。
     * ※ ここで splice を自分で行うと、呼び出し側のループでも splice される二重削除になり、
     *    弾が大量に出るほど配列インデックスがズレて無関係な弾まで消えるバグの原因になる。
     */
    shouldRemove() {
        return this.x < -50 || this.x > canvas.w + 50 || this.y < -50 || this.y > canvas.h + 50 || this.timer >= this.deleteFrame;
    }

    /**
     * プール方式専用：実際に bullets 配列から外して spaceb へ返却する（cfg=true のときだけ engine.js から呼ぶ）
     */
    releaseToPool() {
        const i = this.i;
        const last = bullets[bullets.length - 1];
        bullets[i] = last;
        last.i = i;
        bullets.pop();
        this.reset();
        spaceb.push(this);
    }

    draw(ctx, debug = false) {
        if (cfg && !this.active) return;
        ctx.fillStyle = this.color;

        // 💡 画像描画タイプとパス描画（fill）タイプで処理を分離させてバグを修正
        let isPathBullet = false;
        if (this.type === "laser") {
            if (this.timer >= this.speed) {
                // 💡 本体レーザーを召喚(元の不透明な color をそのまま使用)
                idraw("laser", this.x, this.y, this.w, this.h, this.angle, this.color, 1);
            } else {
                // 💡 予告中：laserwait.png を透明度0→1で徐々にはっきりさせる
                if (this.waitAlpha === undefined) this.waitAlpha = 0;
                if (this.waitAlpha < 1) this.waitAlpha += 0.05;

                if (this.colorFactor === undefined) this.colorFactor = 0;
                if (this.colorFactor < 1) this.colorFactor += 0.05;

                const r = 255 - (255 - 128) * this.colorFactor;
                const g = 255 - (255 - 128) * this.colorFactor;
                const b = 255 - (255 - 128) * this.colorFactor;

                const waitColor = `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;

                idraw("laserwait", this.x, this.y, this.w, this.h, this.angle, waitColor, Math.min(this.waitAlpha, 1));
            }
            return;
        }

        switch (this.type) {
            case "normal":
            case "クナイ":
            case "kunai":
            case "御札":
            case "amulet":
            case "グミ":
            case "gummy":
            case "ナイフ弾":
            case "knife":
            case "大弾":
            case "big":
            case "鱗弾":
            case "scale":
            case "米弾":
            case "diamond":
            case "陰陽玉":
            case "陰陽弾":
            case "onmyoutama":
            case "om":
            case "star":
            case "kunai2":
                let imgType = this.type;
                if (imgType === "クナイ") imgType = "kunai";
                else if (imgType === "御札") imgType = "amulet";
                else if (imgType === "グミ") imgType = "gummy";
                else if (imgType === "ナイフ弾") imgType = "knife";
                else if (imgType === "大弾") imgType = "big";
                else if (imgType === "鱗弾") imgType = "scale";
                else if (imgType === "米弾") imgType = "diamond";
                else if (imgType === "陰陽玉" || imgType === "陰陽弾" || imgType === "onmyoutama" || imgType === "om") imgType = "onmyoutama";
                idraw(imgType, this.x, this.y, this.w, this.h, this.angle, this.color);
                break;

            case "四角":
                isPathBullet = true;
                ctx.beginPath();
                ctx.rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
                ctx.fill();
                ctx.closePath();
                break;
            default:
                // Circleなどのデフォルトパス描画
                isPathBullet = true;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fill();
                ctx.closePath();
                break;
        }

if (debug) {
            ctx.save();
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }

    // Bullet クラス内に追加
    hitTestLaser(px, py, hitboxRadius) {
        if (this.timer < this.speeed) return;
        // レーザーの根本(this.x, this.y)から angle 方向へ h の長さの線分として判定
        const length = this.h; // レーザーの長さ
        const dirX = Math.cos(this.angle);
        const dirY = Math.sin(this.angle);

        // 線分の始点から対象までのベクトル
        const toPX = px - this.x;
        const toPY = py - this.y;

        // 線分方向への射影(0〜lengthにクランプ)
        let t = toPX * dirX + toPY * dirY;
        t = Math.max(0, Math.min(length, t));

        // 線分上の最近点
        const closestX = this.x + dirX * t;
        const closestY = this.y + dirY * t;

        // 幅方向の判定(this.w がレーザーの太さ)
        const dx = px - closestX;
        const dy = py - closestY;
        const laserHalfWidth = ((this.w * 0.87)) / 2;

        return (dx * dx + dy * dy) < Math.pow(hitboxRadius + laserHalfWidth * 0.6, 2);
    }
}

// --- 5. 便利関数 (数学・スポナー) ---
export function pf(x, y, Offset = 0, entity, yy, xx) {
    let targetX = (xx !== undefined) ? xx : (entity ? entity.x : (players[0]?.x || 0));
    let targetY = (yy !== undefined) ? yy : (entity ? entity.y : (players[0]?.y || 0));
    return Math.atan2(targetY - y, targetX - x) + Offset;
}

export function CircleSpawn(x, y, speed, size, count, df, rotationSpeed = 0.05, color = "white") {
    const step = (Math.PI * 2) / count;
    for (let i = 0; i < count; i++) {
        const angle = (i * step); // frame依存部分は呼び出し側の frame を使いたい場合は sys.js 側で加算してください
        bullet({ x, y, angle, speed, color, w: size, h: size, type: "Circle", deleteFrame: df });
    }
}

export function spawnPlayerFocus(x, y, speed = 3.5, size = 8, df = 180, color = "white") {
    bullet({ x, y, angle: pf(x, y, 0), speed, color, w: size, h: size, type: "Circle", deleteFrame: df });
}

export function spawnDownRect(x, y, speed = 4, w = 10, h = 20, df = 300) {
    bullet({ x, y, angle: Math.PI / 2, speed, color: "orange", w, h, type: "Rect", deleteFrame: df });
}

export function b(config) {
    return bullet(config);
}
