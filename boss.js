import { Entity,Player } from "./chars.js";
import { 
   canvas,ctx, players,bullets,
    updateFrame, frame, Half,entitys,spelln,start,player,internal} from './sys.js';
import {stat,gameLoop} from "./engine.js"
import {bullet,Bullet,CC} from "./bc.js"

import {
dtr,intern,nextTaskId,wait,random,fr,ondebug,sp,sd,fs,itraw,it,gi,normal,circle,reverse,pf,square,triangle,spiral,gspiral
,keep,ccolor,ns,seed,arc,smooth,smoothSet,getArea,pfneo,VSpawn,way,select,corner,smoothFn,Seed,SeedKey,formula,time,setup,look} from "./bullet.js"
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