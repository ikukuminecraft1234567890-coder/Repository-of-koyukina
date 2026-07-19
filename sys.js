// --- 1. 定数・共有変数 ---
import { cfg } from "./logs/cfg.js"

let fx = 0
let fy = 0
const MX = 384
const MY = 448

// グローバル変数を最上部で明示的に定義
window.keyboardState = window.keyboardState || {};
window.Allkeys = window.Allkeys || {};

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

import { Entity, Player } from "./chars.js";
import { initPool } from "./bc.js"

export let spelln = 0
export let canvas = null
export let ctx = null
export let isTouching = false;
export const entitys = []
export let player = { x: 0, y: 0 }
export let bullets = []
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
    fx = functions[index].x ?? MX
    fy = functions[index].y ?? MY
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
    // 💡 cfg=true のときだけオブジェクトプールをプリアロケートする
    if (cfg) {
        initPool(5000);
    }

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
        let key = e.key;
        if (key === "ShiftLeft" || key === "ShiftRight") key = "Shift";
        if (key === "z" || key === "Z") key = "z";
        if (key === "x" || key === "X") key = "x";

        window.keyboardState[key] = true;
        window.Allkeys[key] = true;
        if (["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight", "Shift"].includes(key)) e.preventDefault();
    });
    window.addEventListener("keyup", (e) => {
        let key = e.key;
        if (key === "ShiftLeft" || key === "ShiftRight") key = "Shift";
        if (key === "z" || key === "Z") key = "z";
        if (key === "x" || key === "X") key = "x";

        if (key === "x") players.forEach(v => v.ob = false);
        window.keyboardState[key] = false;
        window.Allkeys[key] = false;
    });
}

export const Half = { x: 192, y: 224 }; // 384x448 の半分に初期値を更新
export let players = [];
export let frame = 0;

export function sp(num) { return num * 60; }
export function sd(a, b = 1) { return a % (60 * b) === 0; }

// --- 7. 更新・リセット関数 ---
export function updateFrame() { frame++; }
export function resetFrame() { frame = 0; }
export function clearBullets() { bullets.length = 0; }

export function updateGamepad() {
    const gamepads = navigator.getGamepads ? navigator.getGamepads() : [];

    // キーボードの初期状態をセット
    let arrowLeft = window.keyboardState.ArrowLeft || false;
    let arrowRight = window.keyboardState.ArrowRight || false;
    let arrowUp = window.keyboardState.ArrowUp || false;
    let arrowDown = window.keyboardState.ArrowDown || false;
    let shift = window.keyboardState.Shift || false;
    let z = window.keyboardState.z || false;
    let x = window.keyboardState.x || false;

    const threshold = 0.3; // デッドゾーン
    let activeGamepad = false;

    // 接続されているすべてのゲームパッドをチェックして入力をマージ
    for (let i = 0; i < gamepads.length; i++) {
        const gp = gamepads[i];
        if (!gp) continue;

        activeGamepad = true;
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
    window.Allkeys.ArrowLeft = arrowLeft;
    window.Allkeys.ArrowRight = arrowRight;
    window.Allkeys.ArrowUp = arrowUp;
    window.Allkeys.ArrowDown = arrowDown;
    window.Allkeys.Shift = shift;
    window.Allkeys.z = z;
    window.Allkeys.x = x;
}
