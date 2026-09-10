const imgList = new Map();
import { bullets, canvas, ctx, players } from "./sys.js"
import { cfg , superOptimal} from "./logs/cfg.js"
import {stat} from "./engine.js"
const asset = "./assets/";

// --- 💡 パレット直塗り画像で該当する色名一覧 ---
const PALETTE_COLORS = new Set([
    "crim", "red", "purple", "pink", "cobalt", "blue", "cyan",
    "aqua", "lime", "green", "olive", "gold", "yellow", "orange", "white"
]);

// --- 💡 オブジェクトプール用の配列（cfg=true のときのみ実質使用） ---
export const spaceb = [];

/**
 * 画像に幻想彩色（Glow Filter）処理を施し、DataURLを返却する関数
 */
async function setColor(img, color, glowAmount = 300) {
    const parseHexToRgb = (hexStr) => {
        const match = hexStr.trim().match(/^#?([a-fA-F0-9]{6}|[a-fA-F0-9]{3})$/);
        if (!match) return null;
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

/**
 * パレット直塗り画像（assets/pallets/${color}${type}.png）を
 * そのまま Canvas にロードして imgList にキャッシュする
 */
function loadPaletteImage(type, color, key) {
    const palImg = new Image();
    palImg.src = `${asset}pallets/${color}${type}.png`;
    palImg.onload = () => {
        const c = document.createElement("canvas");
        c.width = palImg.width;
        c.height = palImg.height;
        c.getContext("2d").drawImage(palImg, 0, 0);
        imgList.set(key, c);
    };
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

    const colorArray = Array.isArray(colors) ? colors : [colors];

    // --- 💡 パレット色のみのリクエストは baseImg のロードすら不要 ---
    const paletteRequests = colorArray.filter(c => PALETTE_COLORS.has(c));
    const glowRequests = colorArray.filter(c => !PALETTE_COLORS.has(c));

    paletteRequests.forEach(color => {
        const key = `${type}-${color}`;
        if (imgList.has(key)) return;
        imgList.set(key, "loading");
        loadPaletteImage(imgType, color, key);
    });

    if (!glowRequests.length) return;

    const baseImg = new Image();
    baseImg.src = asset + imgType + ".png";

    await new Promise(resolve => baseImg.onload = resolve);

    glowRequests.forEach(color => {
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

            // --- 💡 パレット色ならグロー処理をスキップして直接読み込む ---
            if (PALETTE_COLORS.has(color)) {
                loadPaletteImage(type, color, key);
                return;
            }

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
// idraw を2つに分離: キャッシュ解決用と描画用
function resolveImg(type, color) {
    const key = `${type}-${color}`;
    let cached = imgList.get(key);

    if (!cached) {
        imgList.set(key, "loading");
        if (PALETTE_COLORS.has(color)) {
            loadPaletteImage(type, color, key);
        } else {
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
    }
    return key; // "loading" でも key だけ返し、後で再解決できるようにする
}

// 描画専用：既にキャッシュ済みの canvas を直接受け取る
function drawCached(cachedCanvas, x, y, w, h, angle, alpha = 1) {
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.drawImage(cachedCanvas, -w / 2, -h / 2, w, h);
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
            type: "normal", deleteFrame: Infinity,
            rotate: [], 
            setlist: [], fnlist: [], push: false, custom: [], seta: [],
            rd: 1, active: false
        }));
    }
}

/**
 * 弾を生成するファクトリ関数。
 * cfg=true: プールから取り出して再利用（spaceb.pop → reset → setter）
 * cfg=false: 都度 new Bullet で生成（bullets.push は Bullet 内部で実行）
 *
 * 💡 vsize: 見た目専用のサイズ上書き。当たり判定(radius)には一切影響せず、
 *    描画時の幅・高さだけを vsize に置き換える。未指定なら従来通り w/h(またはsize)で描画。
 */
export function bullet({
    x, y, angle = 0, speed = 3, color = "white", w = 10, h = 10,
    type = "Circle", deleteFrame = Infinity,
    rotate = [],
    setlist = [], fnlist = [], push = true, custom = [], seta = [],
    active = true, rd = 1, noAuto = false, size = undefined, vsize = undefined,
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
            rotate, setlist, fnlist, custom, seta,
            active: true, noAuto, rd, size, vsize   // ← vsize を追加
        });
        a.active = true;
        a.i = bullets.length;
        bullets.push(a);
        return a;
    } else {
        // --- 通常方式 ---
        return new Bullet({
            x, y, angle, speed, color, w, h, type, deleteFrame,
            rotate, setlist, fnlist, push, custom, seta,
            rd, noAuto, size, vsize
        });
    }
}

export class Bullet {
    constructor({
        x, y, angle = 0, speed = 3, color = "white",
        w = 10, h = 10, type = "Circle",
        deleteFrame = Infinity,
        rotate = [],
        setlist = [], fnlist = [], push = true, custom = [], seta = [], rd = 1,
        active = cfg ? false : true, noAuto = false, size = undefined, vsize = undefined
    }) {
        this.custom = custom;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.w = size ? size : w;
        this.h = type !== "laser" ? size ? size : h : 999;
        // 💡 見た目専用サイズ（未指定なら null → 描画時は this.w/h をそのまま使用）
        this.vsize = vsize;
        // 💡 当たり判定は常に実サイズ(this.w)基準。vsizeの影響を受けない。
        this.radius = rd <= 0 ? 0 : (this.w * rd) / 2;
        this.rd = rd
        this.color = color;
        this.type = type;
        this.timer = 0;
    this.imgKey = `${this.type}-${this.color}`;
        this.deleteFrame = deleteFrame;
        this.rotate = rotate;
        this.seta = seta
        this.active = active;
        this.noAuto=noAuto
        // 💡 世代ID：このオブジェクトが何回目の「生」を生きているかを示す通し番号。
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
        this.size = null
        this.vsize = null   // 💡 見た目専用サイズもリセット
        this.radius = this.rd <= 0 ? 0 : (this.w * this.rd) / 2;
        this.timer = 0;
        this.deleteFrame = Infinity;
        //this.setlist = [];
        //this.fnlist = [];
this.map?.clear()
this.smap?.clear()
        this.rotate = [];
        this.noAuto = false
        this.seta = []
        this.active = false
    this.cachedImg = null;   
    this.activeLoop = null;
    this.sactiveLoop = null;
this.work = null;
    }

    /**
     * プール方式専用：既存インスタンスへ新しいパラメータを再設定する
     */
    setter({
        x, y, angle = 0, speed = 3, color = "white",
        w = 10, h = 10, type = "Circle",
        deleteFrame = Infinity,
        rotate = [],
        setlist = [], fnlist = [], push = true, custom = [], seta = [], rd = 1, active = false, noAuto = false, size = undefined, vsize = undefined
    }) {
        this.custom = custom;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.w = size ? size : w;
        this.h = type !== "laser" ? size ? size : h : 999;
        // 💡 見た目専用サイズ（未指定なら null → 描画時は this.w/h をそのまま使用）
        this.vsize = vsize;
        // 💡 当たり判定は常に実サイズ(this.w)基準。vsizeの影響を受けない。
        this.radius = rd <= 0 ? 0 : (this.w * rd) / 2;
        this.rd = rd
        this.color = color;
        this.type = type;
        this.timer = 0;
        this.deleteFrame = deleteFrame;
        this.rotate = rotate;
        this.noAuto=noAuto
        this.seta = seta
this.imgKey = `${type}-${color}`;
    resolveImg(type, color); // ロード開始 or 既存キャッシュ確認（発火だけ）
    this.cachedImg = null;   
    // 💡 プール再利用時、前の弾のループ参照(activeLoop/sactiveLoop)が
    // クリアされずに残り、fnlist/setlist未指定の弾でも誤発火してspeedが
    // 突然壊れる原因になっていたため、setter()の度に明示的にリセットする
    this.activeLoop = null;
    this.sactiveLoop = null;
    if (fnlist) {

    if (!this.map) {
        this.map = new Map();
    } else {
        this.map.clear();
    }

    for (let i = 0; i < fnlist.length; i++) {
        const e = fnlist[i];
 const f = e.f | 0
const time = e ? (e.time | 0) || 1 : 1  // 0除算・NaN化を防ぐ
this.map.set(f,{f:f,l:e.loop,fn:e.fn,time:time})
}}
    if (setlist) {

    if (!this.smap) {
        this.smap = new Map();
    } else {
        this.smap.clear();
    }
for (let i = 0; i < setlist.length; i++) {
    const e = setlist[i];
    const f = e.f | 0;
    this.smap.set(f, { f: f, l: e.loop, e: e.e });
}
        
    }
}
scolor(c) {
this.color = c
    this.imgKey = `${this.type}-${c}`;
    resolveImg(this.type, c); // ロード開始 or 既存キャッシュ確認（発火だけ）
    this.cachedImg = null;   
}
    update() {
        if (cfg && !this.active) return;
//superOptimal True
if (!superOptimal) {
if (this.type === "pre") this.rd = 0
this.radius = this.rd <= 0 ? 0 : (this.w * this.rd) / 2; // 追加
const func = this.map?.get(this.timer);

// 新しくループ処理が来たら保持する
if (func && func.l) {
    this.activeLoop = func; 
}

// 単発イベントがあれば実行
if (func && !func.l) {
    func.fn.call(this);
}

// 登録済みのループ処理があれば毎フレーム実行
if (this.activeLoop && this.timer >= this.activeLoop.f && (this.timer - this.activeLoop.f) % this.activeLoop.time === 0) {
    this.activeLoop.fn.call(this);
}
const sfunc = this.smap?.get(this.timer);

if (sfunc && !sfunc.l) {
    const val = (typeof sfunc.e === "function") ? sfunc.e.call(this) : sfunc.e;
    this.speed = val; // もしくは元のsetlist仕様に合わせて speed/x倍率など
}
if (this.sactiveLoop && this.timer >= this.sactiveLoop.f) {
    const val = (typeof this.sactiveLoop.e === "function") ? this.sactiveLoop.e.call(this) : this.sactiveLoop.e;
    this.speed = val;
}
    if (this.seta.length)this.seta.forEach((e, i) => {
            const isLoop = e.loop ?? false;
            const type = e.type ?? "set";
            const isNext = e.next ?? true;

         const next = this.seta[i + 1];
            const endFrame = (isNext && next) ? Math.floor(next.f) : Infinity;

            const isActive = (isLoop && this.timer >= Math.floor(e.f) && this.timer < endFrame) ||
                             (!isLoop && this.timer === Math.floor(e.f));

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

        looplist.forEach((targetRotate) => {
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
        const is = this.type === "laser"
        if (!is) {
            this.x += Math.cos(this.angle) * this.speed;
        }
        if (!is) {
            this.y += Math.sin(this.angle) * this.speed;
        }
        this.timer++;
    } 
}

    /**
     * 削除すべきかどうかの「判定のみ」を行う。配列からの実際の除去は呼び出し側(engine.js)が担当する。
     * ※ ここで splice を自分で行うと、呼び出し側のループでも splice される二重削除になり、
     *    弾が大量に出るほど配列インデックスがズレて無関係な弾まで消えるバグの原因になる。
     */
    shouldRemove() {
if (this.noAuto) {
    return this.timer >= this.deleteFrame;
} else {
        return this.x < -50 || this.x > canvas.w + 50 || this.y < -50 || this.y > canvas.h + 50 || this.timer >= this.deleteFrame;
}
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

// draw() 内、画像描画タイプの分岐を書き換え
draw(ctx, debug = false) {
    if (cfg && !this.active) return;
    ctx.fillStyle = this.color;
    if (this.color === "null") return;

    let isPathBullet = false;

    // 💡 見た目専用の描画サイズ。vsize が指定されていればそちらを優先し、
    //    未指定なら従来通り this.w / this.h をそのまま使う。当たり判定(radius)には無関係。
    const drawW = this.vsize ?? this.w;
    const drawH = this.vsize ?? this.h;

    if (this.type === "laser") {
        if (this.timer >= this.speed - 12) {
            const growElapsed = this.timer - (this.speed - 12);
            const growT = Math.min(Math.max(growElapsed / 12, 0), 1);
            const baseW = this.vsize ?? this.w;
            const drawWLaser = 1 + (baseW - 1) * growT;
            idraw("laser", this.x, this.y, drawWLaser, drawH, this.angle, this.color, 1);
        } else {
            if (this.waitAlpha === undefined) this.waitAlpha = 0;
            if (this.waitAlpha < 1) this.waitAlpha += 0.05;

            if (this.colorFactor === undefined) this.colorFactor = 0;
            if (this.colorFactor < 1) this.colorFactor += 0.05;

            const r = 255 - (255 - 128) * this.colorFactor;
            const g = 255 - (255 - 128) * this.colorFactor;
            const b = 255 - (255 - 128) * this.colorFactor;

            const waitColor = `#${Math.floor(r).toString(16).padStart(2, '0')}${Math.floor(g).toString(16).padStart(2, '0')}${Math.floor(b).toString(16).padStart(2, '0')}`;

            idraw("laserwait", this.x, this.y, drawW, drawH, this.angle, waitColor, Math.min(this.waitAlpha, 1));
        }
        return;
    }

    switch (this.type) {
        case "pre": {
            const t = this.timer;
            const period = 30;
            const phase = (t % period) / period;
            const pulse = Math.sin(phase * Math.PI);

            const alpha = 0.4 + pulse * 0.6;
            const scale = 0.85 + pulse * 0.3;

            idraw(
                "pre",
                this.x, this.y,
                drawW * scale, drawH * scale,
                this.angle, this.color,
                alpha
            );

            if (pulse > 0.7) {
                ctx.save();
                ctx.globalAlpha = (pulse - 0.7) / 0.3;
                ctx.translate(this.x, this.y);
                ctx.fillStyle = "#ffffff";
                ctx.shadowColor = "#fff6c8";
                ctx.shadowBlur = 12;
                const s = drawW * 0.25;
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
            break;
        }
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
        case "heart":
        case "big2":
        case "simple":
        case "fly":
        case "small":
        case "arrow":
        case "orb":
        case "gun":
        case "note": 
case"polygon":
case"light": 
case"drop":
            // 💡 ここをキャッシュ解決方式に変更
            if (!this.cachedImg) {
                const c = imgList.get(this.imgKey);
                if (c && c !== "loading") {
                    this.cachedImg = c;
                } else {
                    break; // まだロード中なら今フレームは描画スキップ
                }
            }
            // 💡 描画サイズは vsize 優先（当たり判定には影響しない）
            drawCached(this.cachedImg, this.x, this.y, drawW, drawH, this.angle);
            break;

        case "四角":
            isPathBullet = true;
            ctx.beginPath();
            ctx.rect(this.x - drawW / 2, this.y - drawH / 2, drawW, drawH);
            ctx.fill();
            ctx.closePath();
            break;
        default:
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
        ctx.arc(this.x, this.y, this.radius*this.rd, 0, Math.PI * 2);
        ctx.stroke();
        ctx.closePath();
        ctx.restore();
    }
}

    // Bullet クラス内に追加
    hitTestLaser(px, py, hitboxRadius) {
        if (this.timer < this.speeed) return;
        // レーザーの根本(this.x, this.y)から angle 方向へ h の長さの線分として判定
        const length = this.h; // レーザーの長さ（当たり判定は常に this.h 基準。vsizeは無関係）
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

        // 幅方向の判定(this.w がレーザーの太さ。vsizeは判定に使わない)
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
