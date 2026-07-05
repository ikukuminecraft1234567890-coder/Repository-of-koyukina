// --- 1. 定数・共有変数 ---
let fx = 0
let fy = 0
const asset = "./assets/";

/**
 * 画面上の座標からグリッド位置を計算する（デバッグ用など）
 */
export function gps(x, y) {
    if (!canvas || !canvas.w || !canvas.h) return { w: 0, h: 0 };

    const cx = Math.max(0, Math.min(x, canvas.w - 1));
    const cy = Math.max(0, Math.min(y, canvas.h - 1));

    return {
        w: Math.floor(cx / (canvas.w / 2)),
        h: Math.floor(cy / (canvas.h / 2))
    };
}

// ⭕ canvas.w と canvas.h を使って自動判定する画面内チェック
export const internal = (c) => {
    if (!canvas || !canvas.w || !canvas.h) return false;
    const cx = Math.max(0, Math.min(c.x, canvas.w - 1));
    const cy = Math.max(0, Math.min(c.y, canvas.h - 1));
    return c.x !== undefined && 
           c.y !== undefined && 
           c.x >= 0 && 
           c.y >= 0 && 
           cx < canvas.w && 
           cy < canvas.h;
};

const imgList = new Map();

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

import { Entity, Player } from "./chars.js";
export let spelln = 0
export let canvas = null
export let ctx = null
export let isTouching = false;
export const entitys = []
export const bullets = []
let lastTouchX = 0 
let lastTouchY = 0
import { functions } from "./boss.js"
import { nsnew, rpfr, setent } from "./engine.js"

export function start(index, bool) {
    players.forEach(e => e.remove());
    entitys.length = 0;
    bullets.length = 0;
    spelln = index;
    nsnew(index);
    const fn = functions[index];

    const allData = JSON.parse(localStorage.getItem("sd")) || {};
    const now = allData[spelln] ?? { gets: 0, amount: 0 };
    allData[spelln] = { ...now, amount: now.amount + 1 };
    localStorage.setItem("sd", JSON.stringify(allData));

    const oldCanvas = document.getElementById("gameCanvas");
    if (oldCanvas) {
        oldCanvas.remove();
    }
    frame = 0;

    const canvasElement = document.createElement("canvas");
    canvasElement.id = "gameCanvas";
    document.body.appendChild(canvasElement);
    
    canvas = canvasElement;
    ctx = canvas.getContext("2d");

    // 💡 呼び出し元（boss.js等）にサイズ指定がなければ初期値384x448（東方サイズ）にする
    fx = functions[index].x ?? 384
    fy = functions[index].y ?? 448
    const VIRTUAL_WIDTH = fx; 
    const VIRTUAL_HEIGHT = fy;
    canvas.w = VIRTUAL_WIDTH;
    canvas.h = VIRTUAL_HEIGHT;

    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    let displayWidth = screenWidth;
    let displayHeight = screenHeight;

    if (screenWidth / screenHeight > VIRTUAL_WIDTH / VIRTUAL_HEIGHT) {
        displayWidth = screenHeight * (VIRTUAL_WIDTH / VIRTUAL_HEIGHT);
    } else {
        displayHeight = screenWidth * (VIRTUAL_HEIGHT / VIRTUAL_WIDTH);
    }

    canvas.style.width = displayWidth + 'px';
    canvas.style.height = displayHeight + 'px';

    const dpr = window.devicePixelRatio || 1;
    canvas.width = VIRTUAL_WIDTH * (displayWidth / VIRTUAL_WIDTH) * dpr;
    canvas.height = VIRTUAL_HEIGHT * (displayHeight / VIRTUAL_HEIGHT) * dpr;

    const scaleX = canvas.width / VIRTUAL_WIDTH;
    const scaleY = canvas.height / VIRTUAL_HEIGHT;
    ctx.scale(scaleX, scaleY);

    ctx.imageSmoothingEnabled = false;
    ctx.imageSmoothingQuality = "low";

    Half.x = Math.floor(VIRTUAL_WIDTH / 2);
    Half.y = Math.floor(VIRTUAL_HEIGHT / 2);

    inits();
    if (typeof fn.init === "function") {
        fn.init();
    }
}

function inits() {
    canvas.addEventListener("touchmove", (e) => {
        e.preventDefault();
        if (!players[0]) return;

        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        
        const currentX = touch.clientX - rect.left;
        const currentY = touch.clientY - rect.top;

        // 💡 fx, fy の代わりに明確な基準サイズである canvas.w/h から拡大率を割り出す
        const gameScaleX = canvas.w / rect.width;
        const gameScaleY = canvas.h / rect.height;

        const dx = (currentX - lastTouchX) * gameScaleX;
        const dy = (currentY - lastTouchY) * gameScaleY;

        players[0].x += dx;
        players[0].y += dy;
        


   players[0].x = Math.max(0, Math.min(canvas.w, players[0].x));
players[0].y = Math.max(0, Math.min(canvas.h, players[0].y));
        lastTouchX = currentX;
        lastTouchY = currentY;
    }, { passive: false });

    canvas.addEventListener("touchstart", (e) => {
        e.preventDefault();
        const touch = e.touches[0];
        const rect = canvas.getBoundingClientRect();
        lastTouchX = touch.clientX - rect.left;
        lastTouchY = touch.clientY - rect.top;
        isTouching = true;
    }, { passive: false });

    canvas.addEventListener("touchend", () => {
        isTouching = false;
    });

    window.addEventListener("keydown", (e) => {
        keyboardState[e.key] = true;
        Allkeys[e.key] = true;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Shift"].includes(e.key)) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => { 
        if (e.key === "x") players.forEach(v => v.ob = false);
        keyboardState[e.key] = false;
        Allkeys[e.key] = false; 
    });
}

export const Half = { x: 192, y: 224 }; // 384x448 の半分に初期値を更新
export let players = [];
const keyboardState = {};
export const Allkeys = {};
export let frame = 0;

export function sp(num) { return num * 60; }
export function sd(a, b = 1) { return a % (60 * b) === 0; }

function idraw(type, x, y, w, h, angle, color) {
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
    ctx.translate(x, y);
    ctx.rotate(angle + Math.PI / 2);
    ctx.drawImage(cached, -w / 2, -h / 2, w, h);
    ctx.restore();
}
export function bullet({
    x, 
    y, 
    angle = 0, 
    speed = 3, 
    color = "white", 
    w = 10, 
    h = 10, 
    type = "Circle", 
    deleteFrame = Infinity, 
    rotateE = 0,          
    rotateF = Infinity,   
    rotate = [],          
    slowF = 0, 
    slowE = 1,
    fastF = Infinity, 
    fastE = 1, 
    highEx = false, 
    slowEx = false, 
    AcF = Infinity, 
    AcA = angle, // 引数で渡された angle の値をデフォルト値として使用
    setlist = [], 
    fnlist = [], 
    push = true, 
    custom = [],
    seta = []
}) {
return new Bullet({
        x: x, 
        y: y, 
        angle: angle, 
        speed: speed, 
        color: color, 
        w: w, 
        h: h, 
        type: type, 
        deleteFrame: deleteFrame, 
        rotateE: rotateE,          
        rotateF: rotateF,   
        rotate: rotate,          
        slowF: slowF, 
        slowE: slowE,
        fastF: fastF, 
        fastE: fastE, 
        highEx: highEx, 
        slowEx: slowEx, 
        AcF: AcF, 
        AcA: AcA, 
        setlist: setlist, 
        fnlist: fnlist, 
        push: push, 
        custom: custom,
        seta: seta
    });
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
        fastF = Infinity, fastE = 1, highEx = false, slowEx = false, AcF = Infinity, AcA = angle, setlist = [], fnlist = [], push = true, custom = [],seta=[]
    }) {
        this.custom = custom;
        this.x = x;
        this.y = y;
        this.angle = angle;
        this.speed = speed;
        this.w = w;
        this.h = h;
        this.radius = w / 2;
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
        if (push) bullets.push(this);
        CC(type, [color]);
    }

    update() {
        if (this.timer > this.slowF) {
            if (this.slowEx) this.speed *= this.slowE;
            else if (this.timer === this.slowF + 1) this.speed *= this.slowE;
            if (this.timer > this.AcF) this.angle = this.AcA;
        }
        if (this.timer > this.fastF) {
            if (this.fastEx) this.speed *= this.fastE;
            else if (this.timer === this.fastF + 1) this.speed *= this.fastE;
        }

        let newspeed = this.speed;
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
        this.fnlist.forEach((e) => {
            const isLoop = e.loop ?? false;
            const isActive = isLoop ? (this.timer >= e.f) : (this.timer === e.f);
            if (isActive && typeof e.fn === "function") {
                e.fn.call(this);
            }
        });

  this.seta.forEach((e, i) => {
            const isLoop = e.loop ?? false;        
            const type = e.type ?? "set";          
            const isNext = e.next ?? true;         

            const next = this.setlist[i + 1];
            const endFrame = (isNext && next) ? next.f : Infinity;

            const isActive = (isLoop && this.timer >= e.f && this.timer < endFrame) || 
                             (!isLoop && this.timer === e.f);

            if (isActive) {
                const val = (typeof e.e === "function") ? e.e.call(this) : e.e;
                    this.angle = val;
            }
        });

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

        if (this.timer >= this.rotateF) {
            this.angle += this.rotateE;
        }

        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;
        this.timer++;
    }

    shouldRemove() {
        return (this.x < -50 || this.x > canvas.w + 50 || this.y < -50 || this.y > canvas.h + 50 || this.timer >= this.deleteFrame);
    }

    draw(ctx, debug = false) {
        ctx.fillStyle = this.color;
        
        // 💡 画像描画タイプとパス描画（fill）タイプで処理を分離させてバグを修正
        let isPathBullet = false;

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
                idraw(this.type === "クナイ" ? "kunai" : this.type === "御札" ? "amulet" : this.type === "グミ" ? "gummy" : this.type === "ナイフ弾" ? "knife" : this.type === "大弾" ? "big" : this.type === "鱗弾" ? "scale" : this.type === "米弾" ? "diamond" : this.type, this.x, this.y, this.w, this.h, this.angle, this.color);
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
            ctx.translate(this.x, this.y);
            ctx.rotate(this.angle);
            ctx.restore();
        }
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
        const angle = (i * step) + (frame * rotationSpeed); 
        new Bullet({ x, y, angle, speed, color, w: size, h: size, type: "Circle", deleteFrame: df });
    }
}

export function spawnPlayerFocus(x, y, speed = 3.5, size = 8, df = 180, color = "white") {
    new Bullet({ x, y, angle: pf(x, y, 0), speed, color, w: size, h: size, type: "Circle", deleteFrame: df });
}

export function spawnDownRect(x, y, speed = 4, w = 10, h = 20, df = 300) {
    new Bullet({ x, y, angle: Math.PI / 2, speed, color: "orange", w, h, type: "Rect", deleteFrame: df });
}

// --- 7. 更新・リセット関数 ---
export function updateFrame() { frame++; }
export function resetFrame() { frame = 0; }
export function clearBullets() { bullets.length = 0; }
export function b(config) {
    return new Bullet(...config)
}

export async function CC(type, colors) {
    const baseImg = new Image();
    baseImg.src = asset + type + ".png";
    
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

export function updateGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];
    
    // キーボードの初期状態をセット
    let arrowLeft = keyboardState.ArrowLeft || false;
    let arrowRight = keyboardState.ArrowRight || false;
    let arrowUp = keyboardState.ArrowUp || false;
    let arrowDown = keyboardState.ArrowDown || false;
    let shift = keyboardState.Shift || false;
    let z = keyboardState.z || false;
    let x = keyboardState.x || false;

    const threshold = 0.3; // デッドゾーン

    // 接続されているすべてのゲームパッドをチェックして入力をマージ
    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;

        const stickX = gp.axes[0] || 0;
        const stickY = gp.axes[1] || 0;
        const dpadUp = gp.buttons[12]?.pressed || false;
        const dpadDown = gp.buttons[13]?.pressed || false;
        const dpadLeft = gp.buttons[14]?.pressed || false;
        const dpadRight = gp.buttons[15]?.pressed || false;

        // スティックまたはD-padの入力をマージ
        arrowLeft = arrowLeft || (stickX < -threshold) || dpadLeft;
        arrowRight = arrowRight || (stickX > threshold) || dpadRight;
        arrowUp = arrowUp || (stickY < -threshold) || dpadUp;
        arrowDown = arrowDown || (stickY > threshold) || dpadDown;

        // ボタン入力をマージ
        shift = shift || gp.buttons[1]?.pressed || false;
        z = z || gp.buttons[0]?.pressed || false;
        x = x || gp.buttons[2]?.pressed || gp.buttons[3]?.pressed || false;
    }

    // 最終的な状態をAllkeysに適用
    Allkeys.ArrowLeft = arrowLeft;
    Allkeys.ArrowRight = arrowRight;
    Allkeys.ArrowUp = arrowUp;
    Allkeys.ArrowDown = arrowDown;
    Allkeys.Shift = shift;
    Allkeys.z = z;
    Allkeys.x = x;
}
