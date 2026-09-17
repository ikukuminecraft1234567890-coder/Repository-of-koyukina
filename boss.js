import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half,entitys,spelln,start,player,internal} from './sys.js';
import {stat,gameLoop} from "./engine.js"
import {bullet,Bullet,CC} from "./bc.js"

import {
dtr,intern,nextTaskId,wait,random,fr,ondebug,sp,sd,fs,itraw,it,gi,normal,circle,reverse,pf,square,triangle,spiral,gspiral
,keep,ccolor,ns,seed,arc,smooth,smoothSet,getArea,pfneo,VSpawn,way,select,corner,smoothFn,Seed,SeedKey,formula,time,setup,look,pc,wayEx,wr} from "./bullet.js"
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