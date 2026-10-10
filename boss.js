import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half,entitys,spelln,start,player,internal} from './sys.js';
import {stat,gameLoop} from "./engine.js"
import {bullet,Bullet,CC} from "./bc.js"

import {
dtr,intern,nextTaskId,wait,random,fr,ondebug,sp,sd,fs,itraw,it,gi,normal,circle,reverse,pf,square,triangle,spiral,gspiral
,keep,ccolor,ns,seed,arc,smooth,smoothSet,getArea,pfneo,VSpawn,way,select,corner,smoothFn,Seed,SeedKey,formula,time,setup,look,pc,wayEx,wr,snake,end,endd} from "./bullet.js"
const mx = 384*2
const my = 448*2
// 英語表記
const rainbow = [
  "red",
  "orange",
  "yellow",
  "green",
  "blue",
  "cobalt",
  "purple"
];

// HEX（カラーコード）
const rainbowHex = [
  "#FF0000", // 赤
  "#FF7F00", // 橙
  "#FFFF00", // 黄
  "#00FF00", // 緑
  "#0000FF", // 青
  "#4B0082", // 藍
  "#8B00FF"  // 紫
];

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

const spell1 = {
name: "｢イビルアイ∑｣",
dif:"n",
desc:"",
hint:"",
ct:"新環境に移行...してはないです。100枚書いたので飽きた、よって実質新環境！！いやー懐かしいねスペル1の概念。地味に一枚目にしては攻めてる？wてかスペル101のコピーです。これ",
nm:"おめでとう。とくにむずくはないかな？固定弾。",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
init() {setup(this)},
time:30,
run() {
if(time()){this.prop.a=-1}
const x = Half.x,y=Half.y
const c = []
    if (time(120)) {
const An = this.seeds[0].random(-45,45)
this.prop.a+=36
const t = this.seeds[3]
const an = this.prop.a;
const l = this.prop.bool
this.prop.bool = !this.prop.bool
arc((ev) => {
bullet({
    angle:dtr(ev.deg+an),
x:ev.x,
y:ev.y,
size:16,
type:"normal",
color:"crim",
speed:1.5,
rd:0.65,
custom:1,
fnlist:[{f:0,fn:function() {
const O = this.angle;
this.deleteFrame=0
arc((ev) => {
bullet({
    angle:O,
x:ev.x,
y:ev.y,
size:16,
type:"normal",
color:"crim",
speed:1.5,
rd:0.65,
custom:{a:An,b:-2},
fnlist:[{f:60,
fn:function() {
const oo = l ? 60 : -60
smooth(this,dtr(this.custom.a),oo)
}},{f:61,loop:true,fn:function() {
if (this.custom.b > -2) {
const a = reverse(this)
if (a) this.custom.b -= 1
if (this.custom.b === 0) {
this.custom.b -= 1;
this.angle = dtr(t.random(-180,180))
}
}
}}]
})
},{count:16,length:60,x:this.x,y:this.y})
}}]
})
},{length:15,x,y,count:18})
}

    },
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell1)

const spell2 = {
name: "春符｢桜吹雪｣",
dif:"h",
desc:"",
hint:"",
ct:"自機狙い超バラマキ蝶弾。だいたい綺麗。動きまくった方が避けやすい",
nm:"初動自機狙いだからぐるぐるした方が誘導出来るのほぼバグ(？)",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
init() {setup(this)},
time:27,
run() {
if (time()) {
bullet({
    angle:pf(Half.x,60),
x:Half.x,
y:60,
size:32,
type:"big",
color:"red",
speed:1.5,
rd:0.65,
custom:{a:false,b:0},
fnlist:[{f:0,loop:true,fn:function() {
keep(this)
const cl = [
  "red", "red", "red",
  "pink", "pink",
  "yellow", "yellow", "yellow",
  "green", "green", "green",
  "blue", "blue", "blue",
  "purple", "purple","purple"
];



if (time(240,this.timer)) {
this.custom.a = !this.custom.a
this.speed = this.custom.a ? 0 : 1.5
this.angle = pf(this.x,this.y)
for (let i = 0;i<=16;i++) {
this.custom.b += 16
const b = this.custom.b
wait(() => {
arc((ev) => {
const c = cl[Math.floor(i)]
const s = 0.5 + i * 0.1
bullet({
    angle:dtr(ev.deg+b)+pf(this.x,this.y),
x:this.x,
y:this.y,
size:16,
type:"fly",
color:c,
speed:s,
vsize:32
})
},{x:this.x,y:this.y,count:36,length:30})
},i*6)
    
}
    }
}}]
})
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell2)
const spell3 = {
name: "昇符｢闇の迷路｣",
dif:"h",
desc:"",
hint:"",
ct:"難易度はまあまあ。なう(2026/09/11 05:50:01)最後のスペル。バランス調整頑張った。困ったら段列を抜けるのがコツ。",
nm:"結構ムズいんだよねこれ。見た目に反してwなんだかんだ段列抜けオンリーが一番安定か？",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
init() {setup(this)},
time:27,
run() {
if (time(45)) {
this.bool = !this.bool
const sx = 18
const x = 0;
const y = 0;
const baseA = 90
const baseB = this.bool ? 15 : -15;
const baseC = this.seeds[34].random(-9,9)
const base = baseA + baseB + baseC
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:26,
type:"simple",
color:"red",
speed:1.5,
rd:0.65,
custom:{a:false,b:0},
vsize:128,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer < 120) this.vsize -= 0.86
}}]
})
},{sx,sy:0,spreadDeg:0,count:72,x,y,angle:dtr(base)})    
}
if (time(240)) {
this.bool = !this.bool
const sx = 16
const x = 0;
const y = 0;
const baseA = 90
const baseB = this.bool ? 15 : -15;
const baseC = this.seeds[34].random(-9,9)
const base = baseA + baseB + baseC
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:24,
type:"simple",
color:"blue",
speed:0.095,
rd:0.65,
custom:{a:false,b:0},
vsize:48,
})
},{sx:24,sy:0,spreadDeg:0,count:72,x:0,y:canvas.h,angle:dtr(-90)})    
}
},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell3)
//全方位弾 > さらに左右から出るまたはそいつからさらに全方位！
const spell4 = {
name: "魔符｢弾幕の悪魔｣",
dif:"n",
desc:"",
hint:"",
ct:"めっちゃ緑の地帯の挙動頑張った！ただそれだけw",
nm:"なんだかんだムズい。",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
init() {setup(this)},
time:37,
run() {
if (time(600)) {
const t = this.seeds[64]
const x = Half.x;
const y = Half.y - 60;
arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"simple",
color:"red",
speed:1.5,
rd:0.65,
custom:{a:false,b:0},
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer === 30) {
    arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"simple",
color:"blue",
speed:1.5,
rd:0.65,
custom:{a:false,b:0},
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer === 30) {
    arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:24,
type:"simple",
color:"yellow",
speed:1.2,
rd:0.65,
custom:ev.i,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer === 60 && this.custom % 3 === 0) {
    arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:16,
type:"simple",
color:"green",
speed:0.5,
rd:0.65,
custom:{a:false,b:0},
noAuto:true,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer === 120) {
    this.angle += dtr(180)
}
if (this.timer === 180) {
this.angle = dtr(90)
}
if (this.timer === 210) {
this.speed = 1.75
const p = dtr(t.random(-45,45))
this.custom = p;
this.angle += p
}
//if (this.timer === 301) this.angle = dtr(90)+this.custom
if (this.timer === 210) this.speed = 0.7
}}]
})
},{count:2,x:this.x,y:this.y,length:8})
}
}}]
})
},{count:18,x:this.x,y:this.y,length:8})
}
}}]
})
},{count:8,x:this.x,y:this.y,length:8})
}
}}]
})
},{count:4,x,y,length:8})
}
},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell4)
const spell5 = {
name: "戦符｢弾幕演舞｣",
dif:"l",
desc:"",
hint:"",
ct:"超難易度！ただ珍しく鬼畜ではあるけどクリアしやすい！俺すごw久しぶりのLは5枚目w",
nm:"画面に反してかなり楽ではあるけど、むずいのには変わりない。",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:27,
run() {
const count = 54
const tempo = 60
const bx = Half.x;
const y = Half.y-60;
const xl = [-75,75]
if (time()) {
this.prop.a -= 1
for (let i = 0;i<(this.time*2)*60;i+=tempo) {
const nx = this.seeds[49].random(-30,30)
const ny = this.seeds[25].random(100,canvas.h-150)
const a = []
for (let h = 0;h<count;h++) {a.push(this.seeds[76].random(-45,45))}

this.arr.push({x:nx,y:ny,a:a})
}}
if (time(tempo,pfr,30)) {
this.prop.a++
const data = this.arr[this.prop.a]
for (const xa of xl) {
const nx = data.x + xa + bx
arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:16,
type:"big",
color:"crim",
speed:1,
rd:0.65,
fnlist:[{f:30,fn:function() {
smooth(this,dtr(data.a[ev.i]),60)
}}]
})
},{count,x:nx,y:data.y})
}
this.prop.s += 36
const o = this.prop.s
arc((ev) => {
bullet({
    angle:dtr(ev.deg+o),
x:ev.x,
y:ev.y,
type:"gummy",
color:"blue",
speed:3,
rd:0.65,
size:48
})
},{count:36,x:Half.x,y:Half.y-80})

const cx = random(0,canvas.w)
bullet({
    angle:pf(cx,0),
x:cx,
y:0,
type:"knife",
color:"green",
speed:4,
rd:0.65,
size:64,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer < 240) this.speed -= 0.014
}}]
})
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell5)
//全方位x30枚 > 30か60fで自機狙い > 停止 > 数秒後に発射を連続でする
//トラップ弾幕(！？)マリオのトロールコース的な感じで初見殺しまみれ！
const spell6 = {
name: "昇符｢闇の迷路｣",
dif:"h",
desc:"",
hint:"",
ct:"難易度はまあまあ。なう(2026/09/11 05:50:01)最後のスペル。バランス調整頑張った。困ったら段列を抜けるのがコツ。",
nm:"結構ムズいんだよねこれ。見た目に反してwなんだかんだ段列抜けオンリーが一番安定か？",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:27,
run() {
if (time()) {
    bullet({
        angle: dtr(0),
        x: 0,
        y: 0,
        type: "laser",
        color: "red",
        speed: 1,
        rd: 0.65,
        w: 64,
        custom: true,
        fnlist: [{
            f: 0,
            loop: true,
fn: function() {
    const cyc = this.timer % 120
    const s = 2
    if (cyc === 61) {           // 60を超えた最初のフレームだけ発火
        this.speed = this.timer + 12   // ここから12フレームかけて広がる
    } else if (cyc <= 60) {
        this.speed = Infinity
    }
    if (this.y <= 0) this.custom = s
    if (this.y >= canvas.h) this.custom = -s
    this.y += this.custom
}
        }]
    })
}
if (time(240)) {
for (let i = 1;i<20;i++) {
wait(() => {
const x = random(100,canvas.w - 150)
const y = random(100,canvas.h -200)
arc((ev) => {
const l = {x:ev.x,y:ev.y}
if (!pc(l,30)) {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:16,
type:"kunai2",
color:"crim",
speed:1,
rd:0.65,
vsize:32,
custom:{x,y},
fnlist:[{f:0,loop:true,fn:function() {
    if (this.timer === 60) this.speed = 0;
if (this.timer === 300) {this.angle = pf(this.x,this.y)+dtr(random(-45,45))
    this.speed = 3.5
}
}}]
})
}
},{count:9,x,y,length:3}) 
},i)
}}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell6)
const spell7 = {
name: "刺符｢幻覚ドール｣",
dif:"h",
desc:"",
hint:"",
ct:"すごく混乱する彩り系弾幕！難易度も高めw構成は、通常遅め全方位赤ナイフ & 自機狙いに変化して高速になる緑ナイフ & 完全ランダム高速青ナイフ & 遅めの下からも襲いかかる低速黄ナイフw超ごちゃごちゃwでも結構よけれるでしょ！？",
nm:"ドパい神弾幕でしょこれ！自機狙い入れたのは英断",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:25,
run() {
const cyc = pfr % 240
if (cyc>120&&time(15)) {
const x = Half.x + this.seeds[23].random(-15,15)
const y = Half.y + this.seeds[34].random(-5,5)
this.prop.a += 36;
const t = this.seeds[56]
const p = this.prop.a
arc((ev) => {
bullet({
    angle:dtr(ev.deg+p),
x:ev.x,
y:ev.y,
size:16,
type:"knife",
color:"red",
speed:1,
rd:0.65,
vsize:32,
})
if (pfr % 4 === 0)bullet({
    angle:dtr(ev.deg+p+36),
x:ev.x,
y:ev.y,
size:16,
type:"knife",
color:"green",
speed:1,
rd:0.65,
vsize:32,
custom:0,
fnlist:[{f:0,loop:true,fn:function() {
const o = t.random(-15,15)
    const cyc = pfr % 240
if (cyc >180) {
this.custom += 1
this.rd = 0;
this.scolor("white")
this.speed = 0;
this.angle = pf(this.x,this.y)
} else if (cyc===1){
this.angle += dtr(o)
this.custom -= 1
    this.scolor("green")
this.speed = 3.5;
this.rd =0.65
}
}}]
})
if (ev.i % 5 !== 0)bullet({
    angle:dtr(ev.deg+p+72),
x:ev.x,
y:ev.y,
size:16,
type:"knife",
color:"blue",
speed:1,
rd:0.65,
vsize:32,
custom:0,
fnlist:[{f:0,loop:true,fn:function() {
const o = t.random(-180,180)
    const cyc = pfr % 240
if (cyc ===180) {
this.custom += 1
this.rd = 0;
this.scolor("white")
this.speed = 0;
this.angle = dtr(o)
} else if (cyc === 1){
this.custom -= 1
    this.scolor("blue")
this.speed = 2.5;
this.rd =0.65
}
}}]
})
if (ev.i % 2 === 0)bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:16,
type:"knife",
color:"yellow",
speed:1,
rd:0.65,
vsize:32,
custom:0,
fnlist:[{f:0,loop:true,fn:function() {
const o = t.random(-180,180)
    const cyc = pfr % 240
if (cyc ===180) {
this.custom += 1
this.rd = 0;
this.scolor("white")
this.speed = 0;
} else if (cyc === 1){
this.angle = dtr(o)
    this.scolor("yellow")
this.speed = 1.5;
this.rd =0.65
}
}}]
})
},{count:36,x,y,length:15}) 
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell7)
//エクス御柱みたいにどんどん縦長がおりてくる 中央安置外側アンチ網目1網目2網目3自機狙い
const spell8 = {
name: "昇符｢闇の迷路｣",
dif:"e",
desc:"",
hint:"",
ct:"難易度はまあまあ。なう(2026/09/11 05:50:01)最後のスペル。バランス調整頑張った。困ったら段列を抜けるのがコツ。",
nm:"結構ムズいんだよねこれ。見た目に反してwなんだかんだ段列抜けオンリーが一番安定か？",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:27,
run() {
const t = this.seeds[79]
const cyc = pfr % 240
if (time(15) && pfr < 120) {
const x = Half.x + this.seeds[23].random(-15,15)
const y = Half.y + this.seeds[34].random(-5,5)
this.prop.a += 36;
const p = this.prop.a
spiral((ev) => {
bullet({
    angle:dtr(ev.deg+p),
x:ev.x,
y:ev.y,
size:16,
type:"knife",
color:"red",
speed:1,
rd:0.65,
vsize:32,
fnlist:[{f:60,loop:true,fn:function() {
reverse(this)}}]
})
bullet({
    angle:dtr(ev.deg+p+36),
x:ev.x,
y:ev.y,
size:16,
type:"knife",
color:"green",
speed:1,
rd:0.65,
vsize:32,
fnlist:[{f:60,loop:true,fn:function() {
reverse(this)}}]
})
bullet({
    angle:dtr(ev.deg+p+72),
x:ev.x,
y:ev.y,
size:48,
type:"knife",
color:"yellow",
speed:1.11,
rd:0.65,
vsize:48,
fnlist:[{f:60,loop:true,fn:function() {
reverse(this)
const a = dtr(t.random(-180,180))
if (this.timer===61 || this.timer % 120 === 0) smooth(this,a,30)
}}]
})
},{count:8,x,y,length:3,angle:dtr(90)}) 
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell8)
const spell9 = {
name: "魔物｢ゾンビイリュージョン｣",
dif:"n",
desc:"",
hint:"",
ct:"今回の作品なんか闇属性の名前多くね？スカシュと通四合わせた感じw見た目の数倍よけれるようになってますよ！！",
nm:"もうちょい簡単なの作るべきかな？最近こういう難易度感にハマってるからこの難易度をNORMALと今後はする。",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:27,
run() {
const t = this.seeds[79]
const cyc = pfr % 270
if (time(12) && cyc > 150) {
const x = Half.x
const y = 0
wayEx((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:64,
type:"big2",
color:"red",
speed:11,
rd:0.65,
})
for (let i = 0;i<2;i++)bullet({
    angle:dtr(ev.deg),
x:ev.x+random(-45,45),
y:ev.y+random(-15,15),
size:32,
type:"simple",
color:"red",
speed:2.7,
rd:0.65,
})
for (let u = 0;u<3;u++) bullet({
    angle:dtr(ev.deg),
x:ev.x+random(-25,25),
y:ev.y+random(-5,5),
size:16,
type:"big",
color:"red",
speed:2.5,
rd:0.65,
})
},{count:9,x,y,length:15,angle:pf(x,y)}) 
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell9)
const spell10 = {
name: "魔物｢ゾンビイリュージョン｣",
dif:"n",
desc:"",
hint:"",
ct:"今回の作品なんか闇属性の名前多くね？スカシュと通四合わせた感じw見た目の数倍よけれるようになってますよ！！",
nm:"もうちょい簡単なの作るべきかな？最近こういう難易度感にハマってるからこの難易度をNORMALと今後はする。",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
const hakkyou = 1200 + 240
const cyc = pfr % 270
let t = 6
let count = 36
if (pfr > 600) {t = 3
    count = 27
}
if (pfr >hakkyou) count = 20
if (time(t)) {
if (pfr > 300) this.prop.a += 4
if (pfr > 600) this.prop.a += 32
if (pfr > 900 && pfr < hakkyou) this.prop.a += 36
const g = this.prop.a
const x = Half.x
if(pfr>hakkyou)count=36
let r = 1.5
if (pfr > hakkyou) r = 2
const y = 80
arc((ev) => {
let a = pf(ev.x,ev.y)
if (pfr > hakkyou) a = 0;
bullet({
    angle:dtr(ev.deg)+a+dtr(g),
x:ev.x,
y:ev.y,
size:16,
type:"normal",
color:"red",
speed:3,
setlist:[{f:60,e:r}],
rd:0.65,
})
},{count,x,y,length:15}) 
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell10)
//じきねらいこうそくおおだん > 足跡に弾幕配置 > 反射とどうじにじきねらいにへんかん(これ以降は反射しなくなり消える) > あしあとだんが反射！
const spell11 = {
name: "万死｢スカーレットインパクト｣",
dif:"h",
desc:"",
hint:"",
ct:"ルナティックインパクト X スカーレットシュートって感じ...闇系多すぎてw紅魔郷が面白いのが悪くない！！？！？！？マジでお前がナンバーワンだ。楽しい！",
nm:"うーんこのw自機狙い高速弾楽しい",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(240)) {
const x = Half.x + this.seeds[1].random(-30,30)
const y = Half.y - 40
const seeds = this.seeds
const bigangle = pf(x,y) + this.seeds[0].random(-90,90)
bullet({
    angle:bigangle,
x,
y,
size:64,
type:"big2",
color:"red",
speed:4,
rd:0.65,
custom:1,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer % 1 === 0) {
for (let i = 1;i<=2;i++) {
const ar = [
{type:"simple",size:32,v:0.3},
{type:"big",size:24,v:0.1},
{type:"normal",size:16,v:0.6}
]
const b = wr(ar)
const X = seeds[36].random(-15,15)
const Y = seeds[42].random(-3,3)
const nx = this.x + X;
const ny = this.y + Y;
const BaseAngle = seeds[13].random(-180,180)
const FocusAngle = pf(nx,ny)
const ThisAngle = this.angle
const Angle = dtr(BaseAngle) + FocusAngle + ThisAngle
bullet({
    angle:Angle,
x:nx,
y:ny,
size:b.size,
type:b.type,
color:"red",
speed:1.5,
rd:0.65,
custom:1,
})
}
}
if (this.custom <= 0) return;
const a = reverse(this)
if (a) {
circle((ev)=>{ 
bullet({
    angle:dtr(ev.deg),
x:this.x,
y:this.y,
size:32,
type:"diamond",
color:"red",
speed:3.5,
rd:0.65,
custom:1,
})
  bullet({
    angle:dtr(ev.deg+36),
x:this.x,
y:this.y,
size:32,
type:"diamond",
color:"red",
speed:3.5*0.75,
rd:0.65,
custom:1,
})
  bullet({
    angle:dtr(ev.deg+36+36),
x:this.x,
y:this.y,
size:32,
type:"diamond",
color:"red",
speed:3.5*0.5,
rd:0.65,
custom:1,
})
  bullet({
    angle:dtr(ev.deg),
x:this.x,
y:this.y,
size:48,
type:"arrow",
color:"red",
speed:3.5*1.25,
rd:0.65,
custom:1,
})
},{count:54})
    this.custom -= 1
this.angle = pf(this.x,this.y)
}
}}]
})
    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell11)
//全方位>-5,5°の弾を同時に打つ
const spell12 = {
name: "火符｢アグニシャドウ｣",
dif:"n",
desc:"",
hint:"",
ct:"再現度に自信あり！",
nm:"地味に見た目いい？",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(180)) {
const x = Half.x;
const y = Half.y-60;
const t = this.seeds
this.prop.a += 36
const angle = this.prop.a
arc((ev)=>{
for (let i = 0;i<3;i++) {
wait(() => {
const o = ev.i % 2 === 0 ? -180 : 0 
const u = ev.i % 2 === 0 ? 45 : -45
bullet({
    angle:dtr(ev.deg+o),
x:ev.x,
y:ev.y,
size:38,
type:"fire",
color:"red",
speed:2,
rd:0.65,
custom:1,
fnlist:[{f:30,fn:function() {
smooth(this,dtr(u*4),120)
}},
{f:60,fn:function(){smooth(this,dtr(t[16].random(-45,45)),120)
}}]
})
},i*18)}
},{count:90,x,y,length:0,angle})

    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell12)
const spell13 = {
name: "隕石｢チクシュルーブ衝突体｣",
dif:"n",
desc:"",
hint:"",
ct:"でかくなるタイプのおもろいよね",
nm:"はええわw弓矢強い",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(60)) bullet({
    angle:pf(0,0),
x:0,
y:0,
size:48,
type:"arrow",
color:"red",
speed:7.25,
rd:0.65,
custom:1,
})
if (time()) bullet({
    angle:dtr(90),
x:Half.x,
y:Half.y,
size:256,
type:"polygon",
color:"red",
speed:0,
rd:0.65,
custom:1,
})
if (time(480)) {
const a = this.seeds[36].random(-180,0)
const x = this.seeds[3].random(0,canvas.w)
const y = Half.y-60;
bullet({
    angle:dtr(a),
x:x,
y:y,
size:64,
type:"fire",
color:"red",
speed:7.5,
rd:0.65,
custom:1,
fnlist:[{f:0,loop:true,fn:function() {
const o = reverse(this)
this.custom-=1
if(this.custom<=0)this.speed=7
if(this.custom <= 0) {
if(o) {
this.custom = 60
this.angle = random(-180,180)
this.speed = 0.1;
  bullet({
    angle:dtr(a),
x:this.x,
y:this.y,
size:64,
type:"fire",
color:"red",
speed:0,
rd:0.85,
custom:1,
fnlist:[{f:0,loop:true,fn:function() {
    this.w += 10.5;
this.h+=10.5
if (this.timer > 60) this.deleteFrame=0
}}]
})
}}}}],
})

    
}},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell13)
//炎弾 > 着弾と同時に爆デカくなって反射
//弾から毎秒横、縦軸のレーザーが出る
const spell14 = {
name: "貫符｢マジックレーザー｣",
dif:"n",
desc:"",
hint:"",
ct:"珍しいタイプのレーザーの使い方。縦横軸交互に変わるのいい",
nm:"十時にしてたらつんでそうw",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
const t = this.seeds
if (time(60)) {
for (let i = 0;i<45;i++) {
const x = t[9].random(0,40),y=t[13].random(0,40);
    bullet({
    angle:pf(x,y)+dtr(180+t[4].random(-45,45)),
x:x,
y:y,
size:32,
type:"arrow",
color:"red",
speed:0,
rd:0.65,
fnlist:[{f:0,loop:true,fn:function() {
    if (this.timer <30) this.angle += dtr(6)
if (this.timer===31)this.speed = 3.7
}}],
deleteFrame:360
})
}}
if (time()) bullet({
    angle:dtr(90),
x:Half.x,
y:Half.y,
size:128,
type:"curse",
color:"red",
speed:3,
fnlist:[{f:0,loop:true,fn:function() {
const b = reverse(this)
if (time(30,this.timer)) {
    this.custom = !this.custom
const a = this.custom ? 0 : 90
const loc = this.custom ? {x:0,y:this.y} : {x:this.x,y:0}
const c = this.custom ? "blue" : "red"
bullet({
    angle:dtr(a),
x:loc.x,
y:loc.y,
size:32,
type:"laser",
color:c,
speed:60,
deleteFrame:360
})
}
if (b) this.angle = dtr(t[3].random(-180,180))
}}],
rd:0.65,
custom:1,
})
},
    img:"./japan2.png",
mask:"./pale.png",
maskAlpha:0.35,
maskSpeed:0.15,
imgSpeed:1.75,
imgAlpha:0.25,
}
functions.push(spell14)
const spell15 = {
name: "世符｢アイスエイジ｣",
dif:"h",
desc:"",
hint:"",
ct:"チルノPhantasmみたいになったwwww最近弓矢にハマってる。クルッとするのがいい！なう(2026/09/18 02:18:05)最後のスペル。",
nm:"結構気に入ってる。高難易度且つ楽しい",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(18*2)) {
const xl = [15,canvas.w-15]
const x = select(xl)
const y = players[0].y
bullet({
    angle:pf(x,y)+dtr(180),
x:x,
y:y,
size:32,
type:"arrow",
color:"red",
speed:0,
rd:0.65,
fnlist:[{f:0,loop:true,fn:function() {
    if (this.timer <30) this.angle += dtr(6)
if (this.timer===31)this.speed = 3.7/2
}}],
})
}
if (time(15)) {
this.prop.s += 1
const T = (this.prop.s * 10)+15;
if (this.prop.s>3)this.prop.s=0
const x = Half.x;
const y = entity.y
const al = [-T,T]
for (const a of al) {
for (let s = 2;s<7.5;s+=1) bullet({
    angle:pf(x,y)+dtr(a),
x:x,
y:y,
size:32,
type:"big",
color:"aqua",
speed:s,
deleteFrame:360
})
}}
if (time(360)) {
const x = Half.x;
const y = entity.y
bullet({
    angle:pf(x,y),
x:x,
y:y,
size:96,
type:"big2",
color:"blue",
speed:1,
deleteFrame:360,
vsize:96
})
}
if (time(60)) {
this.prop.a += 72;
const i = this.prop.a;
const x = Half.x+this.seeds[16].random(-20,20);
const y = entity.y+this.seeds[26].random(-5,5)
circle((ev) => {
bullet({
    angle:dtr(ev.deg+i),
x:x,
y:y,
size:32,
type:"diamond",
color:"cobalt",
speed:3,
deleteFrame:360,
rd:0.8
})
wait(()=>{bullet({
    angle:dtr(ev.deg+i*2),
x:x,
y:y,
size:32,
type:"diamond",
color:"cobalt",
speed:3,
deleteFrame:360,
rd:0.8
})
},30)
},{count:36})
}
if (time(60)) {
const x = Half.x;
const y = 0
const al = [0,-180]
for (const a of al) {
bullet({
    angle:dtr(a),
x:x,
y:y,
size:64,
type:"scale",
color:"blue",
speed:5,
fnlist:[{f:30,fn:function() {
    this.angle = dtr(90)
}}]
})
}}

if (time(360)) {
const x = Half.x;
const y = entity.y
for (let s = 1;s<7.5;s+=0.5) bullet({
    angle:pf(x,y),
x:x,
y:y,
size:32,
type:"big",
color:"blue",
speed:s,
deleteFrame:360
})
}
},
    img:"./noise.png",
mask:"./",
maskAlpha:0,
maskSpeed:0.15,
imgSpeed:1,
imgAlpha:1,
}
functions.push(spell15)
const spell16 = {
name: "札符｢七夕まつり｣",
dif:"n",
desc:"",
hint:"",
ct:"案外上避けもありじゃない？速度が早いから段列ごとによけれる！",
nm:"結構気に入ってる。高難易度且つ楽しい",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(15)) {
const xl = [15,canvas.w-15]
const x = random(0,canvas.w)
const y = 0
for (let i = -1;i<2;i++) {
const c = select(["purple","aqua","green"])
bullet({
    angle:dtr(0),
x:x+i*30,
y:y,
size:64,
type:"amulet",
color:c,
speed:0,
rd:0.65,
custom:false,
fnlist:[{f:0,loop:true,fn:function() {
const a = this.custom ? 6 : -6
if (this.angle === dtr(-180)) this.custom = true
if (this.angle === dtr(0)) this.custom = false;
    if (this.timer <120+random(-60,60)) {
this.angle += dtr(a)} else {
this.deleteFrame=0
for (let y = 0;y<50;y++) {
    bullet({
    angle:this.angle+dtr(random(-180,0)),
x:this.x+random(-30,30),
y:this.y,
size:32,
type:"amulet",
color:this.color,
speed:3,
rd:0.65,
fnlist:[{f:60,loop:true,fn:function(){if(this.timer<120){this.speed-=0.025;
    this.w-=0.2
this.h -= 0.2}
}}]
})}}
}}],
})
}
}},
    img:"./noise.png",
mask:"./",
maskAlpha:0,
maskSpeed:0.15,
imgSpeed:1,
imgAlpha:1,
}
functions.push(spell16)
//xランダムな地点の真上にホース、そっから水が流れる

//短冊が揺れて分散して落ちてくる
const spell17 = {
name: "弾符｢恋の回転｣",
dif:"e",
desc:"",
hint:"",
ct:"初動がいちばんムズいw",
nm:"地味にテストに時間かかった！",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(120,pfr,60)) {
const x = Half.x;
const y = Half.y - 80
    arc((ev) =>{
bullet({
    angle:dtr(ev.deg+180),
x:ev.x,
y:ev.y,
size:24,
type:"scale",
color:"red",
speed:0,
rd:0.65,
custom:Math.floor(ev.i*1.25)+60,
fnlist:[{f:0,loop:true,fn:function() {
    if (this.timer > this.custom-1 && this.timer < this.custom + 30) {
//if(this.custom===this.timer)this.angle=pf(this.x,this.y)
this.speed += (3/30)
}}}]
})
},{count:36,x,y,length:100})
}
if (time(72/2,pfr,60)) {
this.prop.s ++
if(this.prop.s>2)this.prop.s=0
this.bool = !this.bool
this.prop.a += 72
this.prop.bool = !this.prop.bool
const x = Half.x;
const y = Half.y - 80
const a = this.prop.a
const k = this.bool
const m = this.prop.s === 2
circle((ev) =>{
const b = this.prop.bool ? ev.i % 2 === 0 : ev.i % 2 !== 0
const color = ev.i % 2 === 0 ? "red" : "blue"
wait(() => {
bullet({
    angle:dtr(ev.deg),
x:x,
y:y,
size:32,
type:"heart",
color:"toumei",
speed:6,
rd:0,
custom:{b,a,k,color,m},
fnlist:[{f:0,loop:true,fn:function() {
if (!this.custom.k) {
    this.scolor(this.custom.color)
this.rd =0.65
}
if (this.custom.k&&this.timer>30) {
if (this.timer<40)this.angle += dtr(72)
    this.scolor(this.custom.color)
this.rd =0.65
}
if (this.timer>30&&this.custom.b) this.deleteFrame=0
if(this.timer<30)this.speed-=(5/30)
if (this.timer>30&&this.timer<90) {
const o = this.custom.m && this.color==="red"? -72 : 72
this.angle += dtr((o / 60))

}
}
}],
})
},ev.i/2)},{count:144})
}},
    img:"./noise.png",
mask:"./",
maskAlpha:0,
maskSpeed:0.15,
imgSpeed:1,
imgAlpha:1,
}
functions.push(spell17)
//⬆グルグルするじきねらい
const spell18 = {
name: "蛇符｢デオキシリボスネイク｣",
dif:"n",
desc:"",
hint:"",
ct:"ビジュ良くね？真上に行くとそくししますwやった人は多分居ないけど",
nm:"ビジュいい！！最後に頭がスポーンするけど速度差着けるようにした。",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if(time()) {
bullet({
    angle:dtr(0),
x:0,
y:30,
size:32,
type:"laser",
color:"red",
speed:60,
rd:0.65,
})
this.prop.bool = true}
if (this.prop.bool) {
    if (players[0].y < 30) {
this.prop.bool = false
end()
}}
if (time(90)) {
const x = this.seeds[53].random(0,canvas.w)
const y = 3
const tt = this.seeds[67].random(0.025,0.1)
for (let i = 1;i<31;i++) {
const t = i === 30 ? "scale" : "gummy"
const s = (i/10)
    wait(() => {
bullet({
    angle:dtr(90),
x:x,
y:y,
size:32,
type:t,
color:"green",
speed:s,
rd:0.65,
custom:{tt,a:true},
fnlist:[{f:0,loop:true,fn:function() {
if(this.custom.a) {
const a =reverse(this)
if(a)this.custom.a=false;
}
  if(this.custom.a) this.angle = dtr(snake(this,this.custom.tt,45,90))
}}]
})
        },i*6)
    }}
},
    img:"./noise.png",
mask:"./",
maskAlpha:0,
maskSpeed:0.15,
imgSpeed:1,
imgAlpha:1,
}
functions.push(spell18)
//自機狙い+50アングル三回、ランダムで50に到達か1回ごとに5〜30、3Way蝶々
const spell19 = {
name: "生符｢バタフライインカーネイション｣",
dif:"h",
desc:"",
hint:"",
ct:"寝て起きたらなんか思いついたやつ。難易度もちょうどいい！",
nm:"めちゃくちゃ気に入ってる。個人的に神弾幕",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(240)) {
const color = select(["red","purple","blue"])
for (let i = 1;i <=6;i++) {
wait(() => {
const x = Half.x;
const y = Half.y-90
const t = pf(x,y)- dtr(30) + dtr(i*10)
way((ev)=>{
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:48,
type:"fly",
color:color,
speed:0,
custom:2,
fnlist:[{f:0,loop:true,fn:function() {
if (this.custom>0) {
const rv =　reverse(this,-4)
if (rv) {
this.timer=0;
this.speed=0
this.custom -= 1
}}
if (this.timer < 120)this.speed += (3/120)
}}],
rd:0.65,
})
        },{x,y,count:6,length:30,angle:t})
},i*15)}}},
    img:"./noise.png",
mask:"./",
maskAlpha:0,
maskSpeed:0.15,
imgSpeed:1,
imgAlpha:1,
}
functions.push(spell19)
const spell20 = {
name: "仏符｢輪廻転生斬｣",
dif:"n",
desc:"",
hint:"",
ct:"断食 x なんか色々みたいな..w3連簡易断食 + レーザー。最初はレーザーの隙間が今の75%でバカむずかったので調整した。",
nm:"個人的に好き。ノーミスしやすいよね！",
seeds:[],
prop:{s:0,a:1,rng:{s:999},bool:false,x:0,y:0,step:0,shrink:0,speed:0},
arr:[],
init() {setup(this)},
time:30,
run() {
if (time(240)) {
wait(() => {
for (let yy = 0;yy<canvas.h/2;yy+=canvas.h/5) {
const y = yy
for (let i = 0;i<canvas.w;i+=canvas.w/15) {
const rand = random(-90,90)
const progress = (i/(canvas.w/15)+1)/15
wait(() => {

arc((ev) => {
const Pf = Math.random < 0.15 ? pf(ev.x,ev.y) : 0
bullet({
    angle:dtr(ev.deg+rand+Pf),
x:ev.x,
y:ev.y,
size:16,
type:"scale",
color:"blue",
speed:1.5,
rd:0.5,
custom:{a:ev.deg+rand,i:progress},
fnlist:[{f:0,loop:true,fn:function() {
const V = Math.floor(this.custom.i * 30)
const Tim1 = V
const Tim2 = 41 + V
if (this.timer === Tim1) smooth(this,dtr(180),40)
if (this.timer === Tim2) smooth(this,dtr(180),40)

if (this.timer === 90+V) {
const Target = random(-0.5,0.25)
for (let iS = 0;iS<30;iS++) wait(()=>{this.speed+=Target/30},iS)
}}}],
})
},{count:54/2*0.75,x:i,y:y,length:0})

arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:16,
type:"scale",
color:"blue",
speed:1.5,
rd:0.65,
custom:{a:ev.deg+rand,i:progress},
fnlist:[{f:0,loop:true,fn:function() {
const V = Math.floor(this.custom.i * 30)
const Tim1 = V
const Tim2 = 41 + V
if (this.timer === Tim1) smooth(this,dtr(180),40)
if (this.timer === Tim2) smooth(this,dtr(180),40)

if (this.timer === 81+V) {
this.angle = dtr(random(-180,1))
}}}],
})
},{count:22/2/2,x:i,y:y,length:15})
},progress*15)
}}},15)
this.prop.bool = !this.prop.bool
const start = this.prop.bool ? 0 : 16
for (let i = start;i<canvas.w;i+=64) {
bullet({
    angle:dtr(90),
x:i,
y:0,
size:24,
type:"laser",
color:"red",
speed:30,
rd:0.65,
deleteFrame:240
})}
    }
},
//レーザーと同時にplayers_0].y+30の0〜横線にスケイル団
    img:"./noise.png",
mask:"./",
maskAlpha:0,
maskSpeed:0.15,
imgSpeed:1,
imgAlpha:1,
}
functions.push(spell20)
const spell21 ={
  name: "夢符｢幻想夢想結界｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "輝夜通3見て思いついた。こういうどんどん改変がされていつの間にか全く別物になるの、おもろい。",
  nm: "もうちょい速度遅くしても良かったかな？てかこれ見れる人はいるのだろうか...",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
const x = Half.x;
const y = Half.y

const spdat = {
    wait:1.5,
count:18,
ap:36
}
if (time())this.prop.s=0
const wt = spdat.count * spdat.wait
    if (time(wt)) {
this.prop.s ++
const c = rainbow[normal(this.prop.s,0,rainbow.length)]
this.prop.a += spdat.ap;
const g = this.prop.a
spiral((ev) => {
wait(() => {
        bullet({
          angle: dtr(ev.deg+g+random(-10,10)),
          x: ev.x,
          y: ev.y,
          size: 24,
          type: "amulet",
          color: c,
          speed: 1,
          rd: 0.65,
custom:true,
fnlist:[{
    f:0,
loop:true,
fn:function() {
if(this.custom) {const a = reverse(this)
if(a)this.custom=false}
}}]
})
    
},ev.i*spdat.wait)
},{x,y,count:spdat.count})
        
    }},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}

functions.push(spell21)
//少なめのスパイラルが反射か途中で反転
const spell22 ={
  name: "散符｢クロックスクエア｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "よく分からない、、、いやなんだこれ。回転するナイフ + どんどん下に迫ってくる四角円弾。一応左右端にいると真下に来た時の円弾に当たらないので、ノーミスは可能。",
  nm: "よく分からなくて割と後悔してる。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 60,
  run() {
const x = Half.x;
const y = Half.y
if (time(30)) {
    const spdat2 = {
    wait:1.5,
count:9,
ap:5,
colors:["green","blue"]
}
if (time())this.prop.s=0
    if (time(60)) {
this.cs.b+=36
const cico = 8
this.cs.a+=cico
const aoao = this.cs.b
const o = this.cs.a
const g = this.prop.a
square((ev) => {
        bullet({
          angle: dtr(ev.deg+aoao),
          x: ev.x,
          y: ev.y,
          size: 32,
          type: "big",
          color: "red",
          speed: 1,
          rd: 0.5,
})
},{x,y,count:spdat2.count,dist:o})
    }}
const spdat = {
    wait:1.5,
count:8,
ap:5,
colors:["green","blue"]
}
if (time())this.prop.s=0
const wt = spdat.count * spdat.wait
    if (time(wt)) {
this.prop.s ++
const c = spdat.colors[normal(this.prop.s,0,spdat.colors.length)]
this.prop.a += spdat.ap;
const g = this.prop.a
arc((ev) => {
wait(() => {
        bullet({
          angle: dtr(ev.deg+g+random(-3,3)),
          x: ev.x,
          y: ev.y,
          size: 48,
          type: "knife",
          color: c,
          speed: 1,
          rd: 0.5,
custom:true,
})
},ev.i*spdat.wait)
},{x,y,count:spdat.count})
        
    }},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}

functions.push(spell22)
const spell23 ={
  name: "永符｢不死の煙｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "蓬莱の薬N取得した時に思いついたスペル。永夜返しと蓬莱の薬を足して15で割ったみたいな感じ。結構ムズいし理想的な難易度に出来た。なう(2026/09/23 05:50:30)最後のスペル。今回のアプデは全体的にいいと思う。",
  nm: "やるやん。てかこれみてる人いないって！！マジでさあ！！これを見れてる人がいるなら次からも書くわ(？)",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 45,
  run() {
const x = Half.x;
const y = Half.y
const spdat = {
    wait:1.5,
count:72,
ap:3,
colors:["cobalt","gold"]
}
if (time())this.prop.s=0
const wt = spdat.count * spdat.wait
    if (time((wt/2)-12)) {
this.prop.s ++
const c = spdat.colors[normal(this.prop.s,0,spdat.colors.length)]
this.prop.a += spdat.ap;
const g = this.prop.a
arc((ev) => {
        bullet({
          angle: dtr(ev.deg+g),
          x: ev.x,
          y: ev.y,
          size: 24,
          type: "eye",
          color: c,
          speed: 0.5,
          rd: 0.5,
custom:true,
})
},{x,y,count:spdat.count})
        
    }
     if (time(480)) {
         bullet({
          angle: pf(Half.x,Half.y),
          x: Half.x,
          y: Half.y,
          size: 96,
          type: "big2",
          color: "red",
          speed: 0.5,
          rd: 0.5,
custom:true,
})
     }
     if (time(30)) {
for (let i = 0;i<32;i++) bullet({
          angle: pf(Half.x,Half.y)+random(-90,90),
          x: Half.x,
          y: Half.y,
          size: 24,
          type: "diamond",
          color: "purple",
          speed: 0.75,
          rd: 0.35,
custom:true,
})
     }
  },
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell23)
const spell24 = {
  name: "星符｢プラネットフォール｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "大星弾実装〜！割と自信ある。シンプルすぎるけどw高速青 + 普通黄色 + 低速緑の組み合わせ",
  nm: "普通にもうちょい難易度上げなくて良かったわwバランス調整はむずかしいw",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 45,
  run() {
    if (time(6)) {
const X = this.seeds[63].random(0,canvas.w)
const Angle = this.seeds[43].random(-45,45)
        bullet({
          angle: dtr(90+Angle),
          x: X,
          y: 0,
          size: 64,
          type: "star2",
          color: "yellow",
          speed:3.5,
          rd: 0.65,
})
     }
    if (time(12)) {
const X = this.seeds[34].random(0,canvas.w)
const Angle = this.seeds[240].random(-45,45)
        bullet({
          angle: dtr(90+Angle),
          x: X,
          y: 0,
          size: 64,
          type: "star2",
          color: "green",
          speed:1.5,
          rd: 0.65,
})
    if (time(24)) {
const X = this.seeds[304].random(0,canvas.w)
const Angle = this.seeds[134].random(-45,45)
        bullet({
          angle: dtr(90+Angle),
          x: X,
          y: 0,
          size: 64,
          type: "star2",
          color: "blue",
          speed:5,
          rd: 0.65,
})}
     }
  },
img: "./cloud.png",
  mask: "./nature.png",
  maskAlpha: 0.15,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 0.75,
}
functions.push(spell24)
const spell25 = {
  name: "鱗符｢ユートピアフィッシャー｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "自機狙い黄色+緑鱗。上のは安置潰しw割とおもろくない？！",
  nm: "いい構成だと思う。しっかり避ける必要性ある。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
    if (time(30)) {
for (const d of [{x:0,angle:0},{x:canvas.w,angle:-180}]) bullet({
          angle: dtr(d.angle),
          x: d.x,
          y: 50,
          size:128,
          type: "simple",
          color: "red",
          speed:5,
          rd: 1.5,
})
//wayしきねらい
const wx = 0;
const wy = 80;
const seeds = this.seeds
way((ev) => {
const x = seeds[436].random(-15,15)+ev.x
        bullet({
          angle: dtr(90),
          x: x,
          y: ev.y,
          size: 32,
          type: "scale",
          color: "green",
          speed:1.5,
          rd: 0.65,
setlist:[{f:30,e:2.5}],
fnlist:[{f:60,fn:function(){
const vx = seeds[36].random(0,1) >0.5 ? 0 : canvas.w;
const vy = seeds[231].random(0,canvas.h-100)
        bullet({
          angle: pf(this.x,this.y),
          x: vx,
          y: vy,
          size: 24,
          type: "eye",
          color: "yellow",
          speed:0.5,
          rd: 0.65,
})}
    
}]
})
     },{x:wx,y:wy,angle:dtr(90),lock:dtr(90),count:18,sx:30,sy:0})
  }},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell25)
const spell26 = {
  name: "反符｢ナイフウォール｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "下から迫り上がるナイフの滝。めちゃくちゃムズく見えるけど自機狙いなので誘導して隙間抜けるだけ。まあ緑ナイフがあるのでそんなに簡単には行かない。",
  nm: "一条戻り橋見て思いついた。屈指の神スペルですよあれは",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
    if (time(15)) {
//wayしきねらい
const wx = 0;
const wy = canvas.h;
const seeds = this.seeds
way((ev) => {
const x = ev.x
        bullet({
          angle: pf(ev.x,ev.y),
          x: x,
          y: canvas.h,
          size: 32,
          type: "knife",
          color: "blue",
          speed:1.5,
          rd: 0.65,
})
    for (let i = 0;i<2;i++)bullet({
          angle: pf(ev.x,ev.y)+seeds[999].random(-45,45),
          x: x+seeds[434].random(-15,15),
          y: canvas.h,
          size: 32,
          type: "knife",
          color: "green",
          speed:1.5,
          rd: 0.65,
})
     },{x:wx,y:wy,angle:dtr(90),lock:dtr(90),count:24,sx:30,sy:0})
  }},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell26)
const spell27 = {
  name: "転符｢ポップンアーク｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "反射の弾源移動全方位。ムズくない？？ああそうですか ..なう(2026/09/26 03:59:21)最後のスペル。今回は25,26,27が神スペルだと思う。",
  nm: "個人的にはムズい。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
if(time())this.prop.a=3
    if (time(30)) {
this.prop.c += 72
if (this.prop.a === canvas.h+5) this.prop.s = -30;
if (this.prop.a === 3) this.prop.s = 30;
console.log(this.prop.s)
this.prop.a +=this.prop.s
//wayしきねらい
const x = Half.x;
const y = this.prop.a
const ang = this.prop.c
arc((ev) => {
const x = ev.x
        bullet({
          angle: dtr(ev.deg+ang),
          x: ev.x,
          y: ev.y,
          size: 16,
          type: "small",
          color: "red",
          speed:1.5,
          rd: 0.65,
custom:false,
fnlist:[{f:0,loop:true,fn:function() {
if(this.custom)return;const a = reverse(this)
if(a)this.custom=true;
}}]
})
     },{x,y,count:16,length:30})
  }},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell27)
const spell28 = {
  name: "真実｢フリーメイソン｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "見た目重視。中心に行くと当たりますw綺麗なピラミッドになったんじゃない？",
  nm: "気に入ってるけどもうちょい何とかできそう..",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
if (time()) {
[-180,0,90,-90].forEach(e=>bullet({
          angle: dtr(e),
          x: Half.x,
          y: Half.y,
          size: 32,
          type: "laser",
          color: "red",
          speed:120,
          rd: 0.65,
fnlist:[{f:0,loop:true,fn:function() {
    const cyc = this.timer % 240
    const s = 2
    if (cyc === 60*2+1) {           // 60を超えた最初のフレームだけ発火
        this.speed = this.timer + 12   // ここから12フレームかけて広がる
    } else if (cyc <= 60*2) {
        this.speed = Infinity
    }
this.angle+=dtr(-0.25)
}
}]
}))
bullet({
          angle: dtr(0),
          x: Half.x,
          y: Half.y,
          size: 230,
          type: "simple",
          color: "red",
          speed:0,
          rd: 1.5,
vsize:0,
fnlist:[{f:0,loop:true,fn:function(){this.vsize+=(230/1800)/3}}]
})
}
    if (time(15)) {
const seeds = this.seeds
this.prop.c += 16
//wayしきねらい
const x = Half.x;
const y = Half.y
const ang = this.prop.c
triangle((ev) => {
        bullet({
          angle: dtr(ev.deg),
          x: ev.x,
          y: ev.y,
          size: 16,
          type: "eye",
          color: "yellow",
          speed:0,
          rd: 0.65,
custom:ang,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer===30) {this.speed = 0.75;}
if (this.timer===60) {
smooth(this,dtr(seeds[439].random(-45,45)),90)}
if (this.timer>60&&this.timer<120){
    this.h += 8/60
    this.w += 8/60
}
}
}]
})
     },{x,y,count:18,dist:105,startDeg:90+180})
  }},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell28)
const spell29 = {
  name: "奇跡｢ミラクルスター｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "自機狙いの跡から流れる星。赤星は反射する。これ気に入ってる",
  nm: "やるね！これ割と簡単かも？Nはもったかなあ",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
const cyc = pfr % 480
    if (cyc<120&&time(3)) {
const seeds = this.seeds
this.prop.c += 16
//wayしきねらい
const x = Half.x;
const y = Half.y
const ang = this.prop.c
        bullet({
          angle: pf(x,y)+dtr(seeds[431].random(-2.5,2.5)),
          x: x,
          y: y-100,
          size: 48,
          type: "simple",
          color: "pink",
          speed:7,
          rd: 0.65,
fnlist:[{f:0,fn:function() {
            bullet({
          angle: this.angle+dtr(180+seeds[34].random(-180,180)),
          x: this.x,
          y: this.y,
          size: 64,
          type: "star2",
          color: "red",
          speed:1.5,
          rd: 0.65,
custom:false,
fnlist:[{f:0,loop:true,fn:function() {
    if (this.custom) return;
const a = reverse(this)
if(a)this.custom=true;
}}]
})
            bullet({
          angle: this.angle+dtr(180+seeds[34].random(-45,45)),
          x: this.x,
          y: this.y,
          size: 48,
          type: "star2",
          color: "blue",
          speed:3.5,
          rd: 0.65,
custom:false,
fnlist:[{f:0,loop:true,fn:function() {
    if (this.custom) return;
const a = reverse(this)
if(a)this.custom=true;
}}]
})
}}]
})
  }},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell29)
//16か8の全方位32シンプル(黄色)
const spell30 = {
  name: "無符｢霧雨魔理沙通常5｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "通常っぽい弾幕。割とむずいなあ..ルナティッククラス(？)",
  nm: "通常イメージなだけあって懲役感があるかも",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
    if (time(120)) {
const seeds = this.seeds
//wayしきねらい
for (let i = 0;i<=60;i+=30) {
    wait(() => {
this.prop.c += 72
const x = Half.x;
const y = Half.y
const ang = this.prop.c
arc((ev) => {
bullet({
          angle: dtr(ev.deg+ang),
          x: ev.x,
          y: ev.y,
          size: 48,
          type: "simple",
          color: "yellow",
          speed:1.5,
          rd: 0.65,
})
  },{count:8,x,y})
arc((ev) => {
bullet({
          angle: dtr(ev.deg+ang),
          x: ev.x,
          y: ev.y,
          size: 16,
          type: "normal",
          color: "red",
          speed:1.75,
          rd: 0.65,
})
  },{count:36,x,y})
    if (i===60) {
arc((ev) => {
bullet({
          angle: dtr(ev.deg+ang),
          x: ev.x,
          y: ev.y,
          size: 48,
          type: "star2",
          color: "green",
          speed:0.75,
          rd: 0.65,
})
bullet({
          angle: dtr(ev.deg+ang),
          x: ev.x,
          y: ev.y,
          size: 48,
          type: "star2",
          color: "blue",
          speed:2,
          rd: 0.65,
})
  },{count:36,x,y})
    }
},i)}}},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell30)
const spell31 = {
  name: "滝符｢アミュレットウォーターウォール｣",
  dif: "e",
  desc: "",
  hint: "",
  ct: "改善点はあるね^^;よく分からない系スペル。まあまあまあ。...",
  nm: "アプデうぇん、、、じゃなくて、この弾幕はもうちょいムズくしても良かったかも",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 20,
  run() {
    if (time(12)) {
const seeds = this.seeds
const wx = 0;
const wy = 0;
way((ev) => {
const x = seeds[192].random(-15,15)+ev.x
        bullet({
          angle: dtr(90),
          x: x,
          y: ev.y,
          size: 24,
          type: "amulet",
          color: "red",
          speed:0.5,
          rd: 0.65,
setlist:[{f:120,e:0},{f:180,e:3},{f:240,e:0.4}]
})
     },{x:wx,y:wy,angle:dtr(90),lock:dtr(90),count:18,sx:30,sy:0})


}},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell31)
const spell32 = {
  name: "核符｢ステラレータサン｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "核融合炉はトカマク型とステラレータ型に分かれているので、ステラレータを採用。珍しいスペルじゃないかな？移動制限系スペル今後も作りたいね。",
  nm: "懲役感が強くなったwまあまあま...",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
if(players[0].y>=0)players[0].y -= 1.5
    if (time(30)) {
const seeds = this.seeds
const wx = Half.x;
const wy = Half.y;
this.prop.s += 72;
const g = this.prop.s
arc((ev) => {
        bullet({
          angle: dtr(ev.deg+g),
          x: ev.x,
          y: 0,
          size: 128,
          type: "big",
          color: "red",
          speed:7.5,
          rd: 0.65,
fnlist:[{f:0,loop:true,fn:function() {
    if(this.timer<60) this.speed-=4/60
}}]
})
     },{x:wx,y:wy,count:18})


}},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell32)
//なんかの闇弾 >定期的に反転からの自機狙い
const spell33= {
  name: "永符｢不死鳥リザレクト｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "良くない！？個人的に自信作。白弾は当たり判定が小さい。自機狙い便利っすね",
  nm: "不死鳥リザレクトの語感良くない？俺だけ？",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
  run() {
const seeds = this.seeds
const cyc = pfr % 300;
if (cyc === 0) bullets.forEach((e)=> {
e.angle=pf(e.x,e.y)+dtr(seeds[13].random(-45,45))
e.speed = 0
e.timer = 0;
const color = Math.random()>0.5?"white":"red"
e.scolor(color)
e.rd = 0.65
e.custom.a=true
})
if (cyc === 180) bullets.forEach((e)=> {
e.angle=e.angle+dtr(180)
e.speed = 3
e.scolor("gray")
e.rd = 0.0
})
if(time())this.bool=false
if(time(300)) {
this.bool = !this.bool
const rg = this.bool
for (let i = 0;i<60;i++) {
wait(() => {
const g = rg || (i % 2 === 0);
const o = [{x:canvas.w -50,a:145},{x:50,a:45}]
o.forEach((d) => {
const color = Math.random()>0.5?"white":"red"
        bullet({
          angle: dtr(d.a+seeds[134].random(-45,45)),
          x: d.x+seeds[1].random(-15,15),
          y: 45,
          size: 32,
          type: "scale",
          color: color,
          speed:1.5,
          rd: 0.65,
custom:{a:false,b:rg,i},
fnlist:[{f:0,loop:true,fn:function() {
if(this.color==="white")this.rd=0.4
  if(this.timer<30) this.speed += 4/30
if (this.custom.b&&this.custom.i%2===0) {const s = keep(this)
if(s)this.speed=0}
//if (s && this.timer>60&&this.custom.a)this.deleteFrame=0
}}]
})
})
    
},i*2)
    
}}},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell33)
//プレイヤーを挟む-5ー5の自機狙いSimpleかBigx2+全方位notmal
//画面に4つのスケール弾、下と上両方に出る、時間経過で動く、中央から端に向かって順々にアングルランダムに変更、|  |  |  |みたいな感じ。
const spell34 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
  const seeds = this.seeds
  if (time()) this.bool = false
  if (time(600)) {
    const k = 25   // 縦方向の弾の段数
    const F = 60  // 遅延の最大フレーム数(1〜F)
    const xs = [Half.x + 200, Half.x - 100, Half.x + 100, Half.x - 200]

    xs.forEach((x) => {
      for (let i = 0; i < k; i++) {
        const y = (i + 0.5) * canvas.h / k
        const down = y >= Half.y
        // 中心からの距離を 1〜F に正規化して整数化
        const delay = Math.round(1 + (Math.abs(y - Half.y) / Half.y) * (F - 1))

        wait(() => {
for (let a =0;a<1;a++)bullet({
            angle: dtr(down ? 90 : -90),
            x,
            y,
            size: 32,
            type: "scale",
            color: down ? "purple" : "green",
            speed: 0,
            rd: 0.65,
custom:{a:true,b:false},
            fnlist: [{
              f: 60,loop:true,
              fn: function () {
if (this.timer===61){this.speed = 1.5;this.spawn()}
if (this.custom.a) {
const a = reverse(this)
if (a) {
    this.custom.a = false;
this.custom.b = 3;
this.angle=dtr(seeds[164].random(-180,180))
this.speed=2
}}
if (this.custom.b>0) {
    const a = reverse(this)
if (a) this.custom.b-=1
}
}
              }]
          })
        }, delay)
      }
    })
  }
},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell34)
//8Way全方位ちょうちょブレアリ、最初早い、なめらかに遅くなる、多分反射、浮動する。アングル反転多分あり(完全なる墨染の桜イメージ)
//だんげんがぐるぐるするおんみょうだまからのぜんほういすけーる
//⬆さらに自機狙いとしておんみょうだまが動く、反射したらアングル変更。全方位はスケールじゃなくてSimpkeのYellow
const spell35 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
  const seeds = this.seeds
  if (time()) {
const bx = Half.x;
const by = 0;
      bullet({
            angle: pf(bx,by),
            bx,
            by,
            size: 64,
            type: "om",
            color: "7327B0",
            speed: 2,
            rd: 0.65,
custom:{loc:{x:bx,y:by,a:pf(bx,by)},a:0},
            fnlist: [{
              f: 0,loop:true,
              fn: function () {
this.angle=this.custom.loc.a
const a = keep(this)
if (a) {
this.custom.loc.x=this.x;
this.custom.loc.y=this.y
this.custom.loc.a=pf(this.x,this.y)
}
if (time(15,this.timer)) {
this.spawn()
this.custom.a += 72;
const t = this.custom.a
const ax = Math.cos(this.timer*2)*15;
const ay = Math.sin(this.timer*2)*15;
const x = this.x+ax;
const y = this.y+ay
arc((ev) => {
        bullet({
          angle: dtr(ev.deg+t),
          x: ev.x,
          y: ev.y,
          size: 32,
          type: "simple",
          color: "yellow",
          speed:5+seeds[134].random(-0.75,0.75),
          rd: 0.65,
fnlist:[{f:0,loop:true,fn:function() {
    if(this.timer<60) this.speed-=4/60
}}]
})
     },{x,y,count:13,length:3})
}
              }}]
          })
  }
},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell35)
const spell36 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 65,
run() {
  const seeds = this.seeds
if (time(600)){
for (let i = 0;i<10;i++) {
wait(() => {
const ax = Math.cos(pfr*2)*15;
const ay = Math.sin(pfr*2)*15;
const x = Half.x+ax;
const y = 30+ay
arc((ev) => {
const s = 7.5+seeds[416].random(-0.75,0.75)
        bullet({
          angle: dtr(ev.deg),
          x: ev.x,
          y: ev.y,
          size: 32,
          type: "fly",
          color: "pink",
          speed:s,
          rd: 0.65,
vsize:48,
custom:{a:s-7.5,s,b:true},
fnlist:[{f:0,loop:true,fn:function() {
    if(this.timer<60) this.speed-=this.custom.s/60
if (this.timer===120) {
this.angle=dtr(seeds[493].random(-180,0)+180)
smooth(this,0.6+seeds[134].random(-0.15,0.15),60,"speed")
}
if (this.timer===600){this.angle+=dtr(180);this.custom.b=false;this.w=24;this.h=24;this.vsize=32}
if(this.custom.b)keep(this)
}}]
})
     },{x,y,count:54,length:3})
},i*6)}}
},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell36)
//8Way全方位ちょうちょブレアリ、最初早い、なめらかに遅くなる、多分反射、浮動する。アングル反転多分あり(完全なる墨染の桜イメージ)

//自機の方へY0Xランダムから高速で振ってくる玉、途中で停止した全方位>30F後に動き出すになる
const spell37 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
if (time())this.prop.s=60;
if(time(90))this.prop.s-=1
  const seeds = this.seeds
const arr =[{c:"yellow",s:5},{c:"red",s:3},{s:1.5,c:"blue"}]
if (time(this.prop.s)){
const k = select(arr)
const x = random(0,canvas.w)
        bullet({
          angle: pf(x,0),
          x: x,
          y: 0,
          size: 32,
          type: "simple",
          color: k.c,
          speed:7,
          rd: 0.65,
fnlist:[{f:0,loop:true,fn:function() {
const p=reverse(this)
if (this.timer===60 || p&&this.timer>6){arc((ev) => {
        bullet({
          angle: dtr(ev.deg),
          x: ev.x,
          y: ev.y,
          size: 32,
          type: "simple",
          color: k.c,
          speed:k.s+0.1,
          rd: 0.65,
vsize:48,
fnlist:[{f:0,loop:true,fn:function() {
    if(this.timer<60) this.speed-=k.s/60;
    if(this.timer>60&&this.timer<120) this.speed+=k.s/60;
}}]
})
     },{x:this.x,y:this.y,count:18,length:0})
this.deleteFrame=0}
}}]
})}},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell37)

const spell38 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
const seeds = this.seeds
if (time(13433333)) {
    arc((ev) => {
        bullet({
          angle: dtr(ev.deg+seeds[30].random(-45,45)),
          x: ev.x,
          y: ev.y,
          size: 32,
          type: "big",
          color: "crim",
          speed:3,
          rd: 0.65,
})
     },{x:Half.x,y:50,count:54,length:0})
}
if (time(15)) {
const x = Math.sin(pfr)*canvas.w
const y = 40
    let base = pf(x,y)
for (let i = 0;i<5;i++) {
    wait(() => {
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"amulet",
color:"red",
speed:0.5,
rd:0.65,
fnlist:[{f:0,fn:function() {
smooth(this,6,180,"speed")
}}]
})
},{spreadDeg:45,count:3,x,y,angle:base})    
},i*6)}
const x2 = Math.cos(pfr)*canvas.w
const y2 = canvas.h
    let base2 = pf(x2,y2)
  for (let i = 0;i<5;i++) {
    wait(() => {
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"amulet",
color:"blue",
speed:0.5,
rd:0.65,
fnlist:[{f:0,fn:function() {
smooth(this,6,180,"speed")
}}]
})
},{spreadDeg:45,count:2,x:x2,y:y2,angle:base2})    
},i*6)}
this.bool = !this.bool
const x3 = this.bool ? 0 : canvas.w
const y3 = Half.y
    let base3 = pf(x3,y3)+dtr(seeds[491].random(-45,45))
for (let i = 0;i<5;i++) {
    wait(() => {
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"amulet",
color:"green",
speed:0.5,
rd:0.65,
fnlist:[{f:0,fn:function() {
smooth(this,6,180,"speed")
}}]
})
},{spreadDeg:45,count:1,x:x3,y:y3,angle:base3})    
},i*6)}
}
},
img: "./noise.png",
  mask: "./",
  maskAlpha: 0,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 1,
}
functions.push(spell38)
//雨が降る！のは嘘かも笑作る予定ないわ多分、
const spell39 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
const seeds = this.seeds
if (time(4)) {
const x = Half.x
const y = 0
    let base = dtr(seeds[134].random(0,180))
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:64,
type:"big2",
color:"red",
speed:0.5+seeds[41].random(-0.5,0.5),
rd:0.65,
fnlist:[{f:0,fn:function() {
smooth(this,6+seeds[426].random(-1.5,1.5),180,"speed")
}}]
})
},{spreadDeg:45,count:3,x,y,angle:base})
}
if (time(12)) {
const x2 = Half.x
const y2 = 0
    let base2 = dtr(seeds[134].random(60,120))
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:64,
type:"big2",
color:"blue",
speed:0.5,
rd:0.65,
fnlist:[{f:0,fn:function() {
smooth(this,8,180,"speed")
}}]
})
},{spreadDeg:45,count:3,x:x2,y:y2,angle:base2})
}
},
img: "./glass.png",
  mask: "./retro.png",
  maskAlpha: 0.6,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell39)
const spell40 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
players[0].hitboxRadius = 16;
players[0].radius = 32;

players[0].h = 64;
const seeds = this.seeds
if (time(15)) {
const x = Half.x
const y = 0
    let base = dtr(seeds[134].random(0,180))
arc((ev) => {
bullet({
    angle:dtr(ev.deg+base),
x:ev.x,
y:ev.y,
size:64,
type:"big2",
color:"red",
speed:3.5,
rd:0.65,
})
},{spreadDeg:45,count:30,x,y,angle:base})
}},
img: "./glass.png",
  mask: "./retro.png",
  maskAlpha: 0.6,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell40)
const spell41 = {
  name: "空間剣｢ディメンショナルスラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
const seeds = this.seeds
if (time(6)) {
const x = 0
const y = 0
    let base = dtr
way((ev) => {
bullet({
    angle:dtr(90),
x:ev.x+random(-15,15),
y:ev.y,
size:32,
type:"polygon",
color:select(rainbowHex),
speed:1.5,
rd:0.4,
vsize:48,
fnlist:[{f:0,fn:function() {
this.angle+=dtr(random(-45,45))
}}]
})
},{count:30,x,y,angle:dtr(90),sx:46,sy:0})
}
},
img: "./glass.png",
  mask: "./retro.png",
  maskAlpha: 0.6,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell41)
const spell42 = {
  name: "空間剣｢悪退札傘｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
if (time(3))this.prop.s=this.seeds[134].random(-45,45)
const seeds = this.seeds
if (time(3)) {
const c = this.prop.s
const x = 0
const y = 0
    let base = dtr
const cc = select(["red","aqua","green","blue","pink",])
way((ev) => {
bullet({
    angle:dtr(90),
x:ev.x+random(-15,15),
y:ev.y,
size:32,
type:"amulet",
color:cc,
speed:1.5,
rd:0.4,
vsize:24,
fnlist:[{f:0,loop:true,fn:function() {
if(this.timer===1)this.angle=pf(this.x,this.y)+dtr(c)
}}]
})
},{count:60,x,y,angle:dtr(90),sx:72,sy:0})
}
},
img: "./glass.png",
  mask: "./retro.png",
  maskAlpha: 0.6,
  maskSpeed: 0.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell42)
//0ーcanvas.wの配列をランダムにそーとして、waitで回してaquaのkunai2をdtr(90)で3つ出す(waitをそれにもかける)そしてf=240で発射、
const spell43 = {
  name: "空間剣｢悪退札傘｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
const seeds = this.seeds
if (time(3)) {
for (let a = 0;a<5;a++)wait(()=>{bullet({
    angle:dtr(90),
x:random(0,canvas.w),
y:0,
size:32,
type:"kunai2",
color:"aqua",
speed:0,
rd:0.4,
vsize:24,
custom:a,
fnlist:[{f:a*3,fn:function() {
smooth(this,this.custom,60,"speed")
}}]
})
},a*18)
}
},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell43)
//Xランダムから降ってくるポリゴン、6Way自機狙いに途中で変更
const spell44 = {
  name: "空間剣｢悪退札傘｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
const seeds = this.seeds
const colors = ["red","blue","green"]
if (time(15)) {
this.prop.s++
const c = colors[normal(this.prop.s,0,colors.length)]
bullet({
    angle:dtr(90),
x:random(0,canvas.w),
y:0,
size:32,
type:"polygon",
color:c,
speed:2,
rd:0.4,
vsize:64,
fnlist:[{f:0,fn:function() {
smooth(this,1.5,60,"speed")
}},{
f:1,fn:function() {
    wayEx((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:64,
type:"polygon",
color:this.color,
speed:0.25,
rd:0.25,
fnlist:[{f:0,fn:function() {
smooth(this,2,30,"speed")
}},{f:60,fn:function(){
    smooth(this,-1.5,240,"speed")
}}]
})
},{spreadDeg:45,count:9,x:this.x,y:this.y,angle:pf(this.x,this.y)+dtr(normal(this.x,-15,15))})
}}]
})
}
},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell44)
//全方位弾とかじきねらい(簡単め)、移動跡にレーザー、F=なんかの指定したフレームに全部同時起動！！！？
const spell45 = {
  name: "真実｢ノストラダムスの大予言｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 20,
run() {
const seeds = this.seeds
if (time(30))bullet({
    angle:pf(Half.x,Half.y),
x:Half.x,
y:Half.y,
size:32,
type:"laser",
color:"yellow",
speed:Infinity,
rd:0.65,
fnlist:[{f:0,loop:true,fn:function(){
if(pfr>17*60&&this.timer>60)this.speed=0
    
}}]
})
if (time(15)) for(let i=1;i<5;i++)bullet({
    angle:pf(Half.x,Half.y),
x:Half.x,
y:Half.y,
size:24,
type:"amulet",
color:"green",
speed:i,
rd:0.65,
})
const cfg = {
waittime:3,
count:54,
}
const o = this.prop.a
this.prop.a+=72;
if (time(cfg.waittime*cfg.count)) {
arc((ev) => {
wait(() => {
for (let i =1;i<4.5;i+=1.5)bullet({
    angle:dtr(ev.deg+o),
x:ev.x,
y:ev.y,
size:24,
type:"scale",
color:"blue",
speed:i,
rd:0.65,
})
},ev.i*cfg.waittime)
},{x:Half.x,y:Half.y,count:cfg.count})
}

const colors = ["red","blue","green"]
if (time(240)) {
this.prop.s+=72;
const a=this.prop.s
const c = colors[normal(this.prop.s,0,colors.length)]
arc((ev) => {
bullet({
    angle:dtr(ev.deg+a),
x:ev.x+random(-5,5),
y:ev.y,
size:32,
type:"normal",
color:"crim",
speed:2,
rd:0.65,
})
},{x:Half.x,y:Half.y,count:18})
}
},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell45)
//弾幕結界(プレイヤーの中心から基準にlength:デカめの四角か全方位、停止、低速でアングル変更とかしながらなんかいい感じにする！)
//ふうまじん(startDegがランダム、waitつけて全方位かしかく！んでn秒後に内側に向かって進む。中心に行くとたまきえる(f調整で頼むわ笑)速度は7.5とかかなアミュレット。これが高頻度で行われてどんどん完成し切る前に隙間をぬけていく！！！)
//スカーレットマイスタみたいなの
const spell46 = {
  name: "真実｢ノストラダムスの大予言｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
/**
 * 配列の始点を変更し、元の順番を保ったままシフト回転させる関数
 * @template T
 * @param {T[]} array - 対象の配列
 * @param {number} [startIndex] - 始点にするインデックス（省略時はランダム）
 * @returns {T[]} - 始点が変更された新しい配列
 */
function shuffle(array, startIndex) {
  if (array.length === 0) return [];

  // インデックスが指定されていない場合はランダムに決定
  const idx = startIndex ?? Math.floor(Math.random() * array.length);

  // 範囲外のインデックスにも対応（余り計算で安全に循環）
  const validIndex = ((idx % array.length) + array.length) % array.length;

  // 始点以降 + 始点より前の部分
  return [...array.slice(validIndex), ...array.slice(0, validIndex)];
}

const seeds = this.seeds
//ふうまじん(startDegがランダム、waitつけて全方位かしかく！んでn秒後に内側に向かって進む。中心に行くとたまきえる(f調整で頼むわ笑)速度は7.5とかかなアミュレット。これが高頻度で行われてどんどん完成し切る前に隙間をぬけていく！！！)
   const cfg = {
waittime:1.00,
count:18,
}
const o = 0
this.prop.a+=72;
const k = 120
if (time(cfg.waittime*(cfg.count*4)+60)) {
let g
square((ev) => {
if(ev.i===cfg.count*4-1)g=ev.rl
},{x:players[0].x,y:players[0].y,count:cfg.count,dist:150})
const gg = shuffle(g,random(0,g.length)).map((e,i)=> ({...e,i:i}))
for(const ev of gg)wait(() => {
bullet({
    angle:dtr(ev.deg+o+180),
x:ev.x,
y:ev.y,
size:24,
type:"amulet",
color:"red",
speed:1,
rd:0,
noAuto:true,
deleteFrame:k,
fnlist:[{f:6,fn:function(){this.rd=0.65}}]
})
bullet({
    angle:dtr(ev.deg+o+180),
x:ev.x,
y:ev.y,
size:24,
type:"polygon",
color:"yellow",
speed:0.525,
rd:0,
noAuto:true,
vsize:48,
deleteFrame:k+30,
fnlist:[{f:6,fn:function(){this.rd=0.65}}]
})
bullet({
    angle:dtr(ev.deg+o),
x:ev.x,
y:ev.y,
size:24,
type:"amulet",
color:"green",
speed:1,
rd:0,
noAuto:true,
deleteFrame:k,
fnlist:[{f:6,fn:function(){this.rd=0.65}}]
})
bullet({
    angle:dtr(ev.deg+o),
x:ev.x,
y:ev.y,
size:32,
type:"gummy",
color:"red",
speed:7,
rd:0.35,
deleteFrame:Infinity,
setlist:[{f:12,e:0}]
})
},ev.i*cfg.waittime)
}
},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell46)
//弾幕結界(プレイヤーの中心から基準にlength:デカめの四角か全方位、停止、低速でアングル変更とかしながらなんかいい感じにする！)
//ふうまじん(startDegがランダム、waitつけて全方位かしかく！んでn秒後に内側に向かって進む。中心に行くとたまきえる(f調整で頼むわ笑)速度は7.5とかかなアミュレット。これが高頻度で行われてどんどん完成し切る前に隙間をぬけていく！！！)
//スカーレットマイスタみたいなの
//バベルの塔 途中でバラける
const spell47 = {
  name: "真実｢ノストラダムスの大予言｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
const seeds = this.seeds
   const cfg = {
waittime:1.00,
count:18,
}
const o = this.prop.a
this.prop.a+=72;
const k = 120
if (time(300,pfr,60)) {
for (let y =-15;y<canvas.h+15;y+=15)wait(()=>{way((ev) => {
bullet({
    angle:dtr(-90),
x:ev.x,
y:ev.y,
size:32,
type:"polygon",
color:"yellow",
speed:0,
rd:0.65,
custom:true,
fnlist:[{f:(120+y/15*3)-1,fn:function(){this.speed=1.4,this.angle+=dtr(180+random(-45,45))
smooth(this,dtr(random(-180,180)),120)
}},{f:120+y/15*3,loop:true,fn:function() {
if(this.timer===150+y/15*3) smooth(this,dtr(random(-45,45)),60)
if(this.custom&&this.y > canvas.h-5) {
const a = reverse(this)
if(a)this.custom=false,smooth(this,dtr(random(-180,180)),120)
}
}}]
})
bullet({
    angle:dtr(-90),
x:ev.x,
y:ev.y,
size:32,
type:"polygon",
color:"yellow",
speed:0,
rd:0.65,
custom:true,
fnlist:[{f:(120+y/15*2)-1,fn:function(){this.speed=1.4,this.angle+=dtr(180+random(-45,45))
smoothSet(this,dtr(random(-1,-180)),30)
}},{f:120+y/15*2,loop:true,fn:function() {
if(this.timer===150+y/15*2) smooth(this,dtr(random(-45,45)),60)
if(this.custom&&this.y > canvas.h-5) {
const a = reverse(this)
if(a)this.custom=false,smoothSet(this,dtr(random(-1,-180)),120)
}
}}]
})
},{x:Half.x-40,y:y,count:5,sx:24})
},60/y*0.15)
}},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell47)
//レーザーの弾痕からレーザーアングルにあった1〜10速度のたま
//夢想封印 72個のBIGなSimpleがレインボーでじきねらいとしてなんかくる
const spell48 = {
  name: "真実｢ノストラダムスの大予言｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 30,
run() {
const seeds = this.seeds
if (time(90,pfr,60)) {
arc((ev) => {
bullet({
    angle:dtr(ev.deg+180),
x:ev.x,
y:ev.y,
size:32,
type:"diamond",
color:"red",
speed:7.5,
rd:0.65,
deleteFrame:20
})
},{x:Half.x,y:100,count:72,length:120})
this.bool = !this.bool
const o = this.bool
arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:64,
type:"simple",
color:select(rainbowHex),
speed:0,
rd:0.65,
custom:o,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer < 60+ev.i*3) {
    this.x += random(-0.35,0.35)
    this.y += random(-0.35,0.35)
}
if (this.timer === 60+ev.i*3 && this.custom) {
this.angle = pf(this.x,this.y)
this.speed = 3.5
}
if (this.timer === 60+ev.i*3 && !this.custom) {
if(ev.i%2===0)this.deleteFrame=0
this.speed = 3.5
}    
}}]
})
},{x:Half.x,y:100,count:72,length:120})
}},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell48)
const spell49 = {
  name: "真実｢ノストラダムスの大予言｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 35,
run() {
const seeds = this.seeds
const Out = 900
if (time(15,pfr,60) && pfr < Out) {
this.bool = !this.bool
const o = this.bool
for (let i = 0;i<15;i++)bullet({
    angle:dtr(90),
x:random(0,canvas.w),
y:0,
size:24,
type:"amulet",
color:"red",
speed:3,
rd:0.65,
fnlist:[{f:0,loop:true,fn:function() {
    keep(this)
if (this.timer === Out+120) {
this.speed = 5;
this.angle=dtr(-90)
}
}}]
})
}

},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell49)
//アミュレットウォーターウォールみたいに弾の列 > 停止 > そのまま3秒後に画面真上以外は即終了のエリアになる
const spell50 = {
  name: "真実｢ノストラダムスの大予言｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "なう(2026/09/30 14:09:53)最後のスペル。自信作。見た目に力入れたり...反射は3回もあるw",
  nm: "演出面に力入れた。自機狙いはない。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 32,
run() {
const seeds = this.seeds
if (time(480)) {
for (let x = 60;x<canvas.w-40;x+=canvas.w/3)arc((ev) => {
wait(()=>{
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"knife",
color:"red",
speed:0,
rd:0.65,
fnlist:[{f:120,fn:function() {
   smooth(this,4,60,"speed")
    this.angle+=dtr(random(-45,45))
}}]
})
bullet({
    angle:dtr(ev.deg+180),
x:ev.x,
y:ev.y,
size:32,
type:"knife",
color:"green",
speed:0,
rd:0.65,
fnlist:[{f:120,fn:function() {
    smooth(this,3.5,60,"speed")
    this.angle+=dtr(random(-45,45))
}}]
})
for (let i =0;i<2;i++)bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"knife",
color:"blue",
speed:0,
rd:0.65,
fnlist:[{f:120,fn:function() {
   smooth(this,2,60,"speed")
    this.angle+=dtr(random(-90,90))
}}]
})
for(let i=0;i<3;i++)bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"knife",
color:"yellow",
speed:0,
rd:0.65,
fnlist:[{f:240,fn:function() {
   smooth(this,5,300,"speed")
    this.angle+=dtr(random(-180,180))
}}]
})
},ev.i*0.75)
},{x,y:72,count:54,length:30})

}},
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell50)
//6個の全方位ナイフだんげん！！