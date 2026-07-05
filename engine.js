import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half, Bullet, pf, CircleSpawn ,entitys,spelln,start
,internal,gps, updateGamepad} from './sys.js';
import {functions} from "./boss.js"
export function endless() {
const check = document.createElement('input');
check.id = "check";
check.type = "checkbox";
check.textContent = "エンドレスモード";
document.body.append(check)
}
const ondebug = false; // aa
let lastTime = performance.now();
let fps = 0;
export const sp = (num) => num * 60;
export const sd = (a, b = 1) => a % (60 * b) === 0;
export const fs = (m) => m / 60;
export const stat = {
pfr : 0,
entity : null,
nowspell : Infinity,
gameId : null
}
const rb = document.createElement('button');
rb.id = "btn";
rb.type = "button";
rb.textContent = "リトライ";

const cb = document.createElement('button');
cb.id = "btn";
cb.type = "button";
cb.textContent = "戻る";

function cbpush() { location.reload(); }

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
drawFps(ctx)
const fn = functions[spelln]
functions[spelln].run()
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



if (fn.time === fs(stat.pfr) && players[0].zanki > 0 && !check.checked) {
const miss = players[0].zanki
cancelAnimationFrame(stat.gameId); 
const txt = document.createElement("div");
const cv = document.getElementById("gameCanvas")
cv.remove()
txt.textContent = `クリアおめでとうございます！！\nミス数:${players[0].maxzanki -miss}\n\n\nクリア説明文:${fn.ct}`
    // 1. まずローカルストレージから全体のデータを安全に読み込む（なければ空オブジェクト）
    const allData = JSON.parse(localStorage.getItem("sd")) || {};
    
    // 2. 現在のスペル（spelln）のセーブデータを引っこ抜く（なければ初期値）
    const now = allData[spelln] ?? { gets: 0, amount: 0 };
    
    // 3. 今のスペルの gets だけを +1 する
    const updatedSpellData = { ...now, gets: now.gets + 1 };
    
    // 4. 【重要】全体オブジェクトの、このスペル番号の位置にデータを入れ直す！
    allData[spelln] = updatedSpellData;
    
    // 5. 最後に全体をシリアライズしてローカルストレージに保存
    localStorage.setItem("sd", JSON.stringify(allData));
    
cancelAnimationFrame(stat.gameId);
document.body.append(cb,rb)
cb.addEventListener("click", cbpush);
rb.addEventListener("click", rbpush);
document.body.append(txt,cb,rb)
return;
}

            players.forEach((p) => {
if (p.death && !check.checked) {

cancelAnimationFrame(stat.gameId);
cb.addEventListener("click", cbpush);
rb.addEventListener("click", rbpush);
document.body.append(cb,rb)
    return;
}
                p.update(Allkeys);
           // if (frame % 5 === 0) p.OnShot(false); // 通常
              //if (frame % 15 === 0) p.OnShot(true);  // ホーミング
                p.draw(ctx,ondebug);
            });

            // 敵・ボス処理
            for (let i = entitys.length - 1; i >= 0; i--) {
                const e = entitys[i];
                e.update();
                // スムーズな移動
                if (e.nx !== e.x) e.x += (e.nx - e.x) / e.speed;
                if (e.ny !== e.y) e.y += (e.ny - e.y) / e.speed;
                
                e.draw(ctx,true);
            }


    const grid = [
        [ [], [] ], // grid[0][0](左上), grid[0][1](左下)
        [ [], [] ]  // grid[1][0](右上), grid[1][1](右下)
    ];
    for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        
        b.update(); // 弾を移動させる（中での push は無くなったので安全！）
b.draw(ctx)
        // 画面外なら消去
        if (b.shouldRemove()) {
            bullets.splice(i, 1);
            continue;
        }

        // 💡 移動した後の最新座標で、部屋（grid）に1発ずつ仕分ける！
            const data = gps(b.x, b.y);
            if (data.w >= 0 && data.w < 2 && data.h >= 0 && data.h < 2) {
                grid[data.w][data.h].push(b); // ここで1回だけ登録される！
            }
    }
if (players[0]) {
        // player.hitTest の中身で `grid` を使って some() を回す
        players[0].hitTest(false,grid); 
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
stat.gameId = requestAnimationFrame(gameLoop)
}
export function nsnew(v) {stat.nowspell = v}
export function rpfr() {stat.pfr = 0}
export function setent(a) {stat.entity = a}

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
    ctx.fillText(`FPS: ${fps} (${Math.round(1000/fps)}ms)`, 10, 40);
    ctx.restore();
}

/**
 * サーバー上のファイルを更新する関数
 * ※ サーバー側にファイルが存在しないとエラーになります
 */
// engine.js
/**
 * @param {string} targetUrl - 送信先のURL (例: "http://192.168.0.7:8080/save")
 * @param {string} fileName - 保存するファイル名
 * @param {string} textContent - 保存したい内容
 */
export async function saveToDisk(targetUrl, fileName, textContent) {
    try {
        const res = await fetch(targetUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ filename: fileName, content: textContent })
        });

        if (!res.ok) throw new Error(`サーバーエラー: ${res.status}`);
        
        console.log("成功:", await res.text());
    } catch (e) {
        console.error("書き込み失敗:", e.message);
    }
}



