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
function nbpush() {
clearAllUI()
stat.nownumber = stat.nownumber+1
if (stat.nownumber === stat.numbers.length) {
const m = stat.maxz - stat.nowzanki
     const txt = document.createElement("div");
txt.textContent = " チャレンジクリアおめでとうございます！合計ミス数は、"+m+"です！クリアテキスト:"+stat.ctxt
       document.body.append(txt,cb)
        cb.addEventListener("click", cbpush);
} else {
const m = stat.maxz - stat.nowzanki

     const txt = document.createElement("div");
txt.textContent = " 現在の合計ミス数は、"+m+"です！"
       document.body.appendChild(txt)
const nn = stat.numbers[stat.nownumber] - 1
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


export function gameLoop() {
    updateGamepad();
    /*
    if (stat.pfr % 60 === 0)saveToDisk(
      "http://127.0.0.1:8080/log",  // ← これ
      "log.txt",
      `FPS: ${fps} | ${new Date().toLocaleTimeString()}\n`
    )
    */
    updateDeltaFps()

    stat.pfr += 1
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
    y += speed;
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
my += mys
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
    const timeLeft = fs(stat.pfr) >= fn.time ? 0 : fn.time - fs(stat.pfr);
    ctx.fillStyle = timeLeft <= 3 ? "red" : "white";   // 3秒以下で赤文字にする

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



    if (fn.time === fs(stat.pfr) && players[0].zanki > 0) {
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

        cancelAnimationFrame(stat.gameId);
if (!stat.isChallenge) {
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

    players.forEach((p) => {
        if (p.death) {
            cancelAnimationFrame(stat.gameId);
            cb.addEventListener("click", cbpush);
            rb.addEventListener("click", rbpush);
        if (stat.isChallenge) document.body.appendChild(cb)
        if (!stat.isChallenge) document.body.append(cb, rb)
            return;
        }
        p.update();
      //  if (frame % 5 === 0) p.OnShot(false); // 通常
     //   if (frame % 15 === 0) p.OnShot(true);  // ホーミング
        p.draw(ctx, ondebug);
    });

    // 敵・ボス処理
    for (let i = entitys.length - 1; i >= 0; i--) {
        const e = entitys[i];
        e.update();
        // スムーズな移動
        if (e.nx !== e.x) e.x += (e.nx - e.x) / e.speed;
        if (e.ny !== e.y) e.y += (e.ny - e.y) / e.speed;

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
            b.update();
            b.draw(ctx);
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