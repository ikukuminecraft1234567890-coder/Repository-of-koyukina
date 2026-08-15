import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half,entitys,spelln,start,player,internal} from './sys.js';
import {stat,gameLoop} from "./engine.js"
import {bullet,Bullet,CC} from "./bc.js"

import {
dtr,intern,nextTaskId,wait,random,fr,ondebug,sp,sd,fs,itraw,it,gi,normal,circle,reverse,pf,square,triangle,spiral,gspiral
,keep,ccolor,ns,seed,arc,smooth,smoothSet,getArea,pfneo,VSpawn} from "./bullet.js"
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
const spell35 = {
name:"罠符｢設置型妖怪バスター｣",
desc:"残機は2です。",
hint:"",
dif:"h",
nm:"このスペカは割と悪くないかな。でもクリアしやす過ぎるかなと。思いまして！？残機を2に変えました！",
ct:"起きた直後に思いついたスペル。割とムズいんじゃない？",
list:[],
prop:{n:0,hue:0},
init() {
this.prop = {n:0, hue:0}
gi(1,[],120,2)
},
time:29,
run() {
if (pfr%15===0) {
const x = random(0,canvas.w)
    bullet({
            speed: 1.5,
            color: "FF0016",
            w: 16,
            h: 16,
            type: "om",
            x: x,
            y: 0,
            angle: pf(x,0),
custom:{b:true,size1:16,size2:32},
fnlist:[{f:0,loop:true,fn:function() {
reverse(this)
if (pfr % 60 === 0) {
this.custom.b = !this.custom.b
if (this.custom.b) {
this.w = this.custom.size1
this.h = this.custom.size1
this.radius = this.w / 2
} else {
this.w = this.custom.size2
this.h = this.custom.size2
this.radius = this.w / 2
}
}}}]
        })
    }
}
}
functions.push(spell35)

const spell36 = {
name:"銀忌「インフォメーション・パラドックス」",
desc:"",
hint:"",
dif:"l",
nm:"案外コツ掴むと簡単でした。かなりムズいかも？",
ct:"めちゃくちゃオシャレ。完全パターンスペカ。なお時間発狂ありw 抜ける位置を覚えると行けます。36sなのはナンバー揃えじゃなくて普通にラストを左右下で耐えるのを阻止するため。",
list:[],
prop:{n:0,hue:0},
init() {
this.prop = {n:0, hue:0,a:0}
gi(1,[],120,3)
},
time:36,
run() {
const cyc = 1
if (cyc > 0 && cyc < 240) {
if (pfr % 120 === 0) this.prop.a += 32
if (pfr%15===0) {
this.prop.n += 5
const x = Half.x
let a = 0;
circle((ev) => {
wait(() =>{
bullet({
            speed: 1.5,
            color: "FF0016",
            w: 16,
            h: 16,
            type: "normal",
            x: x,
            y: Half.y,
            angle: dtr(ev.deg+this.prop.a),
custom:{n:this.prop.n,i:ev.i},
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer === (120 + this.custom.n + this.custom.i / 10)) this.speed = 0
if (pfr % 240 === 0) {
this.speed = 1.5
this.angle = -this.angle
}
        }}]
    
})
    },ev.i)},{count:72})
}
}}}
functions.push(spell36)
const spell37 = {
name:"棘符｢侵食する棘植物｣",
desc:"",
hint:"",
dif:"h",
nm:"この辺はネタ切れが酷いけど耐えます。元々は低難易度のつもりだったけど思ったよりむずくなっちゃったヤツ",
ct:"めちゃくちゃ困ってる。この辺からネタ切れが酷いので全方位停止弾二連続wﾀｽｹﾃｰ＞-＜",
list:[],
prop:{n:0,hue:0},
init() {
this.prop = {n:0, hue:0,a:0}
gi(0.35,[],120,3)
},
time:30,
run() {
if (pfr%45===0) {
this.prop.a += 5
const x = Half.x
let a = 0;
circle((ev) => {
wait(() =>{
bullet({
            speed: 1.5,
            color: "FF0016",
            w: 16,
            h: 16,
            type: "knife",
            x: x,
            y: Half.y,
            angle: dtr(ev.deg+this.prop.a),
setlist:[{f:60,e:0},{f:180,e:0.95},{f:340,e:0},{f:420,e:0.1}],
fnlist:[{f:0,loop:true,fn:function() {
/*
if (this.timer === 60) this.speed = 0;
if (this.timer === 180) this.speed = 1.5
*/
if (this.timer===360) this.angle = -this.angle
if (this.timer > 120 && this.timer <=360) this.angle += dtr((36/60)/2)
        }}]
    
})
    },ev.i)},{count:72})
}
}}
functions.push(spell37)
const spell38 = {
name:"真実｢バミューダトライアングル｣",
desc:"無敵時間は120 > 180フレームになり、残機は3>5です。",
hint:"",
dif:"l",
nm:"難易度は高いかな？個人的にスカーレットシュートの名を借りてる割には感あるww今度いい感じの作ります！🫡と思ったけど製作中に変えた。これここ見れてる人いるの？",
ct:"名前三回くらい変更した。スカーレットシュートインスパイアです。このテキスト書いたあとに4回くらいスペカ変更したw",
list:[],
prop:{n:0,hue:0},
init() {
this.prop = {n:0, hue:0,a:0}
gi(0.35,[],180,5)
},
time:60,
run() {
if (pfr > 2300) return;
if (pfr%1200===0||pfr===1) {
this.prop.n += 3
const x = Half.x
triangle((ev) => {
wait(() => {
bullet({
            speed: 2,
            color: "FF0016",
            w: 24,
            h: 24,
            type: "knife",
            x: x+ev.x,
            y: Half.y+ev.y,
            angle: dtr(ev.deg),
custom:true,
deleteFrame:800,
fnlist:[{f:0,loop:true,fn:function() {
reverse(this)
if (this.timer === 30) this.speed = 0;
if (pfr % 120 === 0 && this.custom) {
this.custom = false
wait(()=>{this.angle += dtr(random(-30,30))},30)
}
if (!this.custom && this.timer === 240) {

//this.angle = dtr(random(-180,180))
}
if (this.timer > 240 && !this.custom && pfr % 60 === 0 && this.timer < 300e30) {
this.speed = 2
const is = Math.random() < 0.1
const type = is ? "big" : "normal"
const size = is ? 24 : 8
   bullet({
            speed: 0.75,
            color: "FF0016",
            w: size,
            h: size,
            type: type,
            x: this.x+random(-15,15),
            y: this.y+random(-15,15),
            angle: -this.angle,
custom:3,
fnlist:[{f:0,loop:true,fn:function() {
if (this.custom <= 0) return;
    const s = reverse(this)
if (s) this.custom -= 1
}}]
})
}
    
}}]
})
    },ev.i/10)},{dist:30,count:18+this.prop.n})
}
}}
functions.push(spell38)
const spell39 = {
name:"想起｢封魔陣｣",
desc:"",
hint:"完全固定。1回目の正方形、2回目の円形になるやつは3回目以降も配置同じ。",
dif:"n",
nm:"おめでとうw完全固定とはいえムズいはムズいので普通によく行けましたね",
ct:"個人的に自信ある。完全固定弾のパターン弾幕。研究したらすぐだと思う。なんならノーミスも現実的",
list:[],
prop:{n:0,hue:0},
init() {
this.prop = {n:0, hue:0,a:0}
gi(0.5,[],120,3)
},
time:60,
run() {
if (pfr===1 || pfr % 1200 === 0) {
const x = Half.x
const y = Half.y
bullet({
rd:1,
speed: 0,
            color: "276BB0",
            w: 128,
            h: 128,
            type: "big",
            x: x,
            y: y,
            angle: dtr(0),
})
square((ev) => {
const loc = {x:x+ev.x,y:y+ev.y}
console.log(loc)
bullet({
            speed: 1.5,
            color: "FF0016",
            w: 12,
            h: 12,
            type: "amulet",
            x: loc.x,
            y: loc.y,
            angle: dtr(ev.deg+this.prop.a),
deleteFrame:1200,
fnlist:[{f:0,loop:true,fn:function() {
this.angle += dtr(0.05)
const bool = keep(this)
if (bool) {this.speed = 0;}
if (this.timer === 120 || pfr % 480 === 0) {
this.speed=1.5
this.angle += dtr(180)
}
}}]
})
},{dist:50,count:27,startDeg:45})
this.prop.a += 90

}
}}
functions.push(spell39)
const spell40 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"QED｢495年の波紋｣",
dif:"p",
desc:"",
hint:"",
nm:"圧倒的気合い弾幕。配置によっては詰む！なんだかんだ時間発狂に頼ってる気がする;;成長したのかしてないのか...",
ct:"Phとは名だけwまあそもそも実力Phの弾幕が今ないんですがw(まず実力Phの弾幕あってもテストプレイでクリアできない;;)さてとうとう40スペカ目。これは元々負荷テスト用の奴だったんですが魔改造してバランスを良くしました。旧作は20スペカなので二倍のボリューム！w難易度も比較的高いかな",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(1)
},
time:40,
run() {
this.prop.a += 1/180
const time = 300 / this.prop.a
if (pfr % Math.floor(time) === 0) {
for (let i = 0;i<150;i++)bullet({
    speed:random(1.5,6.5), // スピード5
    color:"9C27B0", 
    w: 8,
    h: 8, 
    type: "normal",
    y: 0,
    x: Half.x,
    angle: dtr(Math.random() * 360)
})
}}}
functions.push(spell40)
const spell41 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"移符｢水切り波紋｣",
dif:"h",
desc:"",
hint:"",
nm:"よく行けたね？理不尽要素強いのに‼",
ct:"理不尽を感じる。最初は当たり判定無くすか予告見えた方が良かったかも",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(1)
},
time:20,
run() {
if (pfr % 120 === 0) {
for (let i = 0;i<2;i++) {
const x = random(0,canvas.w)
const y = random(0,canvas.h)
bullet({
    speed:0, // スピード5
    color:"9C27B0", 
    w: 24,
    h: 24, 
    type: "om",
    y: y,
    x: x,
    angle: 0,
deleteFrame:60,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer % 20 !== 0) return;
const ran = random(-50,50)
circle((ev) => {
bullet({
    speed:2.5, // スピード5
    color:"FF2253", 
    w: 16,
    h: 16, 
    type: "amulet",
    y: this.y,
    x: this.x,
    angle: dtr(ev.deg+ran),
})},{count:36})
}}]
})
}}}}
functions.push(spell41)
const spell42 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"夢想封印・散",
dif:"n",
desc:"",
hint:"",
nm:"もうちょいむずくしたかった。ただ万人受けするのはこういうものなのかな？と;;むずくすればいいものではないと理解している。",
ct:"簡単すぎるかなwノーミス目指してくれせめて;;",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(1)
},
time:20,
run() {
if (pfr % 4 === 0) {
const color = ["FF0037","FF0037",ccolor(255,255,255)][Math.floor(Math.random()*3)]
bullet({
    speed:1.5+random(-0.25,0.25), // スピード5
    color:color, 
    w: 16,
    h: 16, 
    type: "om",
    y: 0,
    x: random(0,canvas.w),
    angle: dtr(90+random(-45,45)),
})}
if (pfr % 42 === 0 || pfr === 1) {
const x = Half.x;
const y = (Half.y - 30) - 30
for (let i = 1;i<=75;i++) {
const real = Math.min(i,60)
const ly = y - random(0,real*1.5)
const lx = x + random(-10,10)
const base = pf(lx,ly)
const Rawspeed = i ** 0.4
const speed = i > 59 ? Rawspeed * 0.5:Rawspeed
const angle = base + dtr(random(-15,15))
const color = ["FF0037","FF0037",ccolor(255,255,255)][Math.floor(Math.random()*3)]
const WTT = real/2
wait(() => {
bullet({
    speed:0.5, // スピード5
    color:color, 
    w: 16,
    h: 16, 
    type: "amulet",
    y: ly,
    x: lx,
    angle: angle,
setlist:[{f:12,e:speed}],
})},WTT)
}}
}}
functions.push(spell42)
const spell43 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"禁忌｢決定論的カオス｣",
dif:"h",
desc:"",
hint:"",
nm:"PRNG(シード式乱数)はAIに書かせましたわよ。これはかなり気に入ってる。楽しいよこれ！",
ct:"決定論的カオスとはこれの場合何が出るかは確定してるのに次の値が予測不可能なこと。(大雑把)この弾幕の赤弾は実際に固定弾です。でも一見ランダム。パターン化が可能なランダムっていう強みですね〜",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(1)
},
time:30,
run() {
if (pfr % 120 === 0 || pfr === 1) {
for (let count = 1;count<=3;count++) {
wait(() => {
for (let i = 1;i<=4;i++) {
const x = Half.x;
const y = Half.y
const base = pf(x,y)
const speed = 7.5 / (Math.max(1,(i/2)))
const angle = pf(x,y)
const color = "00FFEE"
circle((ev) => {bullet({
    speed:0.5, // スピード5
    color:color, 
    w: 16,
    h: 16, 
    type: "diamond",
    y: y,
    x: x,
    angle: angle+dtr(ev.deg),
setlist:[{f:12,e:speed}],
})
},{count:12})
}
},count*30)
}}
if (pfr % 15 === 0) {
    this.prop.a += 1
if (true) {
circle((ev) => {
const x = Half.x;
const y = 30;
const speed = Math.max(ev.i / 20,1.5) 
const color = "FF0018"
const angle = seed(-180,180,this.prop.a+ev.i*1000)
bullet({
    speed:0.5, // スピード5
    color:color, 
    w: 16,
    h: 16, 
    type: "diamond",
    y: y,
    x: x,
    angle: angle+dtr(ev.deg),
setlist:[{f:12,e:1.5}],
})
},{count:108})}
}
}}
functions.push(spell43)
const spell44 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"覚神「神代の記憶｣ ＆ 鈴仙・優曇華院・イナバ",
dif:"h",
desc:"",
hint:"",
nm:"綺麗？なのか？まあいいw個人的にはもうちょい詰めたかったね..実力がね、うんw",
ct:"難易度は普通に最近自分でも分からなくてHardが多い。異論求む",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(1)
},
time:40,
run() {
if (pfr % 15 === 0) {
this.prop.s = !this.prop.s;
const speed = pfr > 1200 ? (this.prop.s ? 6.5 : 3.5) : 1.5
    this.prop.a += 1
if (pfr === 1200) bullets.length = 0
if (true) {
circle((ev) => {
const x = Half.x;
const y = 30;
const color = "FF0018"
const angle = seed(-180,180,this.prop.a+ev.i*1000)
const tempo = speed > 1.5 ? (speed > 3.5 ? 3 : 2) : 1
if (ev.i % tempo === 0)bullet({
    speed:0.5, // スピード5
    color:color, 
    w: 16,
    h: 16, 
    type: "diamond",
    y: y,
    x: x,
    angle: angle+dtr(ev.deg),
setlist:[{f:12,e:speed}],
})
},{count:144})}
}
}}
functions.push(spell44)

const spell45 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "禁術｢不夜城レッド｣",
dif:"p",
desc:"",
hint:"安置やそれらしいトリックは一切ありません。ガチ気合い。",
nm:"",
ct:"ガチファンタズム。幾度もの弱体化をして尚最難関。",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(0.5)
},
time:36,
run() {
if (pfr === 1) {
bullet({
    speed:9, // スピード5
    color:"", 
    w: 16,
    h: 16, 
    type: "big",
    y: 0,
    x: Half.x,
    angle: dtr(90),
custom:0,
fnlist:[{
    f:0,loop:true,fn:function() {
this.custom+= 1
if (reverse(this)) {
this.speed += 0.5
circle((ev) => {
const ra = random(-45,45)
bullet({
    speed:1, // スピード5
    color:"FF0300", 
    w: 24,
    h: 24, 
    type: "big",
    y: this.y+random(-15,-30),
    x: this.x+random(-15,15),
    angle: dtr(ev.deg+ra),
custom:{t:0,b:2},
fnlist:[{
loop:true,fn:function() {
this.custom.t+=1
if (this.custom.t < 30)this.speed += 0.0666
if (this.custom.b > 0) {const a = reverse(this)
if (a) {
this.speed = 1
this.custom.t = 0;
    this.custom.b -= 1
}}
},f:0}],
})},{count:5})
}}}]
})
}
}}
functions.push(spell45)
const spell46 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "夢符｢封魔陣｣",
dif:"n",
desc:"",
hint:"完全固定。",
nm:"えぐ！！初動の難易度高いからよく行けたねww",
ct:"私のスペルと言えば(？)の究極気合い避け弾幕ですわよ〜個人的に気に入ってる。封魔陣感は出せてないかも",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(0.5)
},
time:10,
run() {
const cyc = pfr % 240
if (pfr % 6 === 0) {
this.prop.a += 5
const x = Half.x;
const y = Half.y - 60;
circle((ev) => {
wait(() => {bullet({
    speed:1, // スピード5
    color:["FF0037","002AFF"][Math.floor(Math.random()*2)], 
    w: 16,
    h: 16, 
    type: "big",
    y: y,
    x: x,
    angle: dtr(ev.deg+normal(-180,180,this.prop.a)),
setlist:[{f:18,e:3.5}],
custom:0
})},ev.i/5)},{count:54})
}}}
functions.push(spell46)
const spell47 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "秘封｢月の妖鳥、化け猫の幻｣",
dif:"n",
desc:"",
hint:"スマホ推奨。(高速移動必須)",
nm:"どう？！妖鳥(鳥)はaiフル使用;;イメージ画は妹紅のほうおうてんしょーです。上手くいったんじゃない？さすClaude。",
ct:"地味に難易度が低い。化け猫の幻は上手く思いつかなかった。",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1},
init() {
this.speed = 1
this.prop.s=true,this.prop.a=1
gi(0.5)
pfr = 739
},
time:30,
run() {
const cyc = pfr % 240

if (pfr % 360 === 0) {
const a = Math.random() > 0.5

for (let i =0;i<3;i++) {
const c = a ? "FF6500" : "0063FF"
bullet({
            speed: 60,
            color: c,
            w:16, h: 16,
            type: "laser",
            y: 0,
            x: random(0,canvas.w),
            angle: dtr(90),
deleteFrame:240,
custom:a,
fnlist:[{f:0,loop:true,fn:function() {
const d = 7.5
const ang = this.custom ? -dtr(1.5/d) : dtr(1.5/d)
    if (this.timer > 120 && this.timer < 180) this.angle += ang
}}],
        });
}}
if (pfr === 1) {
bullet({
    speed:0, // スピード5
    color:"FDD73B", 
    w: 128,
    h: 128, 
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: 0,
custom:0,
fnlist:[{f:0,loop:true,fn:function() {
    // ① 軸：まっすぐ下に伸びる弾の列
if (this.timer % 30 !== 0) return;
this.custom += 12
const color = "FF0037"
const type = "scale"
const size = 16
const ins = 1
circle((ev) => {
    const angle = ev.deg + this.custom;
    const rad = dtr(90 + angle);
    const moveSpeed = 3;
    const dx = Math.cos(rad);
    const dy = Math.sin(rad);

    const arrowBullets = [];

    // ① 軸（長さを1/3の50に変更、間隔も詰めて弾数を保つ）
    const shaftLength = 60; // 元は150
    for (let i = 0; i < shaftLength; i += 6) { // 12→6にして密度キープ
        const b = bullet({
            speed: ins,
            color: color,
            w: size, h: size,
            type: type,
            y: this.y + dy * i,
            x: this.x + dx * i,
            angle: rad,
        });
        arrowBullets.push(b);
    }

    // ② 鳥の翼：先端を起点に、外翼・内翼の二重V字を左右対称に生やす
    const tipX = this.x + dx * shaftLength;
    const tipY = this.y + dy * shaftLength;

    const wings = [
        { spread: 55, length: 100, count: 8, offset: 0 },     // 外翼
        { spread: 35, length: 70, count: 6, offset: 15 },     // 内翼
    ];

    for (const wing of wings) {
        for (let side = -1; side <= 1; side += 2) {
            const wingRad = dtr(90 + angle + 180 + side * wing.spread);
            const wdx = Math.cos(wingRad);
            const wdy = Math.sin(wingRad);

            for (let k = 0; k < wing.count; k++) {
                const t = k / (wing.count - 1);
                const dist = wing.offset + t * wing.length;

                const b = bullet({
                    speed: ins,
                    color: color,
                    w: size, h: size,
                    type: type,
                    x: tipX + wdx * dist,
                    y: tipY + wdy * dist,
                    angle: rad,
                });
                arrowBullets.push(b);
            }
        }
    }

    // ③ 一斉始動
for (let ii =0;ii<60;ii++)wait(() => {
      arrowBullets.forEach((b) => {
            if (!b) return;
            b.speed += 0.05
            b.angle = rad;
        });
},ii)
}, {count: 4});

    
}}]
})
}}}
functions.push(spell47)
const spell48 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "紙符｢射命丸式投函｣",
dif:"n",
desc:"",
hint:"",
nm:"いいねwこの辺は難易度が低いかな？でもこんくらいが楽しめるっしょわら",
ct:"これはスペル47作ってたらいい感じの生まれたので単独にしたヤツ。気に入ってる",
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

if (pfr % 12 === 0) {
for (let i =0;i<30;i++) {
const ph = Math.random() < 0.5
bullet({
            speed: 1.5,
            color: "FF6500",
            w:16, h: 16,
            type: "amulet",
            y: random(0,canvas.h),
            x: 0,
            angle: dtr(random(-180,180)),
custom:random(120,240),
fnlist:[{f:0,loop:true,fn:function() {
    if (this.timer > this.custom && this.timer < this.custom + 30) this.angle += dtr(1.5)
}}],
        });
}}


}}
functions.push(spell48)
const spell49 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "錦符｢記憶の深海に沈む少女-Phantasm-｣",
dif:"p",
desc:"",
hint:"3ウェーブ目は3パターンありますがパターンさえ引けば完全固定弾。",
nm:"❓❓❓❓❓❓❓❓❓❓まじで何をしたらそうなったの！？！？一応これほぼ最難関なんですけど..緑地帯もよくNM行けたねと言いたいけどラストはどうしたの！？！？ガチで教えてくれ",
ct:"30Sにも及ぶ猛攻スペル。もちろんクリアチェック済ませてる。ラストはまじで終わってる。多分ノーミス不可能(笑)",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},pyramid:0,},
init() {
const initSeedMap = [999,356,124]
const initSeed = initSeedMap[Math.floor(Math.random() * initSeedMap.length)]
this.speed = 1
this.prop.s=true,this.prop.a=1,this.prop.rng={s:initSeed},this.prop.pyramid=0;
gi(1.5)
},
time:30,
run() {
const x = Half.x;
const y = 80;
if (pfr % 1 === 0 && pfr > 60 && pfr < 180) {
this.prop.a += 1
for (let i =-9;i<9;i+=3) {
const base = pf(x,y,i*5)
bullet({
            speed: 3.5,
rd:0,
            color: "FF0001",
            w:16, h: 16,
            type: "normal",
            y: y,
            x: x,
            angle: random(normal(this.prop.a,-180,180),base),
setlist:[{f:20,e:5.5}]
        });
}

} else if (pfr > 180 && pfr < 300 && pfr % 3 === 0) {
const p = pf(x,y)
circle((ev) => {
bullet({
    speed: 4.5,
    color: "0080DB",
    rd:1,
    w: 48,
    h: 48, 
    type: "scale",
    y: y,
    x: x,
    angle: dtr(ev.deg) + p,
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納


})},{count:36})
} else if (pfr > 300 && pfr < 540 && pfr % 3 === 0) {
function spawnAmulet() {
for (let i = 0;i<30;i++) {
wait(() =>{
const nx = random(-15,15)
const p = pf(x,y)
bullet({
    speed: 5.5,
    color: "E8BD00",
    rd:1,
    w: 16,
    h: 16, 
    type: "amulet",
    y: y - i*2,
    x: x + nx,
    angle: p,
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納
})
},i/2)
}}
if (pfr % 30 === 0) spawnAmulet()
for (let i =0;i<15;i++) {
const nx = Math.random() > 0.5 ? 0 : canvas.w
const p = pf(nx,y)
bullet({

    speed: 4.5,
    color: "2CE800",
    rd:1,
    w: 24,
    h: 24, 
    type: "star",
    y: y,
    x: x,
    angle: p,
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納
})
if (Math.random() > 0.95) bullet({
speed: 4.5,
    color: "B800E8",
    rd:1,
    w: 16,
    h: 16, 
    type: "diamond",
    y: 0,
    x: nx,
    angle: p,
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納
})


}} else if (pfr > 540 && pfr < 740 && pfr % 1 === 0) {
this.prop.s += 10
if (pfr % 3 === 0) {
const nx = normal(this.prop.s,0,canvas.w)
const p = pf(nx,y)
circle((ev) => {
const v = seed(-5,5,this.prop.rng,{ns:true})
bullet({
    speed: 0.5,
    color: "00FF64",
    rd:1,
    w: 16,
    h: 16, 
    type: "star",
    y: y,
    x: nx,
    angle: dtr(ev.deg+v),
fnlist:[{f:0,loop:true,fn:function(){
if(this.timer === 60) this.speed = 4.5;
if(this.timer > 90 && this.speed > 2.5) this.speed -= 0.04}}],
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納


})},{count:20})
}} else if (pfr > 800 && pfr < 1280 && pfr % 1 === 0) {
if (pfr % 30 !== 0) return;
circle((ev) => {
this.prop.pyramid += 16
wait(() => {
for (let i = 0;i<10;i++) {
for (let way = -(i / 2);way<i / 2;way++) {
bullet({
    speed: 3.5 + (i/10),
    color: "FF00C3",
    rd:1,
    w: 16,
    h: 16, 
    type: "gummy",
    y: y,
    x: x+way*7.5,
    angle: dtr(ev.deg+this.prop.pyramid),
custom:{a:this.prop.pyramid+i,i:i*2},
})
}}
},ev.i * 5)
},{count:25})
} else if (pfr > 1340) {
if (pfr % 3 === 0) {
    
function spawnAmulet() {
for (let i = 0;i<15;i++) {
wait(() =>{
const nx = random(-15,15)
const p = pf(x,y)
bullet({
    speed: 5.5,
    color: "E8BD00",
    rd:1,
    w: 16,
    h: 16, 
    type: "amulet",
    y: y - i*2,
    x: x + nx,
    angle: p,
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納
})
},i/2)
}}
if (pfr % 30 === 0) spawnAmulet()
let is = 0;
for (let i =0;i<15;i++) {
const nx = Math.random() > 0.5 ? 0 : canvas.w
const p = pf(nx,y)
bullet({

    speed: 4.5,
    color: "FF1C48",
    rd:1,
    w: 24,
    h: 24, 
    type: "star",
    y: y,
    x: x,
    angle: p,
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納
})
if (Math.random() > 0.975) bullet({
speed: 3.5,
    color: "B800E8",
    rd:1,
    w: 16,
    h: 16, 
    type: "diamond",
    y: 0,
    x: nx,
    angle: p,
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納
})
}
}
    this.prop.s += 10
if (pfr % 3 === 0) {
const nx = normal(this.prop.s,0,canvas.w)
const p = pf(nx,y)
circle((ev) => {
const v = seed(-5,5,this.prop.rng,{ns:true})
bullet({
    speed: 0.5,
    color: "00FF64",
    rd:1,
    w: 16,
    h: 16, 
    type: "star",
    y: y,
    x: nx,
    angle: dtr(ev.deg+v),
fnlist:[{f:0,loop:true,fn:function(){
if(this.timer === 60) this.speed = 4.5;
if(this.timer > 90 && this.speed > 2.5) this.speed -= 0.04}}],
    // 各段階をそれぞれ1つのオブジェクトとして配列に格納


})},{count:8})
}
if (pfr % 30 === 0) {

circle((ev) => {
const c = ev.i % 2 === 0 ? "FF00C3" : "00B4FF"
this.prop.pyramid += 72
wait(() => {
for (let i = 0;i<10;i++) {
for (let way = -(i / 2);way<i / 2;way++) {
bullet({
    speed: 2.5 + (i/10),
    color: c,
    rd:1,
    w: 16,
    h: 16, 
    type: "gummy",
    y: y,
    x: x+way*7.5,
    angle: dtr(ev.deg+this.prop.pyramid),
custom:{a:this.prop.pyramid+i,i:i*2},
})
}}
},ev.i * 5)
},{count:8})
}
    
}}}
functions.push(spell49)
const spell50 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "虹符｢バレットトラッカー｣",
dif:"h",
desc:"",
hint:"",
nm:"おおwこれはめっちゃ気に入ってるけど難易度はうーんw初期位置自機狙い全方位<当たりスペカしかないw実は俺の中で34以降のスペカの影が謎に薄い。なんでかなwというよりかは作りすぎて10の価値が低くなってんのかな？あんまりにも難易度下げすぎた可能性もある。",
ct:"なんか眠い時ほどいいスペカ思いつく傾向にある？個人的にめちゃくちゃ気に行ってる。もうむずくしてもいいけど万人受けを意識🤩なんだかんだもう50スペカにもなってしまった〜あと30で旧作含め100になるwそう考えるとすごいなあ〜",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999}},
init() {
this.speed = 1
this.prop.s = true
this.prop.a=1;
this.prop.rng={s:999}
gi(0.5)
},
time:30,
run() {

if (pfr % 240 === 0 || pfr === 1) {
const x = Math.random() > 0.5 ? 0 : canvas.w
const y = Half.y - 30
const a = pf(x,y)
bullet({
            speed: 5.5,
rd:0,
            color: "FF6500",
            w:16, h: 16,
            type: "amulet",
            y: y,
            x: x,
            angle: a,
custom:this.prop.a,
fnlist:[{f:0,loop:true,fn:function() {
const c = "FF00B5"
if (this.timer % 6 === 0 && this.timer < 60) {
this.custom += 1
const nx = this.x + random(-30,30)
const ny = this.y + random(-30,30)
const colors = ["FF0028","FF6A00","FFE900","92FF00","00FF3F","00FFF8","0018FF","7F00FF","F800FF","FF004A"]
const color = colors[Math.floor(normal(this.custom,0,colors.length))]
const speed = random(-0.5,0.5)
const time = this.custom * 3 + 120
    circle((ev) => {
bullet({
    speed: 0,
    color: color,
    rd:1,
    w: 16,
    h: 16, 
    type: "pre",
    y: ny,
    x: nx,
    angle: dtr(ev.deg),
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer > time) {
this.rd=1.0
this.type = "gummy"
this.speed = 1.5+speed
}}}]
})
},{count:27})

}}}],

        });
}}


}
functions.push(spell50)
const spell51 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "獄符｢回転磔｣",
dif:"n",
desc:"",
hint:"完全パターン。",
nm:"新機能を使ったスペカ。名前はお気に入り。難易度は簡単だけど結構珍しいスペカじゃない？元々は回転中にバラマキ置こうと思ったけど難しすぎるかなと🥲",
ct:"作者がノーミスするくらいの難易度。特に難しくは無いけど、初見殺しは無駄に多い🤩",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null},
init() {
this.speed = 1
this.prop.s = true
this.prop.a=100;
this.prop.rng={s:999}
this.prop.loc = {x:Half.x,y:Half.y}
gi(5)
},
time:37,
run() {
if (pfr % 1 === 0 && pfr < 1450 && pfr > 60) {
this.prop.a -= 0.0625
const nloc = this.prop.loc
const t = pfr * 0.03;

const nx = this.prop.loc.x + Math.cos(t) * 100;
const ny = this.prop.loc.y + Math.sin(t) * 100;
    arc((ev) => {
bullet({
x:ev.x,
y:ev.y,
angle:dtr(ev.deg),
speed:5,
type:"normal",
color:"B02796",
})
},{x:nx,y:ny,length:this.prop.a,count:36})
}
if (pfr === 1500) {

for (let i = 0;i<3;i++) {
wait(() => {
const x = players[0].x
const y = players[0].y
const a = pf(x,y)
this.prop.a += 1
const value = this.prop
circle((ev) => {
bullet({
rd:0,
noAuto:true,
            speed: 1.5,
            color: "FF6500",
            w:48, h: 48,
            type: "big2",
            y: y,
            x: x,
            angle: dtr(ev.deg),
custom:{p:ev.i+value.a,v:ev.i % 18,xy:{x:0,y:0}},
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer === 15) this.rd = 1
    if (this.timer === 60) {
        this.custom.decel = true; // 減速開始
        if (this.custom.v) {
            this.rd = 0;
            this.color = "null";
        }
        const plus = this.custom.p / 4;
        this.speed = 4;
    }

    if (this.custom.decel) {
        this.speed -= 0.1;
        if (this.speed <= -1) {
            this.speed = -1;
            this.custom.decel = false; // ここで加速フェーズへ切り替え
        }
    } else if (this.timer > 60) {
        this.speed += 0.0045;
    }

    if (this.timer === 180) {
        if (this.custom.v) {
            this.rd = 1;
            this.color = "FF6500";
        }
    }

    this.w += 0.15;
    this.h += 0.15;
}}],

        });
},{count:72})},i*30)


}}}}
functions.push(spell51)
const spell52 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "視符｢予知回転ギロチン｣",
dif:"n",
desc:"",
hint:"完全パターン。",
nm:"なんだこの..なんだこれ？よく分からないけどめちゃくちゃムズいです。",
ct:"うおwどうやったの？",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null},
init() {
this.speed = 1
this.prop.s = true
this.prop.a=100;
this.prop.rng={s:999}
this.prop.loc = {x:Half.x,y:Half.y}
gi(1.5)
},
time:37,
run() {
if (pfr % 1 === 0 && pfr % 240 > 0 && pfr % 240 < 225) {
const b = this.prop.a += 0.5
circle((ev) => {
const x = Half.x;
const y = Half.y;
const base= pf(x,y)+dtr(b)
bullet({
    x:x,
y:y,
speed:6.5,
type:"diamond",
angle:dtr(ev.deg)+base,
color:"FF9500"
})},{count:4})

}}}
functions.push(spell52)
const spell53 = {
name: "AI符「双螺旋の花冠」",
dif:"h",
desc:"",
hint:"花弁は8方向対称。中心に寄りすぎると挟まれるので、花弁の隙間を追いかけるように螺旋状に動くと安定。",
nm:"ど、どわーWwwwwwwwww俺これいらん感じ？！まあいいわ、俺がこれからaiを越えるんだよ🤩🤩🤩",
ct:"aiに作らせた。試しにねwあれ、もしかしてこれ俺いらない感じ？ほな、また....",
prop:{a:0,b:0,dense:0},
init() {
this.prop = {a:0,b:0,dense:0}
gi(1)
},
time:35,
run() {
// 二重螺旋の花弁（回転しながら密度が徐々に上がる）
if (pfr % 20 === 0) {
this.prop.a += 6
this.prop.dense = Math.min(this.prop.dense + 1, 10)
const petals = 8
const perPetal = 3 + Math.floor(this.prop.dense / 3)
circle((ev) => {
for (let k = 0; k < perPetal; k++) {
const spread = k * 4
wait(() => {
bullet({
    speed: 1.3 + k * 0.15,
    color: "FF3D8A",
    w: 14, h: 14,
    type: "scale",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg + this.prop.a + spread),
setlist:[{f:40,e:2.2}]
})
bullet({
    speed: 1.3 + k * 0.15,
    color: "3DA8FF",
    w: 14, h: 14,
    type: "scale",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg - this.prop.a - spread),
setlist:[{f:40,e:2.2}]
})
}, k*3)
}
},{count:petals})
}

// 中心から伸びる自機狙いレーザー（間隔を保った警告→発射）
if (pfr % 90 === 0 && pfr > 150) {
this.prop.b += 1
const count = Math.min(2 + Math.floor(this.prop.b/2), 4)
for (let i = 0; i < count; i++) {
wait(() => {
const px = players[0].x
const py = players[0].y
const angle = pf(px, py)
bullet({
    speed: 150,
    color: "FFD400",
    w: 12, h: 999,
    type: "laser",
    y: Half.y,
    x: Half.x,
    angle: angle,
    deleteFrame: 200
})
}, i*18)
}
}

// 終盤、外周から薄い確認弾（避け道を可視化しつつ密度を足す）
if (pfr % 45 === 0 && pfr > 600) {
circle((ev) => {
bullet({
    speed: 1,
    color: "FFFFFF",
    w: 8, h: 8,
    type: "normal",
    y: Half.y,
    x: Half.x,
    angle: dtr(ev.deg),
setlist:[{f:60,e:2.5}]
})
},{count:24, startDeg: pfr})
}
}}
functions.push(spell53)
const spell54 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "幾学｢放射状弾幕の方程式｣",
dif:"n",
desc:"",
hint:"",
nm:"結構初期パターンから変えましたよと。個人的にそろそろノーミステキストの概念消すのもありではある(？)",
ct:"結構すき。安置変わるのいいね",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=100;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:35,
run() {
const xl = [50,canvas.w-50,Half.x]
const snap = this.prop.a
if (pfr % 60=== 0 || pfr === 1) {
const Target = dtr(random(-45,45))
for (let i = 0;i<300;i+=30) {

const SpawnX = xl[normal(this.prop.ol,0,3)]+random(0,0)
const SpawnY = Half.y - 30
this.prop.ol += 1
this.prop.a += 6
wait(() =>{
arc((ev) => {
const snapshot = Target
bullet({
rd:0.65,
    x:ev.x,
y:ev.y,
speed:0.5,
type:"simple",
angle:dtr(ev.deg+snap),
color:"00E1FF",
w:16,
h:16,
custom:snapshot,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer > 12) this.speed = 1
if (this.timer === 120) {
const target = this.custom
smooth(this,target,60)
}}}]
})
},{count:24,x:SpawnX,y:Half.y - 30,length:15})
},i/4)}
}}}
functions.push(spell54)
const spell55 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "夜符｢不死蝶乱舞｣",
dif:"h",
desc:"",
hint:"",
nm:"めちゃくちゃ良くない！？！？？名前の乱舞とは、蝶が群がって動く事という意味もある。夜は単純に虫なので(？)",
ct:"めちゃくちゃ良くない！？！？名前もスペカもクオリティ高いと思う！！久々の良スペカ🤩気分いい🤩🤩個人的にかなり高得点",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=100;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:35,
run() {
if (pfr % 240 === 0 || pfr === 1) {
const x = Half.x;
const y = Half.y
const angle = pfr === 1 ? dtr(90) : random(-180,180)
bullet({
rd:0.65,
    x:x,
y:y,
speed:0.5,
type:"fly",
angle:angle,
color:"FF00D7",
w:48,
h:48,
fnlist:[{f:0,fn:function() {
reverse(this)
if (this.timer ===1) {
const a = 0.5 / 60
for (let i = 0;i<60;i++) wait(()=>{this.speed+=a},i)
}
if (this.timer % 60 === 0) {
    gspiral((ev) =>{
const c = ["FF0028","FF6A00","FFE900","92FF00","00FF3F","00FFF8","0018FF","7F00FF","F800FF","FF004A"][Math.floor(Math.random()*10)]
        bullet({
rd:0.65,
    x:this.x+random(-5,5),
y:this.y+random(-5,5),
speed:1.5,
type:"fly",
angle:dtr(ev.deg),
color:c,
w:32,
h:32,
    })
},{count:12,turn:6})
}},loop:true}]
})
}
}}
functions.push(spell55)
const spell56 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name: "幻符｢幻視崩壊｣",
dif:"h",
desc:"",
hint:"",
nm:"幻視と幻符で被ってるのは反省点。難易度は高いけどある程度法則はあるから耐えれる。",
ct:"ムズい。結構難易度は高いかな。あとちょっと重くなる場面あるかもw",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:35,
run() {
if ((pfr % 30 === 0 || pfr === 1)) {
if (pfr % 360 === 0) this.prop.bool = !this.prop.bool
const rx = Half.x;
const ry = Half.y
const deg = 90;
const sp = 7.5
const sp2 = 45
const b = this.prop.bool
VSpawn((ev) => {
const r = sp
const n= {x:random(-r,r),y:random(-r,r)}
const x = ev.x+n.x
const y = ev.y+n.y
const rangle = dtr(deg+this.prop.a)
const angle = ev.rad + Math.PI
const speed = 1
function s(a,bo) {
    const cyc = pfr % 240
const mp = bo ? 0.25 : -0.25
if (cyc >180) {
a.speed = 0;
const test = a.x + mp
const newX = test > canvas.w - 1 || test <= 1
if (!newX) a.x = test 
a.rd = 0;
a.color = "FFFFFF";
} else {
a.speed = speed  
a.rd = 0.65;
a.color = "FF0017";
}}
bullet({
rd:0.65,
    x:x,
y:y,
speed:0.5,
type:"knife",
angle:dtr(90),
color:"FF0017",
w:16,
h:16,
setlist:[{e:speed,f:12}],
custom:0,
fnlist:[{f:0,fn:function() {
if (this.custom > 0){
const a =reverse(this)
    if (a) this.custom -= 1
}
s(this,b)
},
loop:true}]
})
bullet({
rd:0.65,
    x:x,
y:y,
speed:0.5,
type:"knife",
angle:-dtr(90),
color:"FF0017",
w:16,
h:16,
setlist:[{e:speed,f:12}],
custom:1,
fnlist:[{f:0,fn:function() {
if (this.custom > 0){
const a =reverse(this)
    if (a) this.custom -= 1
}
s(this,!b)
},
loop:true}]
})
},{x:rx,y:ry, baseDeg : -90, spreadDeg:  sp2+random(-5,5), count : 30, length:0,spacing:10})
    
}}}
functions.push(spell56)
const spell57 = {
name: "混符｢弾幕祭り・懐｣",
dif:"l",
desc:"",
hint:"",
ct:"どことなく懐かしさを覚える色合いでしょう？シンプルながら難しい弾幕です。名前もどことなく懐かしい感じのシンプルさに。ノスタルジックな弾幕なんて作れたんだね。",
nm:"なぜ懐かしいかと言うと、黒背景+強めの色は昔の機械などのuiに使われていたからかな？我ながらすごく懐かしい弾幕になったと思う。",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:23,
run() {
if ((pfr % 6 === 0 || pfr === 1)) {
const colors = [
  "crim",
  "pink",
  "cobalt",
  "green",
  "gold",
  "white"
];

if (this.prop.a > 60)this.prop.bool = false;
if (this.prop.a <= -60)this.prop.bool = true;
const a = this.prop.bool ?  5 : -5
this.prop.a += a
if (pfr % 360 === 0) this.prop.bool = !this.prop.bool
const rx = Half.x;
const ry = Half.y
const deg = 90;
const cy = (Half.y - 30) + random(-30,30)
const cx = random(30,canvas.w-30)
const count = 18 + random(-25,18)
const speed = 3.5+random(-2,0.5)
const color = colors[Math.floor(Math.random()*colors.length)]
circle((ev) => {
bullet({
rd:0.65,
    x:cx,
y:cy,
speed:0.5,
type:"big",
angle:dtr(ev.deg),
color:color,
w:16,
h:16,
setlist:[{e:speed,f:30}],
custom:0,
})

},{count:count})
    
}}}
functions.push(spell57)
const spell58 = {
name: "落符｢大剣落としの大渦｣",
dif:"h",
desc:"",
hint:"",
ct:"割かしムズい。大剣の動きに結構力入れた。あと最初渦の停止の仕組み雑に作りすぎてばかおもくなったのでしっかりかるくした。計算数は減らすのが大事w",
nm:"謎に弾を消さないようにしたので時間発狂でもある。nmはかなりムズいかと😅",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:23,
run() {
if ((pfr % 6 === 0 || pfr === 1)) {
const colors = [
  "crim",
  "pink",
  "cobalt",
  "green",
  "gold",
  "white"
];
if (pfr % 300 === 0 || pfr === 60) {
const x = random(32,canvas.w-32);
const y = 125;
bullet({
x:x,
y:y,
angle:pf(x,y),
    type:"kunai2",
color:"white",
w:128,
h:128,
speed:1.5,
custom:false,
fnlist:[{
f:0,
fn:function() {
const k = keep(this,50)
console.log(k)
if (k) {
this.speed = 0;
this.custom = true
return;
}
if (!this.custom) this.speed = (this.timer * 0.08)
},loop:true
}],
})
}
if (this.prop.a > 60)this.prop.bool = false;
if (this.prop.a <= -60)this.prop.bool = true;
const a = 36
this.prop.a += a
if (pfr % 360 === 0) this.prop.bool = !this.prop.bool
const rx = Half.x;
const ry = Half.y
const deg = 90;
const cy = (Half.y - 30)
const cx = Half.x
const size = 16;
const c = this.prop.a
const gt = 0.00166
circle((ev) => {
const d = Math.floor(random(60,300))
bullet({
rd:0.65,
    x:cx,
y:cy,
speed:1.5,
type:"big",
angle:dtr(ev.deg+c),
color:"kunai2",
w:size,
h:size,
fnlist:[{f:d,fn:function() {
console.log(this.custom)
this.speed=0
}}],
})

},{count:9})
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell58)
const spell59 = {
name: "赤符｢人口月面クレーター｣",
dif:"h",
desc:"",
hint:"",
ct:"名前はよく分からないな？とりあえず難易度は高いと思う。自機狙いの挙動が制作時間の6割くらい握ってる気がする。",
nm:"よく分からない弾幕だけど割と気に入ってる。ムズい",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:23,
run() {
if ((pfr % 6 === 0 || pfr === 1)) {
const cy = (Half.y - 30)
const cx = Half.x
if (pfr % 30 === 0) {
    bullet({
rd:0.65,
    x:cx,
y:cy,
speed:0.5,
type:"simple",
angle:pf(cx,cy),
color:"FFF700",
w:32,
h:32,
fnlist:[{f:0,fn:function() {
if (this.timer < 30) this.speed += (2/30)
if (this.timer > 100) this.speed -= (4/40)
if (this.timer > 200) this.deleteFrame=0
},loop:true}],
})
}
const colors = [
  "crim",
  "pink",
  "cobalt",
  "green",
  "gold",
  "white"
]
if (this.prop.a > 60)this.prop.bool = false;
if (this.prop.a <= -60)this.prop.bool = true;
const o = 25.71
const a =o
this.prop.a += a
if (pfr % 360 === 0) this.prop.bool = !this.prop.bool
const rx = Half.x;
const ry = Half.y
const deg = 90;
const size = 24;
const c = normal(this.prop.a,-180,180)
const gt = 0.00166
circle((ev) => {
const d = Math.floor(random(60,300))
bullet({
rd:0.65,
    x:cx,
y:cy,
speed:0.5,
type:"kunai2",
angle:dtr(ev.deg+(c)),
color:"red",
w:size,
h:size,
setlist:[{f:12,e:1.5}]
})

},{count:18})
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell59)
const spell60 = {
name: "狂符｢東方紅魔狂〜薄霧の日〜｣",
dif:"l",
desc:"",
hint:"",
ct:"最近ムズいの作りすぎてる？いやそうでも無い？とりあえず60記念ということで。シンプルに難しい弾幕になりました！ランダム要素でかいw",
nm:"おお！やりますぎ。この弾幕、なんだかんだ運ゲーでもあるのでムズい",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:23,
run() {
if ((pfr % 11 === 0 || pfr === 1)) {
this.prop.a += 1
this.prop.s += random(0,7)
const cy = (Half.y - 30)
const cx = Half.x
const sp = [1.5,1.75,2.5]
const c = sp[normal(this.prop.a,0,3)]
const s = normal(this.prop.s,-180,180)
const gt = 0.00166
const size = 16
const az = random(-15,15)
const ay = random(-15,15)
arc((ev) => {
bullet({
rd:0.65,
    x:ev.x+az,
y:ev.y+ay,
speed:c,
type:"diamond",
angle:dtr(ev.deg+s),
color:"red",
w:size,
h:size,
setlist:[{f:12,e:c}]
})

},{count:54,x:cx,y:cy,length:10})
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell60)
const spell61 = {
name: "純符｢悠久弾幕結界｣",
dif:"l",
desc:"",
hint:"",
ct:"ムズい。純符の名を冠するだけある。そういえば純符は久々かな？40スペルぶりくらい。この弾幕、2Phaseに別れてるんですよ。気に入ってる。",
nm:"おお！この弾幕運ゲー強いのでやりますね。純符の概念を実は忘れてたからあんまないって言うのは内緒な！",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:60,
run() {
if ((pfr % 1 === 0 || pfr === 1) && pfr < 2400) {
this.prop.a += 1
this.prop.s += random(0,7)
const cy = (Half.y - 30)
const cx = Half.x
const sp = [4]
const c = sp[normal(this.prop.a,0,3)]
const s = normal(this.prop.s,-180,180)
const gt = 0.00166
const size = 16
const az = random(-15,15)
const ay = random(-15,15)
const ao = Math.floor(random(0,300))
bullet({
rd:0.65,
    x:cx,
y:cy,
speed:c,
type:"amulet",
angle:dtr(s),
color:"aqua",
w:size,
h:size,
setlist:[{f:ao,e:0}]
})
bullet({
rd:0.65,
    x:cx,
y:cy,
speed:c/2,
type:"amulet",
angle:-dtr(s),
color:"gold",
w:size,
h:size,
setlist:[{f:ao,e:0},{f:2400,e:3}]
})

if (pfr % 60===0)arc((ev) => {
bullet({
rd:0.65,
    x:ev.x,
y:ev.y,
speed:c,
type:"small",
angle:dtr(ev.deg+s),
color:"FF002C",
w:12,
h:12,
setlist:[{f:12,e:c}]
})


},{count:36,x:cx,y:cy,length:10})


} else {
this.prop.ol += 0.5
    bullet({
rd:0.65,
    x:Half.x,
y:Half.y,
speed:3,
type:"scale",
angle:dtr(this.prop.ol),
color:"blue",
w:12,
h:12,
setlist:[{f:12,e:3}]
})
}
    
},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell61)
const spell62 = {
name: "円符｢恒久弾幕波紋｣",
dif:"h",
desc:"",
hint:"",
ct:"当たり判定x0.65に最近ハマってる。ほぼ全部0.65入れてる。そんな当たり判定を活用した弾幕。少しずつ加速して行く+毎回配置が変わります。",
nm:"おお！気合いの要素の割には難易度が低いかも？個人的には見て避けるだけなので楽。",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:50,
run() {
if ((pfr === 1) || pfr % 120 === 0) {
this.prop.a += 135
this.prop.s += 0.1
const cy = (Half.y - 30)
const cx = Half.x
const sp = [4]
const c = sp[normal(this.prop.a,0,3)]
const s = normal(this.prop.a,-180,180)
const gt = 0.00166
const size = 16
const ax = random(-15,15)
const ay = random(-15,15)
const bx = cx + ax
const by = cy + ay
const spee = 0.5+this.prop.s
arc((ev) => {
bullet({
rd:0.65,
    x:ev.x,
y:ev.y,
speed:spee,
type:"small",
angle:dtr(ev.deg+s)+pf(ev.x,ev.y),
color:"FF002C",
w:12,
h:12
})


},{count:144,x:bx,y:by,length:10})
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell62)
const spell63 = {
name: "永符｢永劫弾幕世界｣",
dif:"h",
desc:"",
hint:"残り時間が60,30秒で弾消しが発動します",
ct:"時間発狂。途中で加速地帯避けるの不可能じゃん！でNmできないのは宜しくないからって言うことで当たり判定無くした。元々これのせいで実質NM前提の難易度でした笑。あと、この弾幕の、自機狙い > 円に変化良いよね。どんどん使っていく。そういえばここ3つの弾幕全部○○弾幕○○なのは意図的です。",
nm:"やりますね！この弾幕、実は7つのフェーズがあって、それぞれ弾の種類と角度とスピードと数が違うんですよね！数は円の弾幕のサイズっすw120S弾幕にしては出来がいいと思う。",
speed:1,
list:[],
//自機狙い弾
prop:{s:true,a:1,rng:{s:999},loc :null,custom:0,ol:0,bool:true},
init() {
this.speed = 1
this.prop.s = 0
this.prop.a=0;
this.prop.rng={s:999}
this.prop.custom = 0
this.prop.loc = {x:Half.x,y:Half.y}
this.prop.ol = 1;
this.prop.bool = true;
gi(1)
},
time:120,
run() {
if ((pfr === 1) || pfr % 60 === 0) {
this.prop.a += 1
this.prop.s += random(0,7)
const cy = (Half.y - 30)
const cx = Half.x
const sp = [4]
const c = sp[normal(this.prop.a,0,3)]
const s = normal(this.prop.s,-180,180)
const gt = 0.00166
const size = 16
const ax = random(-15,15)
const ay = random(-15,15)
const bx = cx + ax
const by = cy + ay

const lf = 60
const ite = Math.min(7,pfr / 600)
const fl = [0,10,20,30,40,50,15]
const tl = ["small","simple","scale","kunai2","big","normal","amulet"]
const sl = [2,2,2.5,2.75,2.5,2.2,1,3]
const al = [0,1.5,10,45,90,180,-45]
const cl = [36,36,36,27,27,18,9]
for (let i = 0;i<ite;i++) {
const f = lf - fl[i]
const t = tl[i]
const s = sl[i]
const a = al[i]
const c = cl[i]
arc((ev) => {
bullet({
rd:0.65,
    x:ev.x,
y:ev.y,
speed:s,
type:t,
angle:pf(ev.x,ev.y),
color:"FF002C",
custom:{a:ev.deg,b:a},
fnlist:[{f:f,fn:function() {
    this.angle = dtr(this.custom.a+this.custom.b)
this.speed = 0.25
}}],
w:12,
h:12
})
},{count:c,x:bx,y:by,length:10})
}
if (pfr === 3600 || pfr === 5400) bullets.forEach((e)=> {
e.rd = 0;
e.color = "FFFFFF"
e.speed*=4
})
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell63)