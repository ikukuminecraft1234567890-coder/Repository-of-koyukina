import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half,entitys,spelln,start,player,internal} from './sys.js';
import {stat,gameLoop} from "./engine.js"
import {bullet,Bullet,CC} from "./bc.js"

import {
dtr,intern,nextTaskId,wait,random,fr,ondebug,sp,sd,fs,itraw,it,gi,normal,circle,reverse,pf
} from "./bullet.js"
const mx = 384*2
const my = 448*2

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

//バラマキ高速
export const functions = []
const spell1 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"天界剣「七魄忌諱」",
desc:"",
nm:"さて、このスペカは友達にランダムに頼りすぎと言われ作ったランダム0スペル。当時はランダムを悪いことだと思ってたけど別に良くない？になって直したw",
dif:"e",
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
nm:"こういう迷路スペカ気に入ってる。何気にずっと思いついたまま作ってなかったけどちょうどネタ切れしてたから在庫補充した感じ。上手くいった",
dif:"n",
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
nm:"私は自機狙いを初期アングルに使うことに謎の抵抗感があるので、こういう自機狙いを新しい方向性から使うのが気に入ってる。大切。",
dif:"n",
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
name:"西行妖の枝",
desc:"バグから修正した",
dif:"l",
nm:"このスペカマジで二週間くらい放置してた。最初はどんどん回転速度が上がってく四方向レーザー(当時はレーザーがないので丸弾をn個連結させてた)だったんですが、上手くいかないもんで😅",
hint:"",
ct:"ごめんやんwずっと放置してたスペカ。なんなら原型ない。実装はしたんで🥲",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(0.5)
},
time:30,
run() {
if (pfr % 60 === 0) {
    this.prop.a += 18
const st = {s:1,t:"big",r:16,c:"9C27B0",mt:45}
circle((ev) =>{
const angle = dtr(ev.deg + normal(this.prop.a,0,180))
bullet({
    speed:st.s, // スピード5
    color:st.c, 
    w: st.r,
    h: st.r, 
    type:st.t,
    y: Half.y,
    x: Half.x,
    angle: angle,
fnlist:[{f:st.mt,fn:function() {this.angle *= 1.5}}]
})
bullet({
    speed:st.s, // スピード5
    color:st.c, 
    w: st.r,
    h: st.r, 
    type:st.t,
    y: Half.y+10,
    x: Half.x,
    angle: angle,
fnlist:[{f:st.mt,fn:function() {this.angle *= 1.5}}]
})
bullet({
    speed:st.s, // スピード5
    color:st.c, 
    w: st.r,
    h: st.r, 
    type:st.t,
    y: Half.y-10,
    x: Half.x,
    angle: angle,
fnlist:[{f:st.mt,fn:function() {this.angle *= 1.5}}]
})
bullet({
    speed:st.s, // スピード5
    color:st.c, 
    w: st.r,
    h: st.r, 
    type:st.t,
    y: Half.y+15,
    x: Half.x,
    angle: angle,
fnlist:[{f:st.mt/2,fn:function() {this.angle *= 2}}]
})
},{count:72,startDeg:0})
}}}
functions.push(spell4)

const spell5 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"不滅「フェニックスの羽」",
desc:"",
nm:"これ好き。やっぱり気合いは楽しい。気合い避けは楽しいんだけど似たようなものになりがちなので、バリエーションが大切。",
dif:"h",
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
dif:"l",
nm:"私の中ではかなりムズいと思う。てかムズすぎて普通に弱体化したもんね(笑)自分のスペカなんか時間発狂多い気がするなぁ...",
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
dif:"l",
nm:"残り0秒になると、全方位白弾が出るんですが、これは時間発狂用の時間経過で眠過ぎて60sからも弾幕必要だと思って実装したwwほんとはいりませんw",
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
dif:"h",
nm:"このスペカ、というよりこの辺は錦上京にハマってて楽しい気合い避けを実現しようと試行錯誤してました",
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
desc:"",
dif:"h",
nm:"この辺から難易度のことを考え始めた。難易度って下手にあげれないからむずいよね。",
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
name:"幻遊「ジャック・ザ・ルドビレ」",
desc:"",
hint:"",
dif:"h",
nm:"元々のバグは対象がプレイヤーじゃなくて最初の弾にあるせいでしかもずっと底に角度固定されてたから気持ち悪い事になってたんですがいいなーと思って弾種を分けたりしてそれっぽく。気に入ってる",
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
const spell11 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"災禍｢土石流｣",
desc:"",
nm:"このスペカはめちゃくちゃ頑張った気がする。難易度、見た目ともにかなりバランスがいい。",
dif:"h",
hint:"当たってるように見えても案外隙間を抜けれます。諦めないこと",
ct:"土石流とは、山津波の正式名称の事である。難易度で言うと結構むずい。ただし、隙間を抜けてるのがめっちゃ楽しいのでOKw",
//自機狙い弾
prop:false,
init() {
this.prop=false
gi(0.5)},
time:30,
run() {
if (pfr % 4 === 0) {
if (pfr > 600) this.prop = true
const x = random(0,canvas.w)
const a = dtr(random(60,120))
const nnc = this.prop && a >= dtr(90)? "FF0053" : "0028FF" 
const nc = this.prop ? nnc : "7F0094"
for (let nx = -10;nx < 10;nx+=5)bullet({
    speed:3.5, // スピード5
    color:nc,
rd:1,
w: 64,
    h: 64, 
    type: "om",
    y: 0,
    x: x + nx*2,
    angle: dtr(90),
custom:this.prop,
fnlist:[{f:0,fn:function(){if(this.custom)this.angle = a}}],
setlist:[{f:120,e:2.5}]
})
}
}}
functions.push(spell11)
const spell12 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"天竜「雨の源泉」",
desc:"",
hint:"",
ct:"初期は途中で自機狙いにならなかったのでめっちゃ簡単だったので、直して結構ムズ目にしたwちなみに簡単なのは変わらぬ()",
dif:"n",
nm:"自機狙いのみで構成された弾幕。何とかして難易度を上げようとした結果割といい感じに。低速弾って汎用性が高い。",
//自機狙い弾
prop:false,
init() {
this.prop=false
gi(0.5)},
time:60,
run() {
if (pfr % 3 === 0) {
const x = random(0,canvas.w)
const a = dtr(random(60,120))
bullet({
    speed:3.5, // スピード5
    color:"#8527B0",
rd:1,
w: 64,
    h: 64, 
    type: "big",
    y: 0,
    x: x,
    angle: dtr(90),
custom:true,
fnlist:[{f:0,fn:function(){
if(this.timer===1)this.angle = pf(this.x,this.y)
    if (this.y >= canvas.h) {
this.speed = 1
if (Math.random() < 0.05 & this.custom)this.angle = pf(this.x,this.y)
this.custom = false
}
},loop:true}],
setlist:[{f:60,e:0.5}]
})
}
}}
functions.push(spell12)
const spell13 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"獄符「千本の針の大陸｣",
desc:"",
hint:"",
dif:"l",
nm:"私の中でこの弾幕からはかなり変わった印象。この辺から自信作増えてくる。これは難易度を上げすぎたと反省している作品。難易度高いとプレイヤーが苦しむの見てニヤニヤするのは楽しいけどテストプレイもムズいしテストプレイで地獄見る=開発者が苦戦するのは普通に最難関クラスなのに気づいた。",
ct:"実は自機狙い弾が挟まってたのに気付きました？あれがあるせいでめっちゃむずいはずwなう(2026/07/06 20:40:55)最後のスペカ。また次回会いましょうw",
//自機狙い弾
prop:0,
init() {
this.prop=0
gi(0.5)},
time:35,
run() {
if (pfr % 15 === 0) {
this.prop += 2
const pp = normal(this.prop,-180,180)
circle((ev) =>{
const x = Half.x
const y = Half.y
const a = ev.deg
const angle = a + dtr(random(-5,5) + pp)
if (ev.i === 1)bullet({
    speed:1, // スピード5
    color:"#FF285A",
rd:1,
w:16,
    h: 16, 
    type: "kunai",
    y: y,
    x: x,
    angle: pf(x,y),
custom:true,
setlist:[{f:15,e:1.5}]
})
wait(() => {bullet({
    speed:1, // スピード5
    color:"#FF285A",
rd:1,
w:16,
    h: 16, 
    type: "kunai",
    y: y,
    x: x,
    angle: angle,
custom:true,
setlist:[{f:15,e:1.5}]
})
if (ev.i % 6 === 0)bullet({
    speed:1, // スピード5
    color:"#284BFF",
rd:1,
w:16,
    h: 16, 
    type: "kunai",
    y: y,
    x: x,
    angle: angle + dtr(pp),
custom:true,
setlist:[{f:15,e:0.5}]
})
},ev.i/6)
},{count:36})}
    
}}
functions.push(spell13)



const spell14 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"禁忌｢鯉の迷路｣",
desc:"",
hint:"",
nm:"これ、そもそもバグなんすよ。高速気合い避けすぺるつくったろ！wって思ったら角度変更の際のバグで隙間が生まれたんですが、無駄にムズすぎるし活用できるスペカにしよ！ってなったのがこれ。",
dif:"h",
ct:"はい。はい。はい。一見とんでもない高難易度の脳死スペカかと思いきや、穴を回っていくというスペカです。いやまあこれでも難しいんですけどw結構自信作。ちなみに錦忌は特に意味は無い。元々なんか錦上京っぽくしたいなーっと思ってたけど無理だったので、適当に禁忌と錦上京の錦で合わせておいただけw(追記:錦忌には先駆者がいたっぽいので禁忌にしておきました)",
//自機狙い弾
prop:{d:75,a:0},
init() {
this.prop={d:75,a:0}
gi(0.5)},
time:15,
run() {
if (pfr % 20 === 0) {
this.prop.d += 15
this.prop.a += 3
const a = normal(this.prop.a,-180,180)
const p = normal(this.prop.d,-180,180)
circle((ev) =>{
const x = Half.x
const y = Half.y
wait(() => {bullet({
    speed:1, // スピード5
    color:"#2800FF",
rd:1,
w:16,
    h: 16, 
    type: "big",
    y: y,
    x: x,
    angle: dtr(ev.deg+a),
setlist:[{f:15,e:3}]
})

},ev.i / 6)
},{count:72,startDeg:p})}
    
}}
functions.push(spell14)

const spell15 = {
name: "檻符｢弾幕の竜巻｣",
desc: "",
hint: "白い、赤い間は当たり判定がありません。",
nm:"この辺なんかムズい気がする。この辺はギミックに力入れ始めてますね。弾幕の檻とは友達が作ったまいくらの攻撃のこと。バグなんですが、どう頑張っても直せなかったので萎え落ちしました。ごめんw",
dif:"l",
ct: "弾幕の檻でもあり、竜巻でもあるw普通に弾幕の檻っていう名前と、竜巻両方良かったんで決めかねたので合わせました。個人的にめっちゃムズイ。ちなみに、なんか絶対当たってないだろ！ってタイミングで被弾することあったと思います。あれは普通にバグw直せなかった;;",
time:30,
prop: { deg: 0 },
init() {
this.prop = { deg: 0 }
gi(1)},
run() {
// 💡 最初の1フレーム目に、バーを構成する18個の弾をまとめて生成
if (pfr === 3) {
        const size = 32;       // 弾のサイズ（w, h）
const r =1.4
        const halfSize = size /3; // 綺麗に端に合わせるためのオフセット
        const color = "#FFE838"; // 黄色
        const type = "normal";    // 弾種
// 条件式を <= にすることで、0 と canvas.w の2回実行されるようになります
for (let x = 0; x <= canvas.w; x += canvas.w) {
    for (let y = 0; y <= canvas.h; y += canvas.h) {
        bullet({
            speed: 0,
            color: "9C27B0",
            w: size * 4, h: size * 4,
            type: type,
            x: x, // 0（左）または canvas.w（右）
            y: y, // 0（上）または canvas.h（下）
            angle: 0
        });
    }
}

        // 横方向（上下の辺）の配置
        // 左端(halfSize)から右端(canvas.w - halfSize)まで、サイズ分の間隔で配置
        for (let x = halfSize; x <= canvas.w - halfSize; x += size/2) {
            // 上辺
            bullet({
rd:r,
                speed: 0,
                color: color,
                w: size, h: size,
                type: type,
                x: x,
                y: halfSize, // 画面の一番上
                angle: 0
            });
            // 下辺
            bullet({
rd:r,
                speed: 0,
                color: color,
                w: size, h: size,
                type: type,
                x: x,
                y: canvas.h - halfSize, // 画面の一番下
                angle: 0
            });
        }

        // 縦方向（左右の辺）の配置
        // 上下の角の重複を避けるため、1マス内側からスタートして配置
        for (let y = halfSize + size; y <= canvas.h - (halfSize + size); y += size/2) {
            // 左辺
            bullet({
rd:r,
                speed: 0,
                color: color,
                w: size, h: size,
                type: type,
                x: halfSize, // 画面の一番左
                y: y,
                angle: 0
            });
            // 右辺
            bullet({
rd:r,
                speed: 0,
                color: color,
                w: size, h: size,
                type: type,
                x: canvas.w - halfSize, // 画面の一番右
                y: y,
                angle: 0
            });
        }
    }
if (pfr % 15 === 0) {
    for (let i = 1; i <= 24; i++) {
        bullet({
            speed: 0, // 💡 自動前進はさせない（座標を直接制御するため）
            color: "#FFFFFF",
            rd: 0,
            w: 16,
            h: 16, 
            type: "big",
            y: Half.y,
            x: Half.x,
            angle: 0,
            custom: {
b:true,
s:random(1.5,3),
                radius: i * 12, // 💡 中心からの距離（iが増えるほど外側へ）
                initialDeg: 90  // 💡 初期配置の角度（真下スタート）
            },
            fnlist: [{
                f: 0, loop: true, fn: function() {
                    // 毎フレーム全体の角度を進める（pfrを利用して回転）
                    // 1フレームごとに1.5度回転（お好みで速度を調整してください）
if (this.timer === 180) {
this.color = "FF0050"
this.custom.b = false }
if (this.timer === 240) {
this.color = "2800FF"
this.rd = 1
    this.radius = (this.w * this.rd) /2
this.color = "2800FF"
if (Math.random() < 0.25) {
this.color = "00FF68"
    this.angle = random(-180,180)
this.speed = 1
}
}
if (!this.custom.b) return;
                    const currentDeg = this.custom.initialDeg + (pfr * this.custom.s);
                    const rad = dtr(currentDeg);
                    // 💡 中心座標（Half.x, Half.y）から、角度と半径を使って毎フレーム位置を上書き
                    this.x = Half.x + Math.cos(rad) * this.custom.radius;
                    this.y = Half.y + Math.sin(rad) * this.custom.radius;
                }
            }]
        })
    }
}
}}
functions.push(spell15)
const spell16 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"博麗｢幻想結界 -小-｣",
desc:"",
nm:"個人的にこれ16なの納得いかない。こんなに古いっけ？結構反省してこの辺からは難易度を下げる意識をつけました。",
dif:"h",
hint:"減少、増加は13周期。",
ct:"結構すこ。なう(2026/07/07 20:25:45)最終スペル。14〜16は結構完成度高いと思うんすよ！残り時間が見えないのは普通に申し訳ないwてか最近のスペカ難易度高めのが多いかもしれんw",
//自機狙い弾
prop:{d:75,a:0},
init() {
this.prop={d:75,a:0,c:0,dir:true}
gi(0.5)},
time:30,
run() {
if (pfr === 3) {
            const size = 64;       // 弾のサイズ（w, h）
const r =1.4
        const halfSize = size /3; // 綺麗に端に合わせるためのオフセット
        const color = "#FFE838"; // 黄色
        const type = "normal";    // 弾種
// 条件式を <= にすることで、0 と canvas.w の2回実行されるようになります
for (let x = 0; x <= canvas.w; x += canvas.w) {
    for (let y = 0; y <= canvas.h; y += canvas.h) {
        bullet({
            speed: 0,
            color: "9C27B0",
            w: size * 4, h: size * 4,
            type: type,
            x: x, // 0（左）または canvas.w（右）
            y: y, // 0（上）または canvas.h（下）
            angle: 0
        });
    }
}
}
if (pfr % 60 === 0) {
this.prop.c+=1
const stop = this.prop.d *3
const swit = this.prop.c > 7
if (this.prop.c > 13) this.prop.c = 0
this.prop.d = swit ? this.prop.d + 3 : this.prop.d - 3
this.prop.a += 3
const a = normal(this.prop.a,-180,180)
const p = normal(this.prop.d,-180,180)
circle((ev) =>{
const x = Half.x
const y = Half.y
wait(() => {bullet({
    speed:1, // スピード5
    color:"#FF003B",
rd:1,
w:16,
    h: 16, 
    type: "amulet",
    y: y,
    x: x,
    angle: dtr(ev.deg+a),
setlist:[{f:stop,e:0},{f:600,e:3}]
})

},ev.i / 10)
},{count:72,startDeg:0})}
    
}}
functions.push(spell16)
const spell17 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"貫符｢メイズスパーク｣",
desc:"",
hint:"青弾は壁で反射します",
nm:"レーザー実装により革命。周辺スペルは全員レーザー使ってます。実装に苦労しただけに良スペカ多いと思う！",
dif:"n",
ct:"どう！？！どう！？！どう、？！？！？めっちゃいいスペカだと思うんですねこれ。レーザー実装した甲斐が有ったw地味に星弾は魔理沙要素としてです。特にこだわりは無いので初期は丸弾だった",
//自機狙い弾
prop:{d:75,a:0},
init() {
this.prop={d:75,a:0,c:0,dir:true}
gi(0.5)},
time:30,
run() {
if (pfr % 240 === 0 || pfr === 3) {
circle((ev) =>{
const x = Half.x
const y = Half.y
const a = random(1,6)
bullet({
    speed:180, // スピード5
    color:"#FF003B",
rd:1,
w:16,
    h: 999, 
    type: "laser",
    y: random(0,canvas.h),
    x: random(0,canvas.w),
    angle: dtr(ev.deg + random(-180,180)),
deleteFrame:240,
fnlist:[{f:120,fn:function() {
    bullet({
        speed:1,
color:this.color,
w:8,h:8,
type:"star",
x:this.x,y:this.y,
angle:this.angle,
custom:true,
fnlist:[{f:0,loop:true,fn:function() {reverse(this)}}]
    })
}}]
})
},{count:36,startDeg:0})}
    
}}
functions.push(spell17)
const spell18 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"現象｢豪雨と旭光、陽炎｣",
desc:"",
hint:"",
nm:"レーザー実装で次に思いついたのは全方位にレーザーで日射実装出来るじゃん！で、それを実現したのがこれ。雨弾は思ったより簡単なんですが、今振り返るとこれでよかったと思う。 ",
dif:"h",
ct:"悪くないと思う。レーザー被りなのは許してwレーザーまじで楽しいから仕方がない。難易度は結構頑張って調整しましたよ！ただ正直、真下に居座るのが最適解すぎるのは改善点かなと",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:false},
init() {
this.prop={d:0,a:false}
gi(0.5,[],120,3)
},
time:37,
run() {
const flag = pfr % 300
if (flag > 0) {
    bullet({
    speed:1, // スピード5
    color:"#028ED4",
rd:1,
w:16,
    h: 16, 
    type: "scale",
    y: 0,
    x: random(0,canvas.w),
    angle: dtr(random(0,180)),
setlist:[{f:60,e:1.5,multi:true}],
fnlist:[{f:60,fn:function(){this.angle+=random(-10,10)}}]
})
}
if (flag === 0) {
const bool = this.prop.a
 this.prop.a = !this.prop.a
this.prop.d += 16
circle((ev) =>{
const a = random(1,6)
const angle = bool ? dtr(ev.deg + normal(this.prop.d,-180,180)) : dtr(ev.deg)
const x = bool ? random(0,canvas.w) : Half.x
const y = bool ? random(0,canvas.h) : 0
const speed = bool ? 120 : 50
const tempo = bool ? 2 : 1
if (ev.i % tempo === 0)bullet({
    speed:speed, // スピード5
    color:"#FF5100",
rd:1,
w:16,
    h: 999, 
    type: "laser",
    y: y,
    x: x,
    angle: angle,
deleteFrame:180,
})
},{count:144,startDeg:0})
}
    
}}
functions.push(spell18)
const spell19 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"獄符｢地獄人の感｣",
desc:"",
nm:"なんで！？え、なんで見えてんの！？！？！？！？考えうる理由1:コードを除き見た。これが一番有り得る。2:俺ですら知らない第二の安置があった。これは分からん。3:キモすぎる気合い避けでクリアした。これはマジで俺に教えろ。今すぐ！",
dif:"p",
hint:"",
ct:"うおwはい。安置がありますwといっても、安置でも2被弾は確定なんですがねw初動から真下に行くだけで余裕でクリアできますが、そういうスペルなので😅気づく人はいると思うんですねw",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:0},
init() {
this.prop={d:0,a:0}
gi(0.5,[],120,3)
},
time:37,
run() {
const colors = ["FF0028","FF6A00","FFE900","92FF00","00FF3F","00FFF8","0018FF","7F00FF","F800FF","FF004A"]
if (pfr % 10 === 0 || pfr === 3) {
this.prop.a += 1
if (this.prop.a > colors.length - 1) this.prop.a = 0
this.prop.d += 30
circle((ev) =>{
const rand = ev.i % 15
const angle = this.prop.d
const a = true
// ※「a」が整数化フラグ（true）の変数名として定義されている前提です

bullet({
    speed: 6.5,
    color: colors[this.prop.a],
    rd:1,
    w: 64,
    h: 64, 
    type: "big",
    y: 0,
    x: Half.x,
    angle: dtr(ev.deg+angle),
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納


})},{count:54,startDeg:0})
    }
}}
functions.push(spell19)
const spell20 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"純符｢純粋な弾数地獄｣",
desc:"",
hint:"",
nm:"純符は個人的に弾幕天国があるので、なんか由緒正しき血統になってます。言うほどムズくないけどw弾幕天国は初の分かりやすい高難易度スペカなので、気に入ってる。",
dif:"h",
ct:"純符の名を冠する割にはムズくないかも？20スペカの大台に乗りました\nスペカ7といいこいつといいあんまりむずくないの多い🥲\nこのスペカははじめてやっただんまくげーむのMathMareに影響されている。オススメ",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:0},
init() {
this.prop={d:0,a:0}
gi(0.5,[],120,3)
},
time:50,
run() {
if (pfr === 3) {
this.prop.a += 1
bullet({
    speed: 3,
    color: "FF0030",
    rd:1,
    w: 4,
    h: 4, 
    type: "normal",
    y: 0,
    x: Half.x,
    angle: dtr(45),
fnlist:[{f:0,loop:true,fn:function() {
const bounced = reverse(this)
if (bounced) {
   bullet({
    speed: 1.5,
    color: "00EDFF",
    rd:1,
    w: 4,
    h: 4, 
    type: "normal",
    y: this.y,
    x: this.x,
    angle: dtr(random(-180,180)),
fnlist:[{f:0,loop:true,fn:function(){
const bounced = reverse(this)
if (bounced) {
   bullet({
    speed: 1.5,
    color: "36B027",
    rd:1,
    w: 4,
    h: 4, 
    type: "normal",
    y: this.y,
    x: this.x,
    angle: dtr(random(-180,180)),
fnlist:[{f:0,loop:true,fn:function(){
reverse(this)
}}]
})}}
}]
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納


})}
    }}]})
    
}}}
functions.push(spell20)
const spell21 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"熱湯｢地底の熱源泉｣",
desc:"",
hint:"",
nm:"この弾幕はクナイ弾のテクスチャが一新されたから作った弾幕。一新されたおかげでこの弾幕がある。近代弾幕は反射の使用率高い気がするw",
dif:"h",
ct:"全方位反射隠れ自機狙い弾の弾幕です。要素もりもりwこの辺なんか時間発狂多いな？",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:0,b:false},
init() {
this.prop={d:0,a:0,b:false}
gi(0.5,[],120,3)
},
time:30,
run() {
if (pfr % 240 === 0 || pfr === 3) {
this.prop.b = !this.prop.b
const color = this.prop.b ? "6FE6FF" : "FF6F91"
const x = this.prop.b ? Half.x - 80 : Half.x + 80
const y = Half.y - 10
this.prop.a += 1
const p = pf(x,y)
circle((ev) => {
bullet({
    speed: 1,
    color: color,
    rd:1,
    w: 16,
    h: 16, 
    type: "kunai2",
    y: y,
    x: x,
    angle: dtr(ev.deg) + p,
fnlist:[{f:0,loop:true,fn:function() {
reverse(this)
}}]
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納


})},{count:36})
    
}}}
functions.push(spell21)
const spell22 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"光符「アースライトレイ」",
desc:"",
hint:"",
dif:"h",
nm:"レーザー思いついて作りたかったスペル。こんな感じで交互に安置を潰す奴は中々作れなくて、かなり苦戦してました。あと安置の後は何でその隙間を避けさせるかにかなり苦労。過剰にムズいか簡単になるのがむずかしい。",
ct:"レーザー思いついてまっさきに実装したかったスペカ。やっと作れましたわよということで()",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:0,b:false,c:0},
init() {
this.prop={d:0,a:0,b:false,c:0}
gi(1.5,[],120,3)
},
time:60,
run() {
const cycle = pfr % 240
if (pfr % 20 === 0) {
const y = 0
const x = players[0].x
bullet({
    speed: 3,
    color: "274EB0",
    rd:1,
    w: 4,
    h: 4, 
    type: "normal",
    y: y,
    x: x,
    angle: dtr(90),
deleteFrame:360
})
}
if (pfr % 240 === 0) {
for (let i = 0 ;i < 30;i++) {
this.prop.c += 42
const x = normal(this.prop.c,0,canvas.w)
const y = 0
bullet({
    speed: 240,
    color: "FF0050",
    rd:1,
    w: 16,
    h: 16, 
    type: "laser",
    y: y,
    x: x,
    angle: dtr(90),
deleteFrame:360
})} 
    
}
    }}
functions.push(spell22)
const spell23 = {
name:"スピア・ザ・グングニルのレプリカ",
desc:"",
nm:"このスペカは友達に初めて褒められたので、うきうきになって移植してた。旧作はどういう扱いにするか困ってる。",
dif:"h",
hint:"",
ct:"旧作のスペカ9の移植。割と気に入ってるから移植したw",
list:[],
//自機狙い弾
pe:0,
init() {
this.pe = 0
CC("gummy","#00FF00")
CC("knife","#80FF80")
CC("gummy","#0000FF")
entity = new Entity("ボス", Half.x, Half.y - 80, 20, "purple", 3, true)
gi(0.5)
},
time:25,
run() {
const count = 72
const step = 360 / count;
if (this.pe > 4) this.pe = -4
if (pfr % 120 == 0) this.pe += 1
const startDeg = this.pe * 30
if (pfr % 30 === 0) {
for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * step; 
        
        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + startDeg) % 360;
        
        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }
        
        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
wait(() => {new Bullet({
    speed: 1, // スピード5
    color: "#00FF00", 
    w: 16, 
    h: 16, 
    type: "gummy", 
    y: entity.y, 
    x: entity.x, 
    angle: angle,
custom:1,
setlist:[{f:0,e: function () {
        // 120フレーム（2秒）を1サイクルとする
        const cycle = pfr % 60;
if (cycle === 0) this.custom = this.custom * 3
            return this.custom
        },loop:true}]
// 最初は右（0度）
})
},i)
}
if (fs(pfr) > 10) {
for (let i = 0; i < count; i++) {
        // 1. 順番通りにベースの角度を計算（0, 10, 20...）
        let baseDeg = i * step * 0.75; 
        
        // 2. スタート位置（startDeg）を足して、360度以内に丸める（% 360）
        let deg = (baseDeg + -startDeg) % 360;
        
        // 3. 180度を超えた後半の半分を、いつものマイナスの世界（-179 〜 -1）に変換する
        if (deg > 180) {
            deg -= 360;
        }
        
        // 4. ラジアンに変換して発射！
        const angle = deg * (Math.PI / 180);
wait(() => {new Bullet({
    speed: 1, // スピード5
    color: "#0000FF", 
    w: 16, 
    h: 16, 
    type: "gummy", 
    y: entity.y, 
    x: entity.x, 
    angle: angle,
custom:1,
setlist:[{f:0,e: function () {
        // 120フレーム（2秒）を1サイクルとする
        const cycle = pfr % 60;
if (cycle === 0) this.custom = this.custom * 1.5
            return this.custom
        },loop:true}]
// 最初は右（0度）
})
},i)
}
}
}
if (pfr % 3 === 0)new Bullet({
    speed: 3, // スピード5
    color: "#80FF80", 
    w: 16, 
    h: 16, 
    type: "knife", 
    y: entity.y, 
    x: entity.x, 
    angle: pf(entity.x,entity.y),
// 最初は右（0度）
})
}}
functions.push(spell23)
const spell24 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"藍奥義｢弾幕結界 -下-｣",
desc:"",
hint:"",
nm:"めちゃくちゃ綺麗だったから難易度下げたくなかったけど。ムズすぎたので。初期はサイズのせいで避けるのが不可能な場面が多々あったので。無理やり後半サイズ下げる調整をいれたw",
dif:"l",
ct:"個人的に自信あり！気合と見た目両立出来た良スペカだと思います。サイズが途中で変わる弾があるのは難易度の為()元々は避けるのが不可能だったので可能にしましたわよということで、なう(2026/07/10 17:29:51)ラストのスペカ。実は少し前のアプデのはこのラストのスペカの文言がないw",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:0,b:false,c:0},
init() {
this.prop={d:0,a:0,b:false,c:32}
gi(1.5,[],120,3)
},
time:30,
run() {
if (pfr % 30 === 0) {

this.prop.c -= 1
this.prop.d += 2.4
const Size = Math.max(16,this.prop.c)
const loc = {x:Half.x,y:Half.y}
circle((ev) => {
wait(() => {
const rd = Size > 20 ? 0.7:  0.7
bullet({
    speed: 2,
    color: "FF0050",
    rd:rd * 0.5,
    w: Size,
    h: Size, 
    type: "gummy",
    y: loc.y,
    x: loc.x,
    angle: dtr(ev.deg+this.prop.d),
deleteFrame:360,
setlist:[{f:40,e:1.5}],
fnlist:[{f:120,fn:function() {
if (this.w <= 20) return;
    this.w = this.w * 0.75
this.h = this.h * 0.75
}}]

})
bullet({
    speed: 2,
    color: "00FFFA",
    rd:rd,
    w: Size,
    h: Size, 
    type: "gummy",
    y: loc.y,
    x: loc.x,
    angle: -dtr(ev.deg + this.prop.d*1.4),
deleteFrame:360,
setlist:[{f:40,e:1.5}],
fnlist:[{f:120,fn:function() {
if (this.w <= 20) return;
    this.w = this.w * 0.75
this.h = this.h * 0.75
}}]
})
},ev.i*2)},{count:72})
}}}
functions.push(spell24)
const spell25 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"謎符｢ギザの大ピラミッドの聖遺物｣",
desc:"",
hint:"",
dif:"n",
nm:"安置があったのに気づかれましたかねwこれは元々、全方位弾だったんですが、途中からこれピラミッドみたいじゃね？って微調整を繰り返してピラミッドにした。見た目意識するのは大切。",
ct:"難易度は結構高い気がするので時間を短くした(ゴリ押し)ピラミッドの表現は上手くいったんじゃないかな？",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:0,b:false,c:0},
init() {
this.prop={d:0,a:0,b:false,c:32}
gi(1.5,[],120,3)
},
time:20,
run() {
if (pfr % 240 === 0) {
const x = players[0].x
for (let i = - 50 ;i<=50;i+=50)bullet({
    speed: 90,
    color: "0085FF",
    rd:1,
    w: 16,
    h: 16, 
    type: "laser",
    y: 0,
    x: x+i,
    angle: dtr(90),
deleteFrame:240
})
}
if (pfr % 30 === 0) {

this.prop.c -= 1
this.prop.d += 2.4
const loc = {x:Half.x,y:Half.y}
circle((ev) => {
wait(() => {
bullet({
    speed: 2,
    color: "B08327",
    rd:1,
    w: 16,
    h: 16, 
    type: "knife",
    y: loc.y,
    x: loc.x,
    angle: dtr(90),
deleteFrame:360,
setlist:[{f:40,e:1.5}],
custom:this.prop.d,
fnlist:[{f:1,fn:function() {
this.angle = dtr(normal(ev.deg,60,120))
}},{f:25,fn:function() {
this.color = "FF0050"
this.angle = dtr(ev.deg+this.custom)}}]
})
},ev.i*2)},{count:72})
}}}
functions.push(spell25)
const spell26 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"熱風｢不死鳥の旋風｣",
desc:"",
hint:"",
nm:"これは〜....wこのスペカはかなり納得いってない。元々は滞留する予定だったんすけどね。あまり覚えてない;;",
dif:"n",
ct:"下と上から玉出てくるやつ作るの楽しい。難易度はそこまでかな",
//自機狙い弾
//全方位レーザー、上からバラマキ
prop:{d:0,a:0,b:false,c:0},
init() {
this.prop={d:0,a:0,b:false,c:32}
gi(1.5,[],120,3)
},
time:60,
run() {

if (pfr % 240 === 0) {
for (let i = 0;i< canvas.w ; i+=0.5) {
bullet({
    speed: 0,
    color: "FFFFFF",
    rd:1,
    w: 16,
    h: 16, 
    type: "gummy",
    y: 0,
    x: i,
    angle: dtr(random(0,180)),
custom:60,
fnlist:[{f:0,loop:true,fn:function() {
if (this.custom > this.timer) {
this.speed = 1.5
    this.color = "FF0053"
this.angle += dtr(random(30,60))
}
}}]
})
if (i % 3 === 0)bullet({
    speed: 0,
    color: "FFFFFF",
    rd:1,
    w: 16,
    h: 16, 
    type: "gummy",
    y: canvas.h,
    x: i,
    angle: dtr(random(0,180)),
custom:60,
fnlist:[{f:0,loop:true,fn:function() {
if (this.custom > this.timer) {
this.speed = 1.5
    this.color = "FF0053"
this.angle += dtr(random(30,60))
}
}}]
})
}
}}}
functions.push(spell26)

const spell27 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"星屑｢シューティングメテオ｣",
desc:"",
hint:"",
nm:"うおおお来たぞ！近代スペル屈指の名作が🤩🤩このスペカは難易度、見た目、楽しさを意識してる！ブレイジングスターをオリジナル解釈して実装した！いい感じ！27はかなり苦戦してたのもあって思い出補正が強い",
dif:"h",
ct:"どう！？！？ブレイジングスター見て思いついたスペル。しっかりオリジナリティを出しましたとも、ええ。個人的にはかなりお気に入り。スペル27は4回くらい完全に別のスペルがボツになってるからやっと完成させました",
//自機狙い弾
//全方位レーザー、上からバラマキ
amount:10,
prop:{d:0,a:0,b:false,c:0},
init() {
this.amount = 60
this.prop={d:0,a:0,b:false,c:32}
gi(0.5,[],120,3)
},
time:25,
run() {
if (pfr % 120 === 0) {
bullet({
    speed: 3,
    color: "000000",
    rd:0,
    w: 16,
    h: 16, 
    type: "gummy",
    y: 0,
    x: players[0].x,
    angle: dtr(90),
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer % 30 !== 0) return;
circle((ev) => {
bullet({
    speed:0.5,
color:"FF00DD",
rd:1,
w:16,
h:16,
type:"star",
y:this.y,
x:this.x,
angle:dtr(ev.deg),
setlist:[{f:6,e:1.5}],
custom:2,
fnlist:[{f:0,loop:true,fn:function() {
    if (this.custom > 1) {
    const it = reverse(this)
if (it) this.custom -= 1
    }
}}]
})
},{count:8})}}]
})
}
}
    
}
functions.push(spell27)
const spell28 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"獄界剣「二百倶盧舎の一閃｣",
desc:"残機は2です。",
nm:"妖々夢にハマって作りましたね〜これは再現度高いんじゃ？難易度の調整には近代スペル自信ある。",
dif:"n",
hint:"レーザーの上行ってもいいけど邪道プレイとみなします。",
ct:"どう？万人受けになってると思います。元々は37秒でしたがこのテキスト執筆中に反省して32sにしました。37sでもクリアしてるから文句は言わせない。意図的に難易度下げるの、大事。",
//自機狙い弾
//全方位レーザー、上からバラマキ
amount:10,
prop:{d:0,a:0,b:false,c:0},
init() {
this.amount = 60
this.prop={d:0,a:0,b:false,c:32}
gi(0.5,[],120,2)
},
time:32,
run() {
if (pfr % 240 === 0) {
bullet({
    speed: 120,
    color: "FF007B",
    rd:1,
    w: 32,
    h: 32, 
    type: "laser",
    y: Half.y + 130,
    x: 0,
    angle: 0,
})}
const cyc = pfr % 360
if (cyc > 180) {
bullets.map((e) => {
if (e.type !== "laser"){
e.color = "FFFFFF"
e.speed = 0.5
}
})
} else {
    bullets.map((e) => {
if (e.type !== "laser") {
e.color = e.custom.c
e.speed = e.custom.s}
})
}
if (pfr % 60 === 0 || pfr === 3) {
this.prop.d += 1
for (let i = 0 ;i < 1;i++) {
const b = this.prop.d % 3 === 0 && i === 0
wait(() =>{ 
circle((ev) =>{
wait(() => {
bullet({
    speed: 1.5,
    color: "BD52AF",
    rd:1,
    w: 32,
    h: 32, 
    type: "big",
    y: 0,
    x: Half.x + ev.i,
    angle: dtr(ev.deg),
custom:{r:Math.random(),b:b,s:1.5,c:"BD52AF"},
fnlist:[{f:0,loop:true,fn:function() {
if (pfr % 60 !== 0) return;
if (!this.custom.b) return;
if (this.custom.r > 0) {
this.custom.b = false
for (let i = 0;i < 10;i++) {
const Random = Math.random() > 0.75
const Size = Random ? 32 : 8
const type = Random ? "big" : "normal"
const rd   = Random ? 0.7 : 1
if (Math.random() < 0.015)this.deleteFrame = 0;
bullet({
speed:0.5,
color:"F94953",
rd:rd,
w:Size,
h:Size,
type:type,
x:this.x,
y:this.y,
angle:dtr(random(-180,180)),
custom:{s:1.5,c:"F94953"},
setlist:[{f:12,e:1.5}],
/*setlist:[{f:0,loop:true,e:function() {
return Math.max(0.5,this.speed - 0.01)
}},{f:90,loop:true,e:function() {
    return Math.min(this.speed + 0.01,1.5)
}}],
*/
fnlist:[{f:90,fn:function() {
    //this.angle = -this.angle
}}]
})
}
}}}]
})
},ev.i*4)
},{count:54})
},i*30)
    
}}
}}
functions.push(spell28)
const spell29 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"大合葬「霊車コンチェルトグロッソ」",
desc:"",
hint:"",
nm:"これは完成当時かなりウキウキ！めちゃくちゃいい感じだよ。自機狙いの新しい使い方を模索するのは楽しい。珍しいのに面白いものが完成します。",
dif:"h",
ct:"反射自機狙い弾は珍しいんじゃないかな？結構いい感じだと思う。",
//自機狙い弾
//全方位レーザー、上からバラマキ
amount:10,
prop:{d:0,a:0,b:false,c:0},
init() {
this.amount = 60
this.prop={d:0,a:0,b:false,c:32}
gi(0.5,[],120,3)
},
time:20,
run() {
if (pfr % 60 === 0 || pfr === 3) {
circle((ev) =>{
bullet({
    speed: 1.5,
    color: "BD52AF",
    rd:1,
    w: 24,
    h: 24, 
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg),
custom:{r:Math.random(),s:1.5,c:"BD52AF"},
fnlist:[{f:0,loop:true,fn:function() {
    const w = reverse(this)
if (w) this.angle = pf(this.x,this.y) 
}}]
})
},{count:8})
}}}
functions.push(spell29)
const spell30 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"塞符｢迫り来る波｣",
desc:"残機は1です。",
hint:"",
nm:"このスペカ、強制ノーミスなんだよねw。ct:難易度はまあまあかなw個人的に気に入ってる絶望感は高いと思うけど固定弾なのと端で避けるだけなのですぐ終わるw30の大台の割には微妙な気もします😅<元の説明文。",
ct:"難易度はまあまあかなw個人的に気に入ってる絶望感は高いと思うけど固定弾なのと端で避けるだけなのですぐ終わるw30の大台の割には微妙な気もします😅",
//自機狙い弾
//全方位レーザー、上からバラマキ
amount:10,
prop:{d:0,a:0,b:false,c:0},
init() {
this.amount = 60
this.prop={d:0,a:0,b:false,c:32}
gi(0.5,[],120,1)
},
time:10,
run() {
if (pfr % 15 === 0 || pfr === 3) {
this.prop.a += 36
circle((ev) =>{
wait(() => {

bullet({
    speed: 1.5,
    color: "BD52AF",
    rd:1,
    w: 24,
    h: 24, 
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg+normal(this.prop.a,60,120)),
custom:{r:Math.random(),s:1.5,c:"BD52AF"},
})
bullet({
    speed: 0.47,
    color: "BD52AF",
    rd:1,
    w: 24,
    h: 24, 
    type: "big",
    y: Half.y,
    x: Half.x,
    angle: -dtr(ev.deg+normal(this.prop.a,60,120)),
custom:{r:Math.random(),s:1.5,c:"BD52AF"},
})
},ev.i)
    },{count:36})
}}}
functions.push(spell30)
const spell31 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"天空剣｢十文字斬り｣",
desc:"",
hint:"",
nm:"これは友達の斬撃スペカに30分苦戦させられた挙句クリアできなくてゴミスペカすぎてあまりの怒りに作ったもの。難易度調整は大事。クリアも自分でしましょう。",
dif:"h",
ct:"全方位弾+十字自機狙いレーザーの組み合わせ。悪くないと思う",
//自機狙い弾
//全方位レーザー、上からバラマキ
amount:10,
prop:{d:0,a:0,b:false,c:0},
init() {
this.amount = 60
this.prop={d:0,a:0,b:false,c:32}
gi(0.5,[],120,3)
},
time:30,
run() {
this.prop.a += 3
if (pfr % 60 === 0 || pfr === 3) {
circle((ev) => {
wait(() => {bullet({
    speed: 0.5,
    color: "BD52AF",
    rd:1,
    w: 24,
    h: 24, 
    type: "scale",
    y: Half.y,
    x:Half.x,
    angle: dtr(ev.deg+this.prop.a),
setlist:[{f:12,e:3}]
})
},ev.i*1.4)},{count:18})



bullet({
    speed: 150,
    color: "BD52AF",
    rd:1,
    w: 24,
    h: 24, 
    type: "laser",
    y: 0,
    x:players[0].x,
    angle: dtr(90),
deleteFrame:300,
})
bullet({
    speed: 150,
    color: "BD52AF",
    rd:1,
    w: 24,
    h: 24, 
    type: "laser",
    y: players[0].y,
    x: 0,
    angle: dtr(0),
deleteFrame:300,
})
}}}
functions.push(spell31)
const spell32 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"蟲符｢弾幕の蝗害｣",
nm:"このスペカ作った翌日に家にバッタきてビビった。虫は大の苦手なもんで;;これはかなり気に入ってる。シンプルながら難易度、見た目両立できたんじゃない？",
dif:"h",
desc:"",
hint:"",
ct:"はい。バッタです。てかこれ弾幕を打つコマンドはひとつしかないしなんなら条件を15Fに1回弾を打つだけです。これでもここまでそれっぽい弾幕は作れるんですね〜w",
//自機狙い弾
//全方位レーザー、上からバラマキ
amount:10,
prop:{d:0,a:0,b:false,c:0},
init() {
this.amount = 60
this.prop={d:0,a:0,b:false,c:32}
gi(0.5,[],120,3)
},
time:30,
run() {
this.prop.a += 3
if (pfr % 15 === 0 || pfr === 3) {
bullet({
    speed: 3,
    color: "012900",
    rd:1,
    w: 24,
    h: 24, 
    type: "scale",
    y: Half.y + random(-100,100),
    x: Half.x+random(-100,100),
    angle: dtr(random(-180,180)),
fnlist:[{f:0,loop:true,fn:function() {
reverse(this)
    if (pfr % 240 === 0) this.angle = pf(this.x,this.y)
}}]
})
}}}
functions.push(spell32)
const spell33 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"人史剣｢一閃桔梗紋｣",
desc:"",
hint:"",
nm:"てか、このスペカはめちゃくちゃ不満がある。いい感じにはなったけど。元々斬撃！からの弾幕ーが好きで妖童餓鬼の断食みたいなのを作ろうと思ってたけどこれまた苦戦しまして;;結局一念ナンタラみたいな妖々夢6面道中のあれに似てる。",
dif:"l",
ct:"桔梗紋(ききょうもん)とは、みんなが家紋と聞いて思い浮かぶ❁︎<こんな感じの花の紋章。花っぽい配色と形なので。結構ムズいきがする",
//自機狙い弾
//全方位レーザー、上からバラマキ
amount:10,
prop:{d:0,a:0,b:false,c:0},
init() {
this.amount = 60
this.prop={d:0,a:0,b:false,c:32}
gi(0.5,[],120,3)
},
time:25,
run() {
this.prop.a += 3
if (pfr === 120) {
    bullet({
    speed: 150,
    color: "9700FF",
    rd:1,
    w: 24,
    h: 24, 
    type: "laser",
    y: 0,
    x: Half.x,
    angle: dtr(90),
})
    bullet({
    speed: 150,
    color: "9700FF",
    rd:1,
    w: 24,
    h: 24, 
    type: "laser",
    y: Half.y,
    x: 0,
    angle: dtr(0),
})
}
const time = pfr > 600 ? 30 : 60
if (pfr % time === 0) {
    bullets.forEach((e) => {
if (e.type === "scale") e.speed = 2.5
})}
if (pfr % 24 && pfr > 270) {
const c = Math.random() > 0.5 ? "F8CEFF" : "CEFFD0"
bullet({
    speed: 0,
    color:c,
    rd:1,
    w: 24,
    h: 24, 
    type: "scale",
    y: Half.y,
    x: Half.x,
    angle: dtr(random(-180,180)),
custom:Math.random() > 0.5,
fnlist:[{f:0,loop:true,fn:function() {
if (this.custom)reverse(this)
if (this.timer > this.deleteFrame - 30) this.color = "E7008C"
}}],
deleteFrame:180,
})
}}}
functions.push(spell33)
const spell34 = {
name:"妖精｢春の吹雪｣",
desc:"",
hint:"",
dif:"h",
nm:"これは反魂蝶見て思いついた。あの左右にある回転するレーザーね。動かない玉を両方において発射体とするのは紅魔郷4/Exの本に似てるかな？気合い避け100%。是非",
ct:"テーマはいいんだけどほんとに名前に困った(笑)個人的にめちゃくちゃ気に入ってる。気に入りすぎて結構ムズくしてしまったのは後悔してる",
list:[],
prop:{n:0,hue:0},
init() {
this.prop = {n:0, hue:0}
gi(1)
},
time:30,
run() {
if (pfr === 3) {
const poslist = [{x:-80,y:0,i:15,r:{min:0.5,max:6}},{x:80,y:0,i:75,r:{min:1.5,max:4.5}},{x:120,y:15,i:92,r:{min:0.15,max:7.4}},{x:-120,y:15,i:32,r:{min:2,max:3}}]
for (const pos of poslist) {
const y = entity.y + pos.y
const x = entity.x + pos.x
    bullet({
            speed: 0,
            color: "FF0016",
            w: 32,
            h: 32,
            type: "om",
            x: x,
            y: y,
            angle: pf(x, y),
custom:{c:pos.i,i:pos.r},
fnlist:[{f:0,loop:true,fn:function() {
if (pfr % 30 === 0) {
    this.custom.c += random(this.custom.i.min,this.custom.i.max)
circle((ev) => {
    bullet({
            speed: 0.6,
            color: "26BBFF",
            w: 16,
            h: 16,
            type: "normal",
            x: this.x,
            y: this.y,
            angle: dtr(ev.deg+this.custom.c),
setlist:[{f:12,e:1.7}]
})},{count:27})
}
}}]
        });
    }
}
}
}
functions.push(spell34)