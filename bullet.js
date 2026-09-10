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

/**
 * @param {Function} callback - 実行したい関数
 * @param {number} time - 待機する時間（フレーム数またはミリ秒）
 * @param {boolean} [isFrame=true] - trueならフレーム換算、falseならミリ秒換算
 */
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
        },
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
export function gi(playerSize = 1, bulletTypes = [], it = 120, zankia) {
    // 1. フレームカウンタのリセット
    pfr = 0;
const zanki = stat.isChallenge ? stat.nowzanki : zankia
    // 2. プレイヤーの生成（位置やサイズ、色などは固定、判定サイズだけ可変）
    // ※内部で globalThis に自動登録されるか、players配列にプッシュされる想定
    const playerObj = new Player(canvas.w / 2, canvas.h - 50, 15, "magenta", playerSize, it, zanki);
    // 3. ボスエンティティの生成
    entity = new Entity("ボス", Half.x, Half.y - 80, 20, "purple", 6, true,20,Infinity);

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
export function arc(
    fn,
    {
        x = 0,
        y = 0,
        count = 18,
        startDeg = 0,
        length = 0,
        custom = null,
        step = "a"
    },
    rl = []
) {
    const astep = step !== "a" ? step : 360 / count;

    for (let i = 0; i < count; i++) {
        let baseDeg = i * astep;
        let deg = (baseDeg + startDeg) % 360;

        if (deg > 180) deg -= 360;

        const rad = deg * Math.PI / 180;

        const ev = {
            count,
            step: astep,
            startDeg,
            length,
            i,
            deg,
            rad,

            // オフセット
            dx: Math.cos(rad) * length,
            dy: Math.sin(rad) * length,

            // 実際の座標
            x: x + Math.cos(rad) * length,
            y: y + Math.sin(rad) * length,

            custom,
            rl
        };

        rl.push(ev);
        fn(ev);
    }
}

/**
 * 弾を画面端（上下左右）で反射させる汎用関数
 * @param {Object} b - 弾オブジェクト（this）
 * @param {number} [padding=0] - 画面端からどれだけ内側で反射させるかの余白（弾の半径など）
 */
export function reverse(b, padding = 0,i=true) {
    const minX = padding;
    const maxX = canvas.w - padding;
    const minY = padding;
    const maxY = canvas.h - padding;

    // 💡 上下の壁での反射 (Y軸反転)
    if (b.y <= minY || b.y >= maxY) {
      if (i) b.angle = -b.angle; // ラジアンの上下反転
        b.y = Math.max(minY, Math.min(maxY, b.y)); // めり込み防止補正
        return true;
    }

    // 💡 左右の壁での反射 (X軸反転)
    if (b.x <= minX || b.x >= maxX) {
        if (i)b.angle = Math.PI - b.angle; // ラジアンの左右鏡面反射
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

export function keep(b,m=25) {
    const Width = canvas.w
    const Height = canvas.h
    const margin = (b.w || 0) / 2
    const minX = margin - m
    const maxX = Width - margin + m
    const minY = margin - m
    const maxY = Height - margin + m

    let clamped = false

    if (b.x < minX) { b.x = minX; clamped = true }
    if (b.x > maxX) { b.x = maxX; clamped = true }
    if (b.y < minY) { b.y = minY; clamped = true }
    if (b.y > maxY) { b.y = maxY; clamped = true }

    return clamped
}
/**
 * RGBの数値を16進数カラーコード（HEX）に変換する関数
 * @param {number} r - 赤 (0〜255)
 * @param {number} g - 緑 (0〜255)
 * @param {number} b - 青 (0〜255)
 * @returns {string} `#RRGGBB` 形式の文字列
 */
export function ccolor(r, g, b) {
  // 各値を 0〜255 の範囲内にクランプ（丸め）して整数化
  const toHex = (value) => {
    const clamped = Math.max(0, Math.min(255, Math.round(Number(value) || 0)));
    // 16進数に変換し、1桁の場合は先頭に 0 を付与（パディング）
    return clamped.toString(16).padStart(2, '0');
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}



export function seed(min, max, s = 1, { isFloat = true, ns: autoStep = false } = {}) {
  let currentSeed = (typeof s === 'object' && s !== null) ? s.s : s;
  const safeSeed = (currentSeed === 0 ? 1 : currentSeed) >>> 0;

  // ★ここを追加：シードを一度ハッシュ的に混ぜてから使う
  const mixed = ns(safeSeed);
  const rand01 = mixed / 4294967296;

  const lower = Math.min(min, max);
  const upper = Math.max(min, max);

  const val = isFloat
    ? lower + rand01 * (upper - lower)
    : Math.floor(lower + rand01 * (upper - lower + 1));

  if (autoStep) {
    const nextVal = ns(currentSeed);
    if (typeof s === 'object' && s !== null) {
      s.s = nextVal;
    }
  }

  return val;
}
export function ns(s = 1) {
  let x = (s === 0 ? 1 : s) >>> 0;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
  x ^= x << 13; x ^= x >>> 17; x ^= x << 5; // 2周目
  return x >>> 0;
}

/* ============================================================
   ① インスタンス版：new Seed() したものに直接 .random() が生える
   this.seeds = Seed.multi([...], true) で複数まとめて作れる
   ============================================================ */
export class Seed {
  constructor(v, add = true) {
    if (v === undefined) {
      this.s = stat.pfr >>> 0;
    } else if (add) {
      this.s = (stat.pfr + v) >>> 0;
    } else {
      this.s = (v === 0 ? 1 : v) >>> 0;
    }
  }

  random(min, max, isFloat = true) {
    const mixed = ns(this.s);
    this.s = mixed;

    const rand01 = mixed / 4294967296;
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);

    return isFloat
      ? lower + rand01 * (upper - lower)
      : Math.floor(lower + rand01 * (upper - lower + 1));
  }

  call(min, max, isFloat = true) {
    return this.random(min, max, isFloat);
  }

  // 複数のSeedインスタンスを一括生成
  static multi(spread = [], add = true) {
    return spread.map(v => new Seed(v, add));
  }
}

/* ============================================================
   ② entity/キー版：好きなオブジェクト(entityやthisなど)を渡して
   Seed.random(entity, min, max) で呼ぶ。WeakMapで状態を紐付け。
   entity側にプロパティを生やさずに済むのが利点。
   ============================================================ */
class SeedInstance {
  constructor(v, add = true) {
    if (v === undefined) {
      this.s = stat.pfr >>> 0;
    } else if (add) {
      this.s = (stat.pfr + v) >>> 0;
    } else {
      this.s = (v === 0 ? 1 : v) >>> 0;
    }
  }

  next(min, max, isFloat) {
    const mixed = ns(this.s);
    this.s = mixed;

    const rand01 = mixed / 4294967296;
    const lower = Math.min(min, max);
    const upper = Math.max(min, max);

    return isFloat
      ? lower + rand01 * (upper - lower)
      : Math.floor(lower + rand01 * (upper - lower + 1));
  }
}

export class SeedKey {
  static #map = new WeakMap();

  static #get(entity, v, add) {
    let inst = SeedKey.#map.get(entity);
    if (!inst) {
      inst = new SeedInstance(v, add);
      SeedKey.#map.set(entity, inst);
    }
    return inst;
  }

  static random(entity, min, max, isFloat = true, v, add = true) {
    return SeedKey.#get(entity, v, add).next(min, max, isFloat);
  }

  static call(entity, min, max, isFloat = true, v, add = true) {
    return SeedKey.#get(entity, v, add).next(min, max, isFloat);
  }
}
export function smooth(bull,target,time) {
const smoothTime = target / time
const snapshot = bull.timer 
for (let i = 0;i<time;i++) wait(()=>{bull.angle+=(smoothTime)},i,true)
}
export function smoothSet(bull, target, time) {
    const start = bull.angle
    const diff = target - start
    for (let i = 1; i <= time; i++) {
        wait(() => {
            bull.angle = start + diff * (i / time)
        }, i, true)
    }
}

/**
 * 内積（扇状視界判定）と外積（半自機狙い補正）を組み合わせて射撃角度と位置関係を取得する関数
 * 
 * @param {number} x - 射撃元のX座標
 * @param {number} y - 射撃元のY座標
 * @param {number} angle - 基準となる射出方向（ラジアン）
 * @param {number|Object} range - 許容角度（度数法）。数値なら -range〜+range、オブジェクトなら {min, max}
 * @param {Object} [target] - 狙う対象（未指定時は players[0] を自動参照）
 * @param {number} [bias=0.3] - 自機方向への補正強度（0.0〜1.0）
 * @returns {Object} { angle: 最終的な発射角度(rad), relAngle: 相対角度(deg), inArea: 範囲内フラグ(bool), side: 左右判定(string) }
 */
export function getArea(x, y, angle, range, target = players[0], bias = 0.3) {
    // 1. 引数 range の解析
    let minDeg, maxDeg;
    if (typeof range === "object" && range !== null) {
        minDeg = range.min ?? -30;
        maxDeg = range.max ?? 30;
    } else {
        const r = Math.abs(Number(range) || 0);
        minDeg = -r;
        maxDeg = r;
    }

    // ターゲットが存在しない場合のデフォルト返却
    if (!target) {
        return { angle, relAngle: 0, inArea: false, side: "none" };
    }

    // 2. ベクトルの準備
    const fwdX = Math.cos(angle);
    const fwdY = Math.sin(angle);

    const dx = target.x - x;
    const dy = target.y - y;
    const dist = Math.hypot(dx, dy);

    if (dist === 0) {
        return { angle, relAngle: 0, inArea: true, side: "center" };
    }

    const toTargetX = dx / dist;
    const toTargetY = dy / dist;

    // 3. 【内積】なす角の計算
    const dot = fwdX * toTargetX + fwdY * toTargetY;
    const diffAngleRad = Math.acos(Math.max(-1, Math.min(1, dot)));
    const diffAngleDeg = (diffAngleRad * 180) / Math.PI;

    // 4. 【外積】左右の判定
    // Canvas座標系（Y軸下向き）において:
    // cross > 0: 基準方向から見て右側
    // cross < 0: 基準方向から見て左側
    const cross = fwdX * toTargetY - fwdY * toTargetX;
    const sideSign = cross >= 0 ? 1 : -1;

    // 基準ベクトルからの相対角度（左側: マイナス、右側: プラス）
    const targetRelativeDeg = diffAngleDeg * sideSign;

    // 5. 扇状範囲（minDeg 〜 maxDeg）の中にターゲットが入っているか判定
    const isInSector = (targetRelativeDeg >= minDeg && targetRelativeDeg <= maxDeg);

    // 左右表記の文字列判定
    let sideStr = "center";
    if (Math.abs(targetRelativeDeg) > 0.1) {
        sideStr = sideSign > 0 ? "right" : "left";
    }

    // 6. 最終角度の算出
    let finalAngleRad = angle;
    if (isInSector) {
        const shiftDeg = targetRelativeDeg * bias;
        finalAngleRad = angle + dtr(shiftDeg);
    }

    // 欲しい情報をすべてまとめたオブジェクトを返す！
    return {
        angle: finalAngleRad,          // 計算後の発射角度 (rad)
        relAngle: targetRelativeDeg,   // 基準方向からの相対角度 (deg) ※例: -25.5° や +40.0°
        inArea: isInSector,            // 判定範囲内に入っているか (true / false)
        side: sideStr                  // "left", "right", "center", "none"
    };
}


/**
 * 範囲内に自機がいる時だけ、精度をばらつかせた自機狙い角度を返す関数
 * 
 * @param {number} x - 射撃元のX座標
 * @param {number} y - 射撃元のY座標
 * @param {number} angle - 基準となる方向（ラジアン）
 * @param {Object} range - 許容範囲 {min: 度数, max: 度数} （例: {min: -45, max: 45}）
 * @param {number} [spread=15] - 狙いの荒さ・ブレ幅（度数法）。±15°なら最大15度ズレる
 * @param {Object} [target=players[0]] - 狙う対象
 * @returns {number} 決定された射撃角度（ラジアン）
 */
export function pfneo(x, y, angle, range = { min: -45, max: 45 }, spread = 15, target = players[0]) {
    if (!target) return angle;

    // 1. 自機への絶対角度を計算（Math.atan2）
    const dx = target.x - x;
    const dy = target.y - y;
    const targetAngle = Math.atan2(dy, dx);

    // 2. 基準角度（angle）と自機方向（targetAngle）の差分を求める（-Math.PI 〜 +Math.PI に正規化）
    let diffRad = targetAngle - angle;
    diffRad = Math.atan2(Math.sin(diffRad), Math.cos(diffRad));
    const diffDeg = (diffRad * 180) / Math.PI;

    // 3. 自機が range(min 〜 max) の視界内にいるかチェック
    const minDeg = range.min ?? -45;
    const maxDeg = range.max ?? 45;

    if (diffDeg >= minDeg && diffDeg <= maxDeg) {
        // --- 視界内の場合：粗い自機狙い ---
        // (Math.random() - 0.5) で -0.5 ～ +0.5
        // それに spread(例:15) * 2 を掛けることで -15° ～ +15° のランダムなブレを作る
        const randomOffsetDeg = (Math.random() - 0.5) * 2 * spread;
        const randomOffsetRad = (randomOffsetDeg * Math.PI) / 180;

        return targetAngle + randomOffsetRad;
    } else {
        // --- 視界外の場合：基準角度をそのまま返す ---
        return angle;
    }
}

/**
 * V字（またはV字を描く2方向）の弾配置を生成し、コールバックを実行する
 * baseDegを軸として、左右に±spreadDegだけ開いた2方向に弾を配置する。
 * countを増やすと、その2方向に沿って時間差なしで並ぶ複数弾（V字の"線"の密度）になる。
 *
 * @param {Function} fn - 各弾で呼ばれるコールバック。引数は配置情報オブジェクト(ev)
 * @param {Object} opts
 * @param {number} [opts.x=0] - 発生源のX座標
 * @param {number} [opts.y=0] - 発生源のY座標
 * @param {number} [opts.baseDeg=90] - V字の軸となる中心角度（度）。90なら下向き
 * @param {number} [opts.spreadDeg=30] - 軸から左右に開く角度（度）
 * @param {number} [opts.count=1] - 片側あたりの弾数（V字の腕1本あたりの弾数）
 * @param {number} [opts.length=0] - 発生源からのオフセット距離（0なら発生源そのままの座標）
 * @param {*} [opts.custom=null] - コールバックに渡す任意データ
 * @returns {Array} rl - 生成された配置情報の配列
 * @example
 * vshape(ev => {
 *   bullet(ev.x, ev.y, ev.deg, 3, "cyan", "normal");
 * }, { x: entity.x, y: entity.y, baseDeg: 90, spreadDeg: 30, count: 5 });
 */
export function VSpawn(fn, { x = 0, y = 0, baseDeg = 90, spreadDeg = 30, count = 1, length = 0, custom = null, spacing = 60, moveDeg = null } = {}, rl = []) {
    const sides = [-1, 1];

    for (const side of sides) {
        for (let i = 0; i < count; i++) {
            let deg = normal(baseDeg + side * spreadDeg, -180, 180);
            const rad = dtr(deg);

            const dist = length + i * spacing;

            // moveDeg が指定されていればそちらを進行角度に、なければ deg をそのまま使う
            const moveRad = moveDeg !== null ? dtr(normal(moveDeg + side * spreadDeg, -180, 180)) : rad;

            const ev = {
                x: x + Math.cos(rad) * dist,
                y: y + Math.sin(rad) * dist,
                dx: Math.cos(rad) * dist,
                dy: Math.sin(rad) * dist,
                deg,
                rad,          // 配置用の角度
                moveRad,      // 進行方向用の角度（新規）
                dist,
                side: side < 0 ? "left" : "right",
                i,
                count,
                baseDeg,
                spreadDeg,
                custom,
                rl
            };

            rl.push(ev);
            fn(ev);
        }
    }

    return rl;
}
export function way(fn, {
    count = 1,
    x = 0,
    y = 0,
    length = 0,
    isEx = false,
    oneside = false,
    angle = 0,
    spreadDeg = 90,
    lock = null,
    rad = true,
    sx = 0,   // 追加: 1発ごとにxをずらす量
    sy = 0,   // 追加: 1発ごとにyをずらす量
    custom = null
} = {}, rl = []) {
    // radがtrueなら、angleとlockをラジアン→度数に変換して以降は度数で統一して扱う
    const angleDeg = rad ? angle * 180 / Math.PI : angle;
    const lockDeg = (lock !== null && rad) ? lock * 180 / Math.PI : lock;

    for (let i = 0; i < count; i++) {
        let deg;

        if (lockDeg !== null) {
            deg = normal(lockDeg, -180, 180);
        } else {
            let localT = count > 1 ? i / (count - 1) : 0.5;

            if (oneside === "left") {
                localT = count > 1 ? (i / (count - 1)) * 0.5 : 0;
            } else if (oneside === "right") {
                localT = count > 1 ? 0.5 + (i / (count - 1)) * 0.5 : 1;
            }

            let offsetT = localT - 0.5;

            if (isEx) {
                const sign = offsetT < 0 ? -1 : 1;
                const progress = i / Math.max(1, count - 1);
                const exFactor = Math.pow(Math.abs(offsetT) * 2, 1 + progress);
                offsetT = sign * exFactor * 0.5;
            }

            deg = normal(angleDeg + offsetT * spreadDeg, -180, 180);
        }

        const radVal = dtr(deg);

        // 発射元座標自体をi発目ごとにsx,syでずらす
        const originX = x + sx * i;
        const originY = y + sy * i;

        const ev = {
            i,
            count,
            angle: angleDeg,
            deg,
            rad: radVal,
            spreadDeg,
            isEx,
            oneside,
            lock: lockDeg,
            length,
            sx,
            sy,
            x: originX + Math.cos(radVal) * length,
            y: originY + Math.sin(radVal) * length,
            dx: Math.cos(radVal) * length,
            dy: Math.sin(radVal) * length,
            custom,
            rl
        };

        rl.push(ev);
        fn(ev);
    }

    return rl;
}
export function select(arr) {
    return arr[Math.floor(Math.random()*arr.length)]
}
export function corner(margin=50,offset=0) {
  return {
    topLeft:     { x: offset,     y: offset },
    topRight:    { x: canvas.w - offset, y: offset },
    bottomLeft:  { x: offset,     y: canvas.h - offset },
    bottomRight: { x: canvas.w - offset, y: canvas.h - offset }
  };
}
export function smoothFn(fn, {
target = 0,
f= 0,
custom=0,
} = {}, rl = []) {
const rf = Math.floor(f)
  const NowTarget = target / rf
for (let i = 0;i<rf;i++) {
    wait(() =>{
        const ev = {
            i,
target,
now:NowTarget*i,
def:target/rf,
custom,
v:NowTarget,
rf,
        };
        rl.push(ev);
        fn(ev);
    },i,true)
}
}
/**
 * スーパーフォーミュラ（Superformula）に基づいて配置し、コールバックを実行する
 * ジェラルド・シュペルパー(Johan Gielis)の一般化極座標式:
 * r(θ) = ( |cos(mθ/4)/a|^n2 + |sin(mθ/4)/b|^n3 )^(-1/n1)
 * m, n1, n2, n3 の組み合わせで、花びら・星・多角形・雪の結晶など多様な形状を再現できる
 *
 * @param {Function} fn - 各点で呼ばれるコールバック
 * @param {Object} opts
 * @param {number} [opts.x=0] - 発生源のX座標（この座標を基準にオフセットが加算される）
 * @param {number} [opts.y=0] - 発生源のY座標
 * @param {number} [opts.angle=0] - 全体の初期回転角（度数法。rad=trueならラジアン入力もOK）
 * @param {boolean} [opts.rad=false] - trueならangle/startDegをラジアンとして受け取る
 * @param {number} [opts.count=60] - 生成する点の数（一周を何分割するか）
 * @param {number} [opts.m=6] - 対称の数（花びら・凹凸の数を決める）
 * @param {number} [opts.n1=1] - 全体の丸み・尖り具合
 * @param {number} [opts.n2=1] - 片側の膨らみ具合
 * @param {number} [opts.n3=1] - もう片側の膨らみ具合
 * @param {number} [opts.a=1] - X方向のスケール係数
 * @param {number} [opts.b=1] - Y方向のスケール係数
 * @param {number} [opts.scale=100] - 半径全体にかける拡大率（見た目のサイズ調整用）
 * @param {number} [opts.startDeg=0] - 模様自体の回転オフセット（度）。angleとは別軸で重ね掛け可能
 * @param {number} [opts.turns=1] - 何周ぶん回すか（1なら360度、2なら720度など）
 * @param {*} [opts.custom=null] - コールバックに渡す任意データ
 * @returns {Array} rl - 生成された配置情報の配列
 * @example
 * formula(ev => {
 *   bullet({ angle: ev.rad, x: ev.x, y: ev.y, size: 16, type: "normal", color: "red", speed: 0, rd: 0.65 });
 * }, { count: 120, m: 6, n1: 0.3, n2: 1.7, n3: 1.7, scale: 50, x: Half.x, y: Half.y, angle: 90 });
 */
export function formula(fn, {
    x = 0,
    y = 0,
    angle = 0,
    rad = false,
    count = 60,
    m = 6,
    n1 = 1,
    n2 = 1,
    n3 = 1,
    a = 1,
    b = 1,
    scale = 100,
    startDeg = 0,
    turns = 1,
    custom = null
} = {}, rl = []) {
    // rad指定時はangle/startDegをラジアン→度数に統一変換
    const angleDeg = rad ? angle * 180 / Math.PI : angle;
    const startDegNorm = rad ? startDeg * 180 / Math.PI : startDeg;

    for (let i = 0; i < count; i++) {
        // 0〜(360*turns)度の範囲を count 分割し、initial angle と startDeg を両方加算
        const deg = normal((i / count) * 360 * turns + startDegNorm + angleDeg, -180, 180);
        const degRad = dtr(deg);

        // スーパーフォーミュラ本体：r(θ) の計算
        const t1 = Math.abs(Math.cos(m * degRad / 4) / a) ** n2;
        const t2 = Math.abs(Math.sin(m * degRad / 4) / b) ** n3;
        const r = (t1 + t2) ** (-1 / n1) * scale;

        const dx = Math.cos(degRad) * r;
        const dy = Math.sin(degRad) * r;

        const ev = {
            x: x + dx,
            y: y + dy,
            dx, dy,
            deg,
            rad: degRad,
            r,
            angle: angleDeg,
            startDeg: startDegNorm,
            count, m, n1, n2, n3, a, b, scale, turns,
            i,
            custom,
            rl
        };

        rl.push(ev);
        fn(ev);
    }

    return rl;
}
export function time(n=Infinity,v=stat.pfr,init=1) {
    return Math.floor(v) % Math.floor(n) === 0 || v === init || n === 0
}
export function setup(a) {
  a.prop.bool2 = false;
  a.prop.s = 0;
  a.prop.a = 0;
  a.prop.rng = { s: 999 };
  a.prop.bool = true;
a.bool = true;
a.cs = {a:0,b:0,c:0,d:0,e:0,f:0}
  a.prop.x = 0;
  a.prop.c = 0;
  a.prop.a2 = 0;
  const count = 100;
  const arr = Array(100).fill(0).map((e, i) => e = i * 15);
  const alphabet = [..."abcdefghijklmnopqrstuvwxyz"];
  const s = { spread: arr, name: alphabet.splice(0, arr.length) };
  a.seeds = Seed.multi(
      arr,
      true);
  a.prop.y = Half.y;
  gi(1);
}
export function look(b, x, y) {
    const dx = x - b.x;
    const dy = y - b.y;
    return Math.atan2(dy, dx);
}

