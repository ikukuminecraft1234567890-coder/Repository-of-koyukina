import { Entity, Player } from "./chars.js";
import {
    canvas, ctx, players, bullets,
    updateFrame, frame, Half, entitys, spelln, start, internal, player
} from './sys.js';
import { bullet, Bullet } from "./bc.js"
import { stat, gameLoop } from "./engine.js"

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
    if (c.y >= canvas.h - 1 && c.custom) {
        return false
    }
    if (c.y <= 1 && !c.custom) {
        return true;
    }
};

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
export const itraw = (a, b, c) => a >= b && a <= c
export const it = (t) => (min, max) => t >= min && t <= max;
const mx = 384 * 2;
const my = 448 * 2
/**
 * スペルカード開始時のゲーム状態をリセット・初期化する共通関数
 * @param {number} [playerSize=1] - プレイヤーの当たり判定サイズ
 * @param {string} [bossName="ボス"] - ボスの名前
 * @param {Array<string>} [bulletTypes=[]] - 事前にCC（カラーキャッシュ？）登録したい弾種と色の設定
 * @example
 * // 使い方
 * gameInit(0.5, "ボス", [ {type: "gummy", colors: this.list} ]);
 */
export function gi(playerSize = 1, bulletTypes = [], it = 120, zanki) {
    // 1. フレームカウンタのリセット
    pfr = 0;

    // 2. プレイヤーの生成（位置やサイズ、色などは固定、判定サイズだけ可変）
    // ※内部で globalThis に自動登録されるか、players配列にプッシュされる想定
    const playerObj = new Player(canvas.w / 2, canvas.h - 50, 15, "magenta", playerSize, it, zanki);
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


export function circle(fn, { count = 18, startDeg = 0, custom = null, step = "a" }, rl = []) {
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
        const ev = { count, step: astep, startDeg, i, deg, custom, rl }
        rl.push(ev)
        fn(ev)
    }
}

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
/**
 * 正多角形の頂点上に配置してコールバックを実行する（三角形・四角形共通汎用版）
 * @param {Function} fn - 各頂点で呼ばれるコールバック
 * @param {Object} opts
 * @param {number} [opts.sides=4] - 辺の数（3なら三角形、4なら四角形）
 * @param {number} [opts.count=1] - 1辺あたりに配置する弾の数（頂点のみなら1）
 * @param {number} [opts.startDeg=0] - 図形全体の回転オフセット（度）
 * @param {number} [opts.dist=100] - 中心から頂点までの距離
 * @param {*} [opts.custom=null] - コールバックに渡す任意データ
 */
export function polygon(fn, { sides = 4, count = 1, startDeg = 0, dist = 100, custom = null } = {}, rl = []) {
    const total = sides * count;
    for (let i = 0; i < total; i++) {
        // 頂点そのものの角度（正多角形を等分割した基準角）
        const vertexStep = 360 / sides;
        const vertexIndex = Math.floor(i / count);
        const t = (i % count) / count; // 0〜1、辺上の補間位置

        const vDegA = vertexIndex * vertexStep;
        const vDegB = ((vertexIndex + 1) % sides) * vertexStep;

        // 頂点Aと頂点Bの座標（中心からdist距離の円周上）
        const radA = dtr(vDegA + startDeg);
        const radB = dtr(vDegB + startDeg);
        const ax = Math.cos(radA) * dist;
        const ay = Math.sin(radA) * dist;
        const bx = Math.cos(radB) * dist;
        const by = Math.sin(radB) * dist;

        // 辺上を線形補間（count=1のときは頂点そのもの）
        const x = ax + (bx - ax) * t;
        const y = ay + (by - ay) * t;

        // 中心から見た角度（自機狙いや放射状の初期angleとして便利）
        let deg = normal((Math.atan2(y, x) * 180 / Math.PI), -180, 180);

        const ev = {
            sides, count, startDeg, i,
            vertexIndex, t,
            x, y, deg,
            custom, rl
        };
        rl.push(ev);
        fn(ev);
    }
}

/**
 * 三角形版のショートカット
 */
export function triangle(fn, opts = {}, rl = []) {
    return polygon(fn, { ...opts, sides: 3 }, rl);
}

/**
 * 四角形版のショートカット
 */
export function square(fn, opts = {}, rl = []) {
    return polygon(fn, { ...opts, sides: 4 }, rl);
}

/**
 * フェルマー螺旋（黄金角螺旋）上に配置してコールバックを実行する
 * r = c * sqrt(n) の関係で、中心からの距離が均一密度で広がる特徴を持つ
 * @param {Function} fn - 各点で呼ばれるコールバック
 * @param {Object} opts
 * @param {number} [opts.count=100] - 生成する点の数
 * @param {number} [opts.c=6] - 半径のスケール係数（大きいほど広がりが速い）
 * @param {number} [opts.startDeg=0] - 螺旋全体の回転オフセット（度）
 * @param {number} [opts.startIndex=0] - 螺旋のどの巻き目から開始するか（アニメーション用）
 * @param {*} [opts.custom=null] - コールバックに渡す任意データ
 */
export function spiral(fn, { count = 100, c = 6, startDeg = 0, startIndex = 0, custom = null } = {}, rl = []) {
    // 黄金角（度数）。フェルマー螺旋を美しく均等分布させる決定的な定数
    const GOLDEN_ANGLE = 137.50776405;

    for (let i = 0; i < count; i++) {
        const n = startIndex + i;
        const deg = normal((n * GOLDEN_ANGLE) + startDeg, -180, 180);
        const rad = dtr(deg);
        const radius = c * Math.sqrt(n);

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        const ev = {
            count, c, startDeg, i, n,
            x, y, deg, radius,
            custom, rl
        };
        rl.push(ev);
        fn(ev);
    }
}

/**
 * 黄金螺旋（対数螺旋、黄金比φに基づく）上に配置してコールバックを実行する
 * フェルマー螺旋（均一密度）と違い、こちらは巻きながら急激に半径が増える「巻貝型」
 * r = a * φ^(θ / 90°) の関係式（1/4回転ごとにφ倍に拡大）
 * @param {Function} fn - 各点で呼ばれるコールバック
 * @param {Object} opts
 * @param {number} [opts.count=60] - 生成する点の数
 * @param {number} [opts.a=4] - 初期半径
 * @param {number} [opts.stepDeg=15] - 1点あたりの角度進行量（度）。小さいほど滑らかならせん
 * @param {number} [opts.startDeg=0] - 螺旋全体の回転オフセット（度）
 * @param {number} [opts.turns=2] - 何回転分でφ倍になるか制御する巻き密度（大きいほど緩やかな螺旋）
 * @param {*} [opts.custom=null] - コールバックに渡す任意データ
 */
export function gspiral(fn, { count = 60, a = 4, stepDeg = 15, startDeg = 0, turns = 4, custom = null } = {}, rl = []) {
    const PHI = 1.6180339887; // 黄金比

    for (let i = 0; i < count; i++) {
        const thetaDeg = i * stepDeg;
        const deg = normal(thetaDeg + startDeg, -180, 180);
        const rad = dtr(deg);

        // turns回転（360*turns度）進むごとに半径がφ倍になるよう指数的に拡大
        const radius = a * Math.pow(PHI, thetaDeg / (360 * turns));

        const x = Math.cos(rad) * radius;
        const y = Math.sin(rad) * radius;

        const ev = {
            count, a, stepDeg, startDeg, turns, i,
            x, y, deg, radius,
            custom, rl
        };
        rl.push(ev);
        fn(ev);
    }
}

export function keep(b) {
    const Width = canvas.w
    const Height = canvas.h
    const margin = (b.w || 0) / 2
    const minX = margin - 25
    const maxX = Width - margin + 25
    const minY = margin - 25
    const maxY = Height - margin + 25

    let clamped = false

    if (b.x < minX) { b.x = minX; clamped = true }
    if (b.x > maxX) { b.x = maxX; clamped = true }
    if (b.y < minY) { b.y = minY; clamped = true }
    if (b.y > maxY) { b.y = maxY; clamped = true }

    return clamped
}