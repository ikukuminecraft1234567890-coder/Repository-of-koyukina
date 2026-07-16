
import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half,entitys,spelln,start,internal,player} from './sys.js';
import {bullet,Bullet} from "./bc.js"
import {stat,gameLoop} from "./engine.js"
/**
 * 指定したフレーム数またはミリ秒が経過した後に、一度だけ関数を実行する
 * @param {Function} callback - 実行したい関数
 * @param {number} time - 待機する時間（フレーム数またはミリ秒）
 * @param {boolean} [isFrame=true] - trueならフレーム換算、falseならミリ秒換算
 */
// ❌ 修正前: const dtr = (deg) => (deg * Math.PI) 
// ⭕ 修正後: 度数(degree)をラジアン(radian)に正しく変換する
export const dtr = (deg) => (deg * Math.PI) / 180;
export const intern = (c) => {
    if(c.y >= canvas.h - 1  && c.custom) {
return false
}
if(c.y <= 1  && !c.custom) {
return true;
}};

// タスクごとに一意のIDを割り振るためのカウンター
export let nextTaskId = 0;

export function wait(callback, time, isFrame = true) {
    if (typeof callback !== 'function') return;

    const targetFrames = isFrame ? time : Math.round((time * 60) / 1000);
    const startFrame = pfr;

    // 💡 初回呼び出し時に Map がなければ作成する
    if (!globalThis._waitTasks) {
        globalThis._waitTasks = new Map();
    }
    
    const taskId = nextTaskId++;
    
    // 💡 MapにID付きでタスクを登録
    globalThis._waitTasks.set(taskId, {
        execute: () => {
            if (pfr - startFrame >= targetFrames) {
                callback();
                return true; // 終了フラグ
            }
            return false;
        }
    });
}

export function random(min, max, f = false) {
    const result = Math.random() * (max - min) + min;
    // f が true の場合は整数に変換（切り捨て）、そうでない場合はそのまま Float で返す
    return f ? Math.floor(result) : result;
}


export const fr = (i) => pfr % i === 0
export const ondebug = true;
export const sp = (num) => num * 60;
export const sd = (a, b = 1) => a % (60 * b) === 0;
export const fs = (m) => m / 60;
export const itraw = (a,b,c) => a >= b && a <= c
export const it = (t) => (min, max) => t >= min && t <= max;
const mx = 384*2;
const my = 448*2
/**
 * スペルカード開始時のゲーム状態をリセット・初期化する共通関数
 * @param {number} [playerSize=1] - プレイヤーの当たり判定サイズ
 * @param {string} [bossName="ボス"] - ボスの名前
 * @param {Array<string>} [bulletTypes=[]] - 事前にCC（カラーキャッシュ？）登録したい弾種と色の設定
 * @example
 * // 使い方
 * gameInit(0.5, "ボス", [ {type: "gummy", colors: this.list} ]);
 */
export function gi(playerSize = 1,bulletTypes = [],it = 120,zanki) {
    // 1. フレームカウンタのリセット
    pfr = 0;
    
    // 2. プレイヤーの生成（位置やサイズ、色などは固定、判定サイズだけ可変）
    // ※内部で globalThis に自動登録されるか、players配列にプッシュされる想定
    const playerObj = new Player(canvas.w / 2, canvas.h - 50, 15, "magenta", playerSize,it,zanki);
    // 3. ボスエンティティの生成
    entity = new Entity("ボス", Half.x, Half.y - 80, 20, "purple", 3, true);
    
    // 4. 弾種・カラーパレットの事前登録（引数があれば一括処理）
    for (const config of bulletTypes) {
        if (config.type && config.colors) {
            CC(config.type, config.colors);
        }
    }
    
    // 5. ゲームループの開始
    gameId = requestAnimationFrame(gameLoop);
}

export function normal(v, n1, n2) {
    const min = Math.min(n1, n2);
    const max = Math.max(n1, n2);
    const range = max - min; // 角度の場合、通常は「+1」しない（360°と0°が同値のため）
    
    return (((v - min) % range + range) % range) + min;
}


export function circle(fn,{count=18,startDeg=0,custom=null,step = "a"},rl=[]) {
const astep = step !== "a" ? step : 360 / count;
    for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * astep; 
        
        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;
        
        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }
const ev = {count,step:astep,startDeg,i,deg,custom,rl}
rl.push(ev)
fn(ev)
}}

/**
 * 弾を画面端（上下左右）で反射させる汎用関数
 * @param {Object} b - 弾オブジェクト（this）
 * @param {number} [padding=0] - 画面端からどれだけ内側で反射させるかの余白（弾の半径など）
 */
export function reverse(b, padding = 0) {
    const minX = padding;
    const maxX = canvas.w - padding;
    const minY = padding;
    const maxY = canvas.h - padding;

    // 💡 上下の壁での反射 (Y軸反転)
    if (b.y <= minY || b.y >= maxY) {
        b.angle = -b.angle; // ラジアンの上下反転
        b.y = Math.max(minY, Math.min(maxY, b.y)); // めり込み防止補正
return true;
    }

    // 💡 左右の壁での反射 (X軸反転)
    if (b.x <= minX || b.x >= maxX) {
        b.angle = Math.PI - b.angle; // ラジアンの左右鏡面反射
        b.x = Math.max(minX, Math.min(maxX, b.x)); // めり込み防止補正
return true;
    }
return false
}
export function pf(x, y, Offset = 0, entity, yy, xx) {
    let targetX = (xx !== undefined) ? xx : (entity ? entity.x : (players[0]?.x || 0));
    let targetY = (yy !== undefined) ? yy : (entity ? entity.y : (players[0]?.y || 0));
    return Math.atan2(targetY - y, targetX - x) + Offset;
}