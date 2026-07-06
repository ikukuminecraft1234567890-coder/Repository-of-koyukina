import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half, Bullet, pf, CircleSpawn ,entitys,spelln,start
,CC,internal,bullet} from './sys.js';
import {stat,gameLoop} from "./engine.js"
/**
 * 指定したフレーム数またはミリ秒が経過した後に、一度だけ関数を実行する
 * @param {Function} callback - 実行したい関数
 * @param {number} time - 待機する時間（フレーム数またはミリ秒）
 * @param {boolean} [isFrame=true] - trueならフレーム換算、falseならミリ秒換算
 */
// ❌ 修正前: const dtr = (deg) => (deg * Math.PI) 
// ⭕ 修正後: 度数(degree)をラジアン(radian)に正しく変換する
const dtr = (deg) => (deg * Math.PI) / 180;

// タスクごとに一意のIDを割り振るためのカウンター
let nextTaskId = 0;

function wait(callback, time, isFrame = true) {
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

 function random(min, max) {
            return Math.random() * (max - min) + min;
        }

// 💡 変数っぽく書くだけで自動的に裏の stat を読み書きする魔法の定義
Object.defineProperties(globalThis, {
    pfr: { 
        get() { return stat.pfr; }, 
        set(v) { stat.pfr = v; } 
    },
    entity: { 
        get() { return stat.entity; }, 
        set(v) { stat.entity = v; } 
    },
    gameId: { 
        get() { return stat.gameId; }, 
        set(v) { stat.gameId = v; } 
    }
});
const fr = (i) => pfr % i === 0
const ondebug = true;
const sp = (num) => num * 60;
const sd = (a, b = 1) => a % (60 * b) === 0;
const fs = (m) => m / 60;
const itraw = (a,b,c) => a >= b && a <= c
const it = (t) => (min, max) => t >= min && t <= max;
/**
 * スペルカード開始時のゲーム状態をリセット・初期化する共通関数
 * @param {number} [playerSize=1] - プレイヤーの当たり判定サイズ
 * @param {string} [bossName="ボス"] - ボスの名前
 * @param {Array<string>} [bulletTypes=[]] - 事前にCC（カラーキャッシュ？）登録したい弾種と色の設定
 * @example
 * // 使い方
 * gameInit(0.5, "ボス", [ {type: "gummy", colors: this.list} ]);
 */
async function gi(playerSize = 1,bulletTypes = [],it = 120,zanki) {
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
            await CC(config.type, config.colors);
        }
    }
    
    // 5. ゲームループの開始
    gameId = requestAnimationFrame(gameLoop);
}

function normal(v, n1, n2) {
    const min = Math.min(n1, n2);
    const max = Math.max(n1, n2);
    const range = max - min; // 角度の場合、通常は「+1」しない（360°と0°が同値のため）
    
    return (((v - min) % range + range) % range) + min;
}


function circle(fn,{count=18,startDeg=0,custom=null,step = "a"}) {
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
const ev = {count,step:astep,startDeg,i,deg,custom}
fn(ev)
}}




//バラマキ高速
export const functions = []
const spell1 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"獄界剣「二百里の一閃｣",
desc:"",
hint:"ランダム0なので位置を覚えるといいかも？",
ct:"384x448環境に移行してから作った初のスペルカード！🤩地味にランダム要素0です。",
list:[],
//自機狙い弾
prop:0,
init() {
this.prop=0,
gi(1)
},
time:30,
run() {
if (pfr % 120 === 0) {
this.prop+=3
const speed = Math.max(1.25,this.prop / 10)
for (let i = 0;i<canvas.w;i+=9) {
const di = i - canvas.w / 2
const angle = normal(this.prop,0,90)
bullet({
    speed: speed, // スピード5
    color:"8827B0", 
    w: 24, 
    h: 24, 
    type: "scale",
    y: Half.y,
    x: i,
    angle: -dtr((di)+angle+(90)),
})

bullet({
    speed: speed, // スピード5
    color:"22B200", 
    w: 24, 
    h: 24, 
    type: "scale",
    y: Half.y,
    x: i,
    angle: dtr((di)+angle+(90)),
})

}
}}}
functions.push(spell1)
const spell2 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"フラッシュオブボーダー",
desc:"無敵時間使ってボーダー外に逃げるのはやめてね",
hint:"",
ct:"自作です。紺珠伝見てないんで！割と初期配置ゲーだったりするw",
list:[],
//自機狙い弾
prop:true,
init() {
this.prop=true,
gi(1)
},
time:30,
run() {
if (this.prop) {
this.prop = false
for (let i = 0;i<600;i++) {
wait(() => {
const x = Math.floor(Math.random() * canvas.w)
const y = Math.floor(Math.random() * canvas.h)
bullet({
    speed:0, // スピード5
    color:"8827B0", 
    w: 8, 
    h: 8, 
    type: "normal",
    y: y,
    x: x,
    angle: 360,
})

},i/10)
}
for (let i = -200; i < 200; i += 4) { // 密度を4pxおきにして数を1/4に軽量化
const stat = {s:1,a:dtr(-90)}
            bullet({ 
                x: entity.x + i, 
                y: canvas.h, 
                angle: -stat.a, 
                speed: 0, 
                color:"#FF144A",
                w: 16, 
                h: 8, 
                type: "normal", 
                deleteFrame:9999, 
setlist:[{f:120,e:stat.s}],
fnlist:[{f:0,loop:true,fn:function(){
    if (this.y === 90) {this.angle= -this.angle}
    if (this.y === canvas.h) {this.angle= -this.angle}
}}]
            });  
        bullet({ 
                x: entity.x + i, 
                y: canvas.h-90, 
                angle: -stat.a, 
                speed: 0, 
                color:"#FF144A",
                w: 16, 
                h: 8, 
                type: "normal", 
                deleteFrame:9999,
setlist:[{f:120,e:stat.s}],
fnlist:[{f:0,loop:true,fn:function(){
    if (this.y === 0) {this.angle= -this.angle}
    if (this.y === canvas.h-90) {this.angle= -this.angle}
}}]
            });  
        }
}
    
}}
functions.push(spell2)
const spell3 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"筒粥「神の粥」",
desc:"",
hint:"",
ct:"めっちゃ神奈子っぽい弾幕w名前はそのまま神奈子の流用\n実は自機狙い後の形が人みたいになってるのは意図してない。理想は丸い状態だったんすけどね()まあいい感じになったんで....",
list:[],
//自機狙い弾
prop:{s:true,a:true},
init() {
this.prop.s=true,this.prop.a=true
gi(1)
},
time:30,
run() {
if (pfr % 30 === 0) {
this.prop.s = !this.prop.s
const slow = this.prop.s ? 3 : 1.5
for (let amount = 0;amount<6;amount++) {
const initAngle = amount % 2 === 0 ? -60 : -120
for (let i = -7;i<7;i++) {
const tempo = amount < 3 ? amount * 30 : 30 + amount * 12
const count = 13
const radius = 15
const centerX = Half.x;
            const centerY = Half.y;
const placementDeg = (360 / count) * i;
                const placementRad = dtr(placementDeg);
                
                // 2. 円の形になるように初期座標を計算
                const x = centerX + Math.cos(placementRad) * radius;
                const y = centerY + Math.sin(placementRad) * radius;
wait(() => {bullet({
    speed:10, // スピード5
    color:"8827B0", 
    w: 8, 
    h: 8, 
    type: "normal",
    y: y,
    x: x,
    angle: dtr(initAngle),
custom:{i,slow},
setlist:[{f:5,e:slow}],
fnlist:[{f:60,fn:function(){
if (this.custom.slow)this.angle = pf(this.x,this.y) + dtr(this.custom.i * 0.4)
    if (!this.custom.slow)this.angle = pf(this.x,this.y) + dtr(this.custom.i * 3)
}}]
})
},tempo)
}}}

if (pfr % 30 === 0) {
this.prop.a = !this.prop.a
const color = this.prop.a ? "2730B0" : "B08327"
const count = 18
const step = 360 / count;
const startDeg = this.prop.a ? 0 : 5
    for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * step; 
        
        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;
        
        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }
bullet({
    speed:10, // スピード5
    color:color, 
    w: 8, 
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(deg+this.prop.a),
setlist:[{f:5,e:3}],
})
}     
}}}
functions.push(spell3)
const spell4 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
desc:"バグってるので次回作成",
hint:"",
ct:"",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:true},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=true
gi(1)
},
time:60,
run() {
const speed = 1;
// 💡 720個の弾を speed の速さで割り切るフレーム数にする
const waitTime = Math.ceil(720 / this.speed);
if (this.prop.a) {
    this.prop.a = !this.prop.a

this.speed += 0.5
circle((ev) =>{
wait(() => {bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg + 180)
})
bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg)
})
bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg + 90)
})
bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg - 90)
})
    
},ev.i / this.speed)
},{count:720,startDeg:0})

}
if (pfr % waitTime + 10 === 0) {
this.speed += 0.15
circle((ev) =>{
wait(() => {bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg + 180)
})
bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg)
})
bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg + 90)
})
bullet({
    speed:7.5, // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg - 90)
})
    
},ev.i / this.speed)
},{count:720,startDeg:0})
}}}
functions.push(spell4)

const spell5 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"不滅「フェニックスの羽」",
desc:"",
hint:"",
ct:"そのまま妹紅のスペルの再現しようとしたけど上手く形が作れなかったのでそのまま方向性を変換したスペル。なんだかんだ気合い避けスペルがいちばん楽しい🤨",
speed:1,
list:[],
amount:15,
//自機狙い弾
prop:{s:true,a:true},
init() {
this.amount=0;
this.speed = 1
this.prop.s=true,this.prop.a=true
gi(1)
},
time:60,
run() {
if (pfr % 30 === 0) console.log(bullets.length)
const cycle = pfr % 300
if (cycle % 15 === 0) {
this.amount += 0.15
for (let i = 0;i<this.amount;i++)bullet({
    speed:random(1.5,6), // スピード5
    color:"0D62FF", 
    w: 16,
    h: 16, 
    type: "amulet",
    y: 0,
    x: Half.x,
    angle: dtr(random(0,180))
})
}}}
functions.push(spell5)
const spell6 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"藤原「滅罪寺院傷」",
desc:"",
hint:"",
ct:"初期の耐久時間は60s(！？)、どんどん密度が上がっていくのでめっちゃムズいです。個人的には気に入ってるけど難易度としては苦手() ここだけの話、上のチェックボックスをオンにするとクリアが無効化されてそのままずっとスペルが続く(死亡判定もないので無限に被弾可能)ので密度の上がり方がやばすぎておそらくフリーズしますw",
//自機狙い弾
prop:true,
step:8,
init() {
this.step=8
this.prop=true
gi(1.75)
},
time:20,
run() {
if (pfr % 30 === 0) {
this.step -= 0.1
const offsetDeg = this.prop ? 0 : this.step / 2
this.prop = !this.prop
for (let i = 0;i<180;i+=this.step) {
const targetAngle = i + offsetDeg;
const a = this.prop ? i % 2 === 0 : i % 2 !== 0
const b = a ? i : null
if (!b) continue;
bullet({
    speed:3, // スピード5
    color:"DD0D38", 
    w: 16,
    h: 16, 
    type: "amulet",
    y: 0,
    x: Half.x,
    angle: dtr(targetAngle),
})
bullet({
    speed:3, // スピード5
    color:"DD0D38", 
    w: 16,
    h: 16, 
    type: "amulet",
    y: canvas.h,
    x: Half.x,
    angle: dtr(-i),
})
}
    
}
    
}
    
}
functions.push(spell6)
const spell7 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"純符｢純粋な弾幕天国｣",
desc:"",
hint:"",
ct:"あまりにもムズすぎて1度とんでもないナーフをしてやっと作者がクリア。めっちゃムズい！！！元々はストーンゴッデスが楽しいからいい感じの気合い弾幕を作ろうしてたんですけどね;;どうしてこうなるのか...時間経過で難易度が上がるところとかストーンゴッデスパクリな名残がある",
//自機狙い弾
prop:true,
step:8,
init() {
this.step=8
this.prop=true
gi(1.75)
},
time:60,
run() {
if (pfr % 600 === 0) bullets.length = 0
if (pfr % 30 === 0) {
console.log(bullets.length)
circle((ev) => {
wait(() => {
const dispersion1 = random(1,30) / ev.i
const dispersion2 = random(30,60) / ev.i
const dispersion3 = random(100,600) / ev.i
const dispersion4 = random(1,30) / ev.i
for (let i = -50;i<100;i+=50) {
if (i % 2 === 0 && Math.random() > 0.35)bullet({
    speed:2.85, // スピード5
    color:"F11D22", 
    w: 16,
    h: 16, 
    type: "gummy",
    y: Half.y - 50,
    x: Half.x+i,
    angle: dtr(ev.deg + dispersion1),
})
}
if (pfr >= sp(10)) {
if (ev.i % 2 === 0) bullet({
    speed:3.5, // スピード5
    color:"272DB0", 
    w: 48,
    h: 48, 
    type: "gummy",
    y: Half.y - 50,
    x: Half.x,
    angle: dtr(ev.deg + dispersion2),
})
}
if (pfr >= sp(20)) {
bullet({
    speed:1.85, // スピード5
    color:"FFF23B", 
    w: 16,
    h: 16, 
    type: "gummy",
    y: Half.y - 50,
    x: Half.x,
    angle: dtr(ev.deg + dispersion3),
})
}
if (pfr >=sp(30)) {
const x = random(60,270)
if (pfr % 90 === 0)circle((eev) => {
bullet({
    speed:0.5, // スピード5
    color:"88FF47", 
    w: 16,
    h: 16, 
    type: "gummy",
    y: Half.y,
    x: x,
    angle: dtr(eev.deg),
setlist:[{f:20,e:2.5}]
})

},{count:40})}
if (pfr >=sp(40)) {
const x = pf(Half.x,Half.y)
if (pfr % 90 === 0) for (let i = -13;i<13;i++) {
const angle = random(-360,360)
bullet({
    speed:0, // スピード5
    color:"3F0BC7", 
    w: 16,
    h: 16, 
    type: "gummy",
    y: Half.y,
    x: Half.x + i / 6,
    angle: dtr(x+angle),
setlist:[{f:60,e:1.25}]
})

}}
if (pfr >=sp(50)) {
if (pfr % 30 === 0) for (let i = 0;i<1;i++) {
const x = pf(Half.x + i,Half.y + i)

wait(() => {bullet({
    speed:1, // スピード5
    color:"D65AC4", 
    w: 16,
    h: 16, 
    type: "gummy",
    y: Half.y,
    x: Half.x,
    angle: x,
setlist:[{f:30,e:1.5}]
})
},i*4)
}}
if (pfr >=sp(60)) {
bullet({
    speed:1, // スピード5
    color:"FFFFFF", 
    w: 64,
    h: 64, 
    type: "gummy",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg),
setlist:[{f:30,e:1.5}]
})
}
},ev.i)
},{count:18})
}
    
}}
functions.push(spell7)
const spell8 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"ストーンゴッデス",
desc:"",
hint:"",
ct:"はい。分かったってにてないのは\nこれはスペカ7が思てたんと違うから作り直したヤツ。全方位弾にブレつけると一気にそれっぽくなるのを理解しましたよ！ちなみにこれは結構ストーンゴッデスでは無いけど、いい感じ",
//自機狙い弾
prop:true,
step:8,
init() {
this.step=8
this.prop=true
gi(0.5)
},
time:20,
run() {
if (pfr % 15 === 0) {
circle((ev) => {
wait(() => {
const rand = random(-15,15)
const color = ev.i % 2 === 0 ? "4D38FF" : "FFE838"
bullet({
    speed:1, // スピード5
    color:color, 
    w: 16,
    h: 16, 
    type: "scale",
    y: Half.y + 50,
    x: Half.x,
    angle: dtr(ev.deg + rand),
})
},ev.i)
},{count:72}) 
}
}}
functions.push(spell8)
const spell9 = { // 修正箇所：改行による宣言の分断を解消し、
name:"幻在「クロックコープス」",
desc:"テスト用",
hint:"",
ct:"実は発射時の自機の位置に角度が再設定されるので、逃げ惑うのは無駄です。後なんなら弾の発車位置がズレるのでお勧めしないw",
//自機狙い弾
prop:true,
c:0,
init() {
this.c = 0
this.prop=true
gi(0.5)
},
time:60,
run() {
if (pfr % 120 === 0) {
const spawn = pfr
this.c += 1
if (this.c % 2 === 0) this.prop = !this.prop
for (let i = 0;i<30;i++) {
const x = this.prop ? players[0].x + random(10,100) : players[0].x + random(-10,-100)
const y = random(0,canvas.h)
wait(() => {bullet({
    speed:0, // スピード5
    color:"FFFFFF", 
    w: 24,
    h: 24, 
    type: "scale",
    y: y,
    x: x,
    angle: pf(x,y),
custom:spawn,
fnlist:[{f:0,loop:true,fn:function() {
    if (this.custom + 180 <= pfr) {
this.color = "FF2812"
this.speed += 0.022222
if (this.custom + 180 === pfr) this.angle = pf(this.x,this.y)
    }
}}]
})
},i*4)
}}
}}
functions.push(spell9)
const spell10 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"幻遊「ジャック・ザ・ルドビレ」(",
desc:"",
hint:"",
ct:"なう(2026/07/05 21:35:58)現状最後のスペカ。これはスペル9のバグから生まれたスペカ。めっちゃ力作ではあるけど元がバグなのがなんともというアレ。",
//自機狙い弾
prop:true,
owner:null,
c:0,
init() {
this.c = 0
this.prop=true
gi(0.5)},
time:60,
run() {
if (pfr === 3) this.owner = bullet({
        speed: 2.5,         // スピード1.5
        color: "FB0230",     // 色：FB0230
        w: 64,               // サイズ幅：64
        h: 64,               // サイズ高：64
        type: "scale",       // タイプ：scale
        x: canvas.w / 2,     // 初期x：half（画面の横幅の中央）
        y: canvas.h / 2,     // 初期y：half（画面の縦幅の中央）
        angle: 0,            // 初期角度：0
        fnlist: [{
          f: 0,
          loop: true,
          fn: function() {
            // 半径（当たり判定の基準としてサイズ64の半分である32、または0でも可）
            const r = 32; 

            // 壁（画面端）との衝突判定
            // 左端、右端、上端、下端に到達したかをチェックします
            if (this.x - r <= 0 || this.x + r >= canvas.w || this.y - r <= 0 || this.y + r >= canvas.h) {
              
              // 画面外にめり込み続けて反射判定が連続発生（チャタリング※1）するのを防ぐため、位置を画面内に微調整します
              this.x = Math.max(r, Math.min(canvas.w - r, this.x));
              this.y = Math.max(r, Math.min(canvas.h - r, this.y));

              // 角度をランダムに変更します
              // ※ご使用の環境の角度が「度数法（0~360）」の場合は random(0, 360) を使用してください。
              // ※もし「ラジアン（0~2π）」で動いているシステムの場合は random(0, Math.PI * 2) に変更してください。
              this.angle = random(0, 360); 
            }
          }
        }]
      });
if (pfr % 120 === 0) {
const spawn = pfr
this.c += 1
if (this.c % 2 === 0) this.prop = !this.prop
for (let i = 0;i<30;i++) {
const x = this.prop ? players[0].x + random(10,100) : players[0].x + random(-10,-100)
const y = random(0,canvas.h)
wait(() => {bullet({
    speed:0, // スピード5
    color:"FFFFFF", 
    w: 24,
    h: 24, 
    type: "scale",
    y: y,
    x: x,
    angle: pf(x,y,0,this.owner),
custom:{s:spawn,x:this.owner.x,y:this.owner.y},
fnlist:[{f:0,loop:true,fn:function() {
    if (this.custom.s + 180 === pfr) {
this.color = "FF2812"
this.speed = 4
this.angle = pf(this.x,this.y,0,this.owner,this.custom.x,this.custom.y)
    }
}}]
})
},i*4)
}}
}}
functions.push(spell10)