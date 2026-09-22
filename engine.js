import { Entity, Player } from "./chars.js";
import {
    canvas, ctx, players, bullets,
    updateFrame, frame, Half, entitys, spelln, start
    , internal, gps, updateGamepad,pbs
} from './sys.js';
import { functions } from "./boss.js"
import { bullet, Bullet } from "./bc.js"
import { cfg } from "./logs/cfg.js"
let y=0;
let my=0
const imgl = {
img1:new Image(),
img2:new Image(),
src1:"",
src2:""
}
const ondebug = false; // aa
let esc = false
let escPrev = false
export const opt = false; // 💡 true: 画面下部に「停止」ボタンを表示し、停止中に弾をタップするとその弾のデータを閲覧できる
let lastTime = performance.now();
let fps = 0;
export const sp = (num) => num * 60;
export const sd = (a, b = 1) => a % (60 * b) === 0;
export const fs = (m) => m / 60;
export const stat = {
    pfr: 0,
    entity: null,
    nowspell: Infinity,
    gameId: null,
    isChallenge:false,
    nowzanki:0,
    numbers:[],
    nownumber:0,
    maxz:0,
    ctxt:"",
    // 💡弾幕ラッシュ用追加フィールド
    ntxt:"",          // ラッシュのノーミスクリアテキスト
    timeQueue:[],      // numbersと対になる制限時間オーバーライド配列（nullなら各スペル本来のtimeを使う）
    timeOverride:null, // 現在実行中のスペルの制限時間オーバーライド（nullなら未指定）
    rushId:null,       // 実行中のラッシュのid（通常プレイ/旧チャレンジならnull）
    // 💡 弾インスペクタ(opt)用フィールド
    inspecting:false,      // true: 弾選択 or 弾データ表示中（=ゲームループ停止中）
    inspectSelected:null,  // 弾データ表示中に選ばれている弾（配列。複数候補ならスライド可能）
    inspectIndex:0,        // inspectSelected内での現在表示インデックス
    inspectHighlighted:null, // 弾選択モード中、タップでハイライトされている弾（まだ未確定）
    inspectCandidates:null,  // ハイライト対象を含む、タップ位置周辺の候補弾リスト（確定時にスライド候補として使う）
}
const rb = document.createElement('button');
rb.id = "btn";
rb.type = "button";
rb.textContent = "リトライ";

const cb = document.createElement('button');
cb.id = "btn";
cb.type = "button";
cb.textContent = "戻る";
const nb = document.createElement('button');
nb.id = "btn";
nb.type = "button";
nb.textContent = "次へ行く";
function cbpush() { location.reload(); }
function saveRushClear(id, clear, noMiss) {
    if (!id) return;
    let parsed = {};
    try {
        const raw = localStorage.getItem("rushClear");
        parsed = raw ? JSON.parse(raw) : {};
    } catch (e) {
        parsed = {};
    }
    const prev = parsed[id] || { clear: false, noMiss: false };
    parsed[id] = {
        clear: prev.clear || clear,
        noMiss: prev.noMiss || noMiss
    };
    localStorage.setItem("rushClear", JSON.stringify(parsed));
}

function nbpush() {
clearAllUI()
stat.nownumber = stat.nownumber+1
if (stat.nownumber === stat.numbers.length) {
const m = stat.maxz - stat.nowzanki
const noMiss = m === 0
     const txt = document.createElement("div");
if (noMiss && stat.ntxt) {
txt.textContent = " ラッシュ ノーミスクリアおめでとうございます！合計ミス数は、"+m+"です！ノーミスクリアテキスト:"+stat.ntxt
} else {
txt.textContent = " ラッシュクリアおめでとうございます！合計ミス数は、"+m+"です！クリアテキスト:"+stat.ctxt
}
saveRushClear(stat.rushId, true, noMiss)
       document.body.append(txt,cb)
        cb.addEventListener("click", cbpush);
} else {
const m = stat.maxz - stat.nowzanki

     const txt = document.createElement("div");
txt.textContent = " 現在の合計ミス数は、"+m+"です！"
       document.body.appendChild(txt)
const nn = stat.numbers[stat.nownumber] - 1
stat.timeOverride = stat.timeQueue[stat.nownumber] ?? null
clearAllUI()
start(nn)
}
}
function rbpush() {
    cancelAnimationFrame(stat.gameId);
    // 💡 ボタンが押された「今」、画面にあるキャンバスをピンポイントで取得する
    const activeCanvas = document.getElementById("gameCanvas");
    if (activeCanvas) {
        activeCanvas.remove(); // ⭕ これで確実に消えます
    }

    start(stat.nowspell);
    cb.remove();
    rb.remove();
    return;
}

cb.addEventListener("click", cbpush);
rb.addEventListener("click", rbpush);

// =====================================================================
// 💡 opt: 弾インスペクタ機能
//   ・画面下部に「停止」ボタンを設置
//   ・停止中はゲームループが止まり、canvas をタップすると近くの弾を選択
//   ・選んだ弾のプロパティ/関数を丸ごとテキスト化し、画面をそのテキストのみに切り替える
//   ・複数候補があればスライド（左右スワイプ）で切り替え
//   ・データ表示中にもう一度「停止」ボタンを押すと、弾選択モードに戻る
// =====================================================================
const stopBtn = document.createElement('button');
stopBtn.id = "stopBtn";
stopBtn.type = "button";
stopBtn.textContent = "停止";
stopBtn.style.position = "fixed";
stopBtn.style.left = "50%";
stopBtn.style.bottom = "16px";
stopBtn.style.transform = "translateX(-50%)";
stopBtn.style.zIndex = "9999";
stopBtn.style.padding = "10px 24px";
stopBtn.style.fontSize = "16px";

function ensureStopBtnMounted() {
    if (!document.body.contains(stopBtn)) {
        document.body.appendChild(stopBtn);
    }
}

function fnToText(fn) {
    if (typeof fn !== "function") return String(fn);
    try {
        return fn.toString();
    } catch (e) {
        return "[Function]";
    }
}

function valueToText(v, depth = 0) {
    if (typeof v === "function") return fnToText(v);
    if (v instanceof Map) {
        const lines = [];
        v.forEach((val, key) => {
            lines.push(`  [${key}] => ${valueToText(val, depth + 1)}`);
        });
        return "Map(" + v.size + ") {\n" + lines.join("\n") + "\n}";
    }
    if (Array.isArray(v)) {
        if (v.length === 0) return "[]";
        return "[\n" + v.map(item => "  " + valueToText(item, depth + 1).split("\n").join("\n  ")).join(",\n") + "\n]";
    }
    if (v && typeof v === "object") {
        try {
            return JSON.stringify(v);
        } catch (e) {
            return String(v);
        }
    }
    return String(v);
}

/**
 * 弾(Bulletインスタンス)の全プロパティ・関数（map/smapに積まれたsetlist/fnlist含む）を
 * テキスト化する。
 */
function bulletToText(b, idx, total) {
    const lines = [];
    lines.push(`=== 弾データ (${idx + 1}/${total}) ===`);
    const keys = Object.keys(b).sort();
    keys.forEach((k) => {
        const v = b[k];
        if (k === "angle" && typeof v === "number") {
            let deg = Math.round(v * 180 / Math.PI) % 360;
            if (deg > 180) deg -= 360;
            if (deg <= -180) deg += 360;
            lines.push(`${k}: ${deg}(${v})`);
        } else {
            lines.push(`${k}: ${valueToText(v)}`);
        }
    });

    // クラス側に定義されているメソッド（プロトタイプ関数）も見えるようにする
    lines.push("");
    lines.push("--- methods (prototype) ---");
    const proto = Object.getPrototypeOf(b);
    if (proto) {
        Object.getOwnPropertyNames(proto).forEach((name) => {
            if (name === "constructor") return;
            const fn = proto[name];
            if (typeof fn === "function") {
                lines.push(`${name}(): ${fnToText(fn)}`);
            }
        });
    }

    return lines.join("\n");
}

/**
 * データ表示画面を描画する（inspectSelected配列のinspectIndex番目を表示）
 */
function renderInspectData() {
    // 💡 gameCanvas は消さずに非表示にするだけ（後で通常プレイに戻すため）
    const activeCanvas = document.getElementById("gameCanvas");
    if (activeCanvas) activeCanvas.style.display = "none";
    const oldWrap = document.getElementById("bulletDataWrap");
    if (oldWrap) oldWrap.remove();
    const oldHint = document.getElementById("inspectHint");
    if (oldHint) oldHint.remove();
    const oldCounter = document.getElementById("inspectCounter");
    if (oldCounter) oldCounter.remove();

    const list = stat.inspectSelected || [];
    const total = list.length;
    const idx = Math.min(Math.max(stat.inspectIndex, 0), Math.max(total - 1, 0));
    stat.inspectIndex = idx;

    const wrap = document.createElement('div');
    wrap.id = "bulletDataWrap";
    wrap.style.position = "fixed";
    wrap.style.inset = "0";
    wrap.style.overflow = "auto";
    wrap.style.background = "#111";
    wrap.style.color = "#0f0";
    wrap.style.font = "12px/1.5 monospace";
    wrap.style.whiteSpace = "pre-wrap";
    wrap.style.wordBreak = "break-all";
    wrap.style.padding = "16px";
    wrap.style.paddingBottom = "80px";
    wrap.style.boxSizing = "border-box";
    wrap.style.touchAction = "pan-y";

    if (total === 0) {
        wrap.textContent = "選択された弾データがありません。";
    } else {
        wrap.textContent = bulletToText(list[idx], idx, total);
    }

    document.body.appendChild(wrap);
    ensureStopBtnMounted();

    // 💡 複数候補があるときはスワイプでスライド切り替え
    if (total > 1) {
        let touchStartX = null;
        wrap.addEventListener("touchstart", (e) => {
            touchStartX = e.touches[0].clientX;
        }, { passive: true });
        wrap.addEventListener("touchend", (e) => {
            if (touchStartX === null) return;
            const dx = e.changedTouches[0].clientX - touchStartX;
            touchStartX = null;
            const threshold = 40;
            if (dx > threshold) {
                stat.inspectIndex = (idx - 1 + total) % total;
                renderInspectData();
            } else if (dx < -threshold) {
                stat.inspectIndex = (idx + 1) % total;
                renderInspectData();
            }
        }, { passive: true });

        // マウス操作でもスライドできるように（PC確認用）
        wrap.addEventListener("click", (e) => {
            const rect = wrap.getBoundingClientRect();
            const half = rect.left + rect.width / 2;
            if (e.clientX < half) {
                stat.inspectIndex = (idx - 1 + total) % total;
            } else {
                stat.inspectIndex = (idx + 1) % total;
            }
            renderInspectData();
        });

        const counter = document.createElement('div');
        counter.id = "inspectCounter";
        counter.style.position = "fixed";
        counter.style.top = "8px";
        counter.style.right = "12px";
        counter.style.color = "#0f0";
        counter.style.font = "12px monospace";
        counter.style.zIndex = "9999";
        counter.textContent = `${idx + 1} / ${total} （スワイプで切替）`;
        document.body.appendChild(counter);
    }
}

/**
 * canvas上のクリック/タップ位置(仮想座標)を計算する
 */
function getVirtualPointFromEvent(e, targetCanvas) {
    const rect = targetCanvas.getBoundingClientRect();
    const clientX = (e.touches && e.touches[0]) ? e.touches[0].clientX : e.clientX;
    const clientY = (e.touches && e.touches[0]) ? e.touches[0].clientY : e.clientY;
    const cx = clientX - rect.left;
    const cy = clientY - rect.top;
    const scaleX = targetCanvas.w / rect.width;
    const scaleY = targetCanvas.h / rect.height;
    return { x: cx * scaleX, y: cy * scaleY };
}

/**
 * 弾選択モード中、ハイライト中の弾を白い輪で強調表示し続けるための描画ループ。
 * ゲーム本体のループ(requestAnimationFrame(gameLoop))は停止中なので、専用に軽く回す。
 */
let highlightLoopId = null;
function highlightDrawLoop() {
    if (!stat.inspecting || stat.inspectSelected) {
        // 選択モードを抜けた/データ表示に移った場合はここで終了
        highlightLoopId = null;
        return;
    }
    const activeCanvas = document.getElementById("gameCanvas");
    if (activeCanvas && ctx) {
        ctx.clearRect(0, 0, activeCanvas.w, activeCanvas.h);
        // 背景の代わりに、直近の静止フレームを保つため再描画はせず弾のみ描き直す
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (cfg && !b.active) continue;
            b.draw(ctx, false);
        }
        if (stat.inspectHighlighted) {
            const hb = stat.inspectHighlighted;
            ctx.save();
            ctx.strokeStyle = "#ffffff";
            ctx.lineWidth = 3;
            ctx.beginPath();
            const r = (hb.radius || Math.max(hb.w, hb.h) / 2 || 12) + 6;
            ctx.arc(hb.x, hb.y, r, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
        }
    }
    highlightLoopId = requestAnimationFrame(highlightDrawLoop);
}
function startHighlightLoop() {
    if (highlightLoopId === null) {
        highlightLoopId = requestAnimationFrame(highlightDrawLoop);
    }
}
function stopHighlightLoop() {
    if (highlightLoopId !== null) {
        cancelAnimationFrame(highlightLoopId);
        highlightLoopId = null;
    }
}

/**
 * 弾選択モード：canvas をタップした位置に近い弾を白くハイライトする（確定はしない）。
 * データ表示への遷移は、この状態でもう一度「停止」ボタンが押された時に行う。
 */
function onCanvasInspectPick(e) {
    e.preventDefault();
    const activeCanvas = document.getElementById("gameCanvas");
    if (!activeCanvas) return;

    const p = getVirtualPointFromEvent(e, activeCanvas);
    const PICK_RADIUS = 30; // 仮想座標系でのタップ許容半径

    const candidates = bullets
        .filter(b => (cfg ? b.active : true))
        .map(b => {
            const dx = b.x - p.x;
            const dy = b.y - p.y;
            return { b, dist: Math.sqrt(dx * dx + dy * dy) };
        })
        .filter(c => c.dist <= PICK_RADIUS)
        .sort((a, c) => a.dist - c.dist)
        .map(c => c.b);

    if (candidates.length === 0) return; // 何もヒットしなければ何もしない

    // 💡 まだデータ表示はしない。白ハイライトの候補として保持するだけ。
    stat.inspectCandidates = candidates;
    stat.inspectHighlighted = candidates[0];
}

/**
 * 弾選択モードの画面を用意する（canvasはそのまま残し、案内テキストとタップ判定を付ける）
 */
function enterBulletSelectMode() {
    const activeCanvas = document.getElementById("gameCanvas");
    if (activeCanvas) activeCanvas.style.display = "";
    ensureStopBtnMounted();
    stat.inspectHighlighted = null;
    stat.inspectCandidates = null;
    startHighlightLoop();

    // 既にある案内テキストは一旦消してから作り直す
    const oldHint = document.getElementById("inspectHint");
    if (oldHint) oldHint.remove();

    const hint = document.createElement('div');
    hint.id = "inspectHint";
    hint.style.position = "fixed";
    hint.style.top = "8px";
    hint.style.left = "50%";
    hint.style.transform = "translateX(-50%)";
    hint.style.color = "#fff";
    hint.style.background = "rgba(0,0,0,0.6)";
    hint.style.padding = "6px 12px";
    hint.style.borderRadius = "6px";
    hint.style.font = "13px sans-serif";
    hint.style.zIndex = "9999";
    hint.textContent = "弾をタップして選択してください";
    document.body.appendChild(hint);

    if (activeCanvas) {
        activeCanvas.addEventListener("click", onCanvasInspectPick);
        activeCanvas.addEventListener("touchstart", onCanvasInspectPick, { passive: false });
    }
}

function exitBulletSelectMode() {
    stopHighlightLoop();
    const activeCanvas = document.getElementById("gameCanvas");
    if (activeCanvas) {
        activeCanvas.removeEventListener("click", onCanvasInspectPick);
        activeCanvas.removeEventListener("touchstart", onCanvasInspectPick);
    }
    const oldHint = document.getElementById("inspectHint");
    if (oldHint) oldHint.remove();
}

function stopBtnPush() {
    if (!stat.inspecting) {
        // 通常プレイ中 → 停止して弾選択モードへ
        stat.inspecting = true;
        stat.inspectSelected = null;
        stat.inspectIndex = 0;
        cancelAnimationFrame(stat.gameId);
        enterBulletSelectMode();
    } else if (stat.inspectSelected) {
        // 弾データ表示中 → もう一度押されたら弾選択モードに戻る
        const oldWrap = document.getElementById("bulletDataWrap");
        if (oldWrap) oldWrap.remove();
        const oldCounter = document.getElementById("inspectCounter");
        if (oldCounter) oldCounter.remove();
        stat.inspectSelected = null;
        stat.inspectIndex = 0;
        enterBulletSelectMode();
    } else if (stat.inspectHighlighted) {
        // 弾選択モード中で、白ハイライト中の弾がある → 確定してデータ表示へ
        stopHighlightLoop();
        exitBulletSelectMode();
        stat.inspectSelected = stat.inspectCandidates && stat.inspectCandidates.length
            ? stat.inspectCandidates
            : [stat.inspectHighlighted];
        stat.inspectIndex = 0;
        renderInspectData();
    } else {
        // 弾選択モード中で、何もハイライトされていない → 通常プレイに戻す
        stat.inspecting = false;
        exitBulletSelectMode();
        const activeCanvas = document.getElementById("gameCanvas");
        if (activeCanvas) activeCanvas.style.display = "";
        stat.gameId = requestAnimationFrame(gameLoop);
    }
}
stopBtn.addEventListener("click", stopBtnPush);

export function gameLoop() {
    if (opt) ensureStopBtnMounted();
    updateGamepad();
    /*
    if (stat.pfr % 60 === 0)saveToDisk(
      "http://127.0.0.1:8080/log",  // ← これ
      "log.txt",
      `FPS: ${fps} | ${new Date().toLocaleTimeString()}\n`
    )
    */
    updateDeltaFps()

if (window.Allkeys.Escape && !escPrev) {
    esc = !esc;
}
escPrev = !!window.Allkeys.Escape; // 現在の状態を保存

// ポーズ判定
const pause = players[0].death || esc;


    if (!pause)stat.pfr += 1
    ctx.clearRect(0, 0, canvas.w, canvas.h);
    const fn = functions[spelln]
    functions[spelln].run()
if (fn.img) {
    const bgPath = "./assets/bg/" + fn.img;
    const maskPath = fn.mask ? "./assets/bg/" + fn.mask : "./assets/bg/flame.png";

    // パスが変わった時だけ src をセット
    if (imgl.src1 !== bgPath) {
        imgl.src1 = bgPath;
        imgl.img1.src = bgPath;
    }
    if (imgl.src2 !== maskPath) {
        imgl.src2 = maskPath;
        imgl.img2.src = maskPath;
    }

    const speed = fn.imgSpeed ?? 3;
    if(!pause)y += speed;
    if (y >= canvas.h) y = 0;

    ctx.clearRect(0, 0, canvas.w, canvas.h);

    // 背景を流す
    if (imgl.img1.complete && imgl.img1.naturalWidth > 0) {
        ctx.globalAlpha = fn.imgAlpha ?? 0.25;
        ctx.drawImage(imgl.img1, 0, y, canvas.w, canvas.h);
        ctx.drawImage(imgl.img1, 0, y - canvas.h, canvas.w, canvas.h);
    }

    // マスクも同じように流す（速度・向きを変えたい場合は別途 my を用意）
const mys = fn.maskSpeed ?? 0
if(!pause)my += mys
    if (imgl.img2.complete && imgl.img2.naturalWidth > 0) {
        ctx.globalAlpha = fn.maskAlpha ?? 0.5;
        ctx.drawImage(imgl.img2, 0, my, canvas.w, canvas.h);
        ctx.drawImage(imgl.img2, 0, my - canvas.h, canvas.w, canvas.h);
    }

    ctx.globalAlpha = 1.0;

    // 全体を暗くするオーバーレイ
    ctx.fillStyle = 'rgba(10, 10, 20, 0.7)';
    ctx.fillRect(0, 0, canvas.w, canvas.h);
}



    const effectiveTime = (stat.isChallenge && stat.timeOverride !== null && stat.timeOverride !== undefined)
        ? stat.timeOverride
        : fn.time;
    if (effectiveTime === fs(stat.pfr) && players[0].zanki > 0) {
clearAllUI()
        const miss = players[0].zanki
stat.nowzanki = miss
const m = stat.maxz - stat.nowzanki
     const ntxt = document.createElement("div");
ntxt.textContent = " 現在の合計ミス数は、"+m+"です！"
    if (stat.isChallenge) document.body.appendChild(ntxt)
        cancelAnimationFrame(stat.gameId);
        const txt = document.createElement("div");
        const cv = document.getElementById("gameCanvas")
        const missAmount = players[0].maxzanki - miss
        let text = `クリアおめでとうございます！！\nミス数:${players[0].maxzanki - miss}\n\n\nクリア説明文:${fn.ct}`
        if (missAmount === 0) {
            text = `ノーミスクリアおめでとうございます！ノーミスクリア説明文:${fn.nm}`
        }

        txt.textContent = text
        if (!stat.isChallenge) {
        const allData = JSON.parse(localStorage.getItem("sd")) || {};
        console.log("ミス数", missAmount)
        const bool = missAmount === 0
        console.log(bool)
        // 2. 現在のスペル（spelln）のセーブデータを引っこ抜く（なければ初期値）
        const now = allData[spelln] ?? { gets: 0, amount: 0, nm: false };
        const nowNM = now.nm ? true : bool
        console.log("nnm", nowNM)
        // 3. 今のスペルの gets だけを +1 する
        const updatedSpellData = { ...now, gets: now.gets + 1, nm: nowNM };

        // 4. 【重要】全体オブジェクトの、このスペル番号の位置にデータを入れ直す！
        allData[spelln] = updatedSpellData;

        // 5. 最後に全体をシリアライズしてローカルストレージに保存
        localStorage.setItem("sd", JSON.stringify(allData));
        }

        cancelAnimationFrame(stat.gameId);
//リトライ系
if (!stat.isChallenge) {
if (window.Allkeys.r || window.Allkeys.Enter) rbpush()
        document.body.append(cb, rb)
        cb.addEventListener("click", cbpush);
        rb.addEventListener("click", rbpush);
        document.body.append(txt, cb, rb)
} else {
        document.body.appendChild(nb)
        nb.addEventListener("click", nbpush)
}
        return;
    }
if (pause&&window.Allkeys.r || pause&&window.Allkeys.Enter) {rbpush()
    escPrev=false;
esc=false
pause=false
}
    players.forEach((p) => {
        if (p.death) {
            cancelAnimationFrame(stat.gameId);
            cb.addEventListener("click", cbpush);
            rb.addEventListener("click", rbpush);
        if (stat.isChallenge) document.body.appendChild(cb)
        if (!stat.isChallenge) {
document.body.append(cb, rb)
if (window.Allkeys.r || window.Allkeys.Enter) rbpush()
if (window.Allkeys.Escape || window.Allkeys.c) cbpush()
            return;
        }}
      if(!pause)  p.update();
      //  if (frame % 5 === 0) p.OnShot(false); // 通常
     //   if (frame % 15 === 0) p.OnShot(true);  // ホーミング
        p.draw(ctx, ondebug);
    });

    // 敵・ボス処理
    for (let i = entitys.length - 1; i >= 0; i--) {
        const e = entitys[i];
      if (!pause)  e.update();

        e.draw(ctx, true);
e.hitTests()
if (e.hp <= 0) {
                entitys.splice(i, 1);
                continue;
}
    }


    const grid = [
        [[], []], // grid[0][0](左上), grid[0][1](左下)
        [[], []]  // grid[1][0](右上), grid[1][1](右下)
    ];

    // 💡 cfg で弾の更新・削除方式を切り替える
if (stat.pfr % 60 === 0) console.log(bullets.length)
    if (cfg) {
        // --- オブジェクトプール方式 ---
        // active な弾のみ更新・描画。削除対象なら releaseToPool() で明示的に swap-pop → spaceb へ返却。
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            if (!b.active) continue;

            if (b.shouldRemove()) {
                b.releaseToPool();
                continue;
            }
        if (!pause)        b.update();
            b.draw(ctx,ondebug);
            registerBulletToGrid(b, grid);
        }
    } else {
        // --- 通常方式 ---
        // 毎回 update → draw → shouldRemove で splice 削除。
        for (let i = bullets.length - 1; i >= 0; i--) {
            const b = bullets[i];
            b.update();
            b.draw(ctx);

            if (b.shouldRemove()) {
                bullets.splice(i, 1);
                continue;
            }
            registerBulletToGrid(b, grid);
        }
    }
    if (players[0]) {
        // player.hitTest の中身で `grid` を使って some() を回す
        players[0].hitTest(false, grid);
    }
    // ⚠️ boss.js の gameLoop() の最後にこれがないため、ループが1フレーム目で停止しています
    updateFrame();
    // 💡 安全な wait タスクの更新処理（存在するときだけ実行し、return で止めない）
    if (globalThis._waitTasks && globalThis._waitTasks.size > 0) {
        for (const [id, task] of globalThis._waitTasks.entries()) {
            // 条件を満たして callback が実行されたら（trueが返ってきたら）
            if (task.execute()) {
                globalThis._waitTasks.delete(id); // ➔ その場でピンポイント削除！
            }
        }
    }
        for (let i = pbs.length - 1; i >= 0; i--) {
            const b = pbs[i];
            b.update();
            b.drawI(ctx);
            if (b.shouldRemove()) {
                pbs.splice(i, 1);
                continue;
            }}
    drawFps(ctx)
    const displayTime = (stat.isChallenge && stat.timeOverride !== null && stat.timeOverride !== undefined)
        ? stat.timeOverride
        : fn.time;
    const timeLeft = fs(stat.pfr) >= displayTime ? 0 : displayTime - fs(stat.pfr);
    ctx.fillStyle = timeLeft <= 3 ? "red" : "#E0F7FA";   // 3秒以下で赤文字にする

    // 💡 フォントを読み込んだドット絵フォントに変更！
    ctx.font = "18px 'Press Start 2P'";   // 18px〜20pxくらいがちょうどいいサイズ感です

    ctx.textAlign = "right";
    ctx.textBaseline = "top";

    const textX = canvas.w - 10;
    const textY = 10;

    ctx.fillText(timeLeft.toFixed(1), textX, textY); // 右上にドット絵で綺麗に描画
    ctx.textAlign = "left"; // お作法：左寄せに戻しておく


    // ⚠️ 【お作法】他の場所で描画するテキスト（左寄せなど）がバグらないように、
    // textAlign をデフォルトの左寄せに戻しておくのが安全です。
    ctx.textAlign = "left";
if (window.Allkeys.Escape && window.Allkeys.c) cbpush()
    stat.gameId = requestAnimationFrame(gameLoop)
}

/**
 * 弾をヒット判定用グリッドへ登録する共通処理（プール方式・通常方式で共有）
 */
function registerBulletToGrid(b, grid) {
    if (b.type === "laser") {
        // レーザーは始点から終点まで一定間隔でサンプリングして、通過する全マスに登録する
        const length = b.h;
        const steps = Math.ceil(length / 20); // 20px間隔でサンプリング(粗すぎず細かすぎず)
        const dirX = Math.cos(b.angle);
        const dirY = Math.sin(b.angle);
        const registered = new Set();

        for (let s = 0; s <= steps; s++) {
            const t = (length / steps) * s;
            const px = b.x + dirX * t;
            const py = b.y + dirY * t;
            const data = gps(px, py);
            const key = `${data.w},${data.h}`;
            if (data.w >= 0 && data.w < 2 && data.h >= 0 && data.h < 2 && !registered.has(key)) {
                grid[data.w][data.h].push(b);
                registered.add(key);
            }
        }
    } else {
        const r = b.radius || 0;
        const points = [
            [b.x, b.y],
            [b.x - r, b.y], [b.x + r, b.y],
            [b.x, b.y - r], [b.x, b.y + r],
        ];
        const registered = new Set();
        for (const [px, py] of points) {
            const data = gps(px, py);
            const key = `${data.w},${data.h}`;
            if (data.w >= 0 && data.w < 2 && data.h >= 0 && data.h < 2 && !registered.has(key)) {
                grid[data.w][data.h].push(b);
                registered.add(key);
            }
        }
    }
}
export function nsnew(v) { stat.nowspell = v }
export function rpfr() { stat.pfr = 0 }
export function setent(a) { stat.entity = a }

// 毎フレーム呼ぶ
export function updateDeltaFps() {
    const now = performance.now();
    const deltaTime = now - lastTime;
    lastTime = now;

    // デルタタイムからFPSを算出 (1000ms / deltaTime)
    // 数値が跳ねるのを防ぐため、少し平均化する（0.1の重み付け）
    const currentFps = 1000 / deltaTime;
    fps = Math.round(fps * 0.9 + currentFps * 0.1);
}

// 描画用
export function drawFps(ctx) {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "Red"; // デルタ計測版は色を変えてもいいかも
    ctx.font = "16px monospace";
    ctx.fillText(`FPS: ${fps} (${Math.round(1000 / fps)}ms)`, 10, 40);
    ctx.restore();
}

export function cf() {
clearMainUI()
    const dat = {
        zan:5,
number:[30,3,2],
ctxt:"あ"
    }
stat.nowzanki = dat.zan;
stat.maxz = dat.zan;
stat.numbers = dat.number;
stat.nownumber = 0;
stat.timeQueue = [];
stat.timeOverride = null;
stat.ntxt = "";
stat.rushId = null;
const n = (dat.number[0] -1)
console.log(n)
stat.ctxt = dat.ctxt
stat.isChallenge = true;
start(n)
}
// 💡セレクタベースでメインUI（index.html由来の要素）を一括削除する関数
export function clearMainUI() {
    const selectors = [
        "#mainUiWrap",
        "#div",
        "#btn",          // 「遊ぶ」ボタン（同idの rb/cb/nb も一緒に消える点に注意）
        "#id",           // sp（スペル詳細プレビュー）
        "#topImages",
        "#spellListOverlay",
        "#latestBtn",
        "#randomBtn",
        "#customBtn",
    ];

    selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.remove());
    });
}
// 💡idやセレクタを一切無視して、body直下の要素を問答無用で全部消す
export function clearAllUI() {
    document.body.innerHTML = "";
}

// 💡上とほぼ同じだが、ゲーム用canvasだけは巻き込まないようにしたい場合用
export function clearAllUIExceptCanvas() {
    Array.from(document.body.children).forEach(el => {
        if (el.id !== "gameCanvas") el.remove();
    });
}