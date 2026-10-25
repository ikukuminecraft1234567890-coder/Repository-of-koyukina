// boss2.js — シーズン2のスペル定義（ここにスペルを追加していく）
// ・functions は functions.js の共有配列に push する
// ・シーズン2はボスに体力があり、プレイヤーはショットを撃てる。spell の hp: で体力を指定(未指定は1500)
import { stat } from "./engine.js"
import { functions } from "./functions.js"
import { bullet } from "./bc.js"
import {
dtr,intern,nextTaskId,wait,random,fr,ondebug,sp,sd,fs,itraw,it,gi,normal,circle,reverse,pf,square,triangle,spiral,gspiral
,keep,ccolor,ns,seed,arc,smooth,smoothSet,getArea,pfneo,VSpawn,way,select,corner,smoothFn,Seed,SeedKey,formula,time,setup,look,pc,wayEx,wr,snake,end,endd,star,flower,spawn,clamp} from "./bullet.js"
import { Half,entitys,canvas} from "./sys.js"
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

// boss.js と同じグローバル(pfr / entity / gameId)。スペル内で pfr や entity を直接使えるようにする
Object.defineProperties(globalThis, {
    pfr: { get() { return stat.pfr; }, set(v) { stat.pfr = v; } },
    entity: { get() { return stat.entity; }, set(v) { stat.entity = v; } },
    gameId: { get() { return stat.gameId; }, set(v) { stat.gameId = v; } }
});

export { functions }

const spell1 = {
    name: "テスト｢シーズン2｣",
    dif: "n",
    desc: "シーズン2の動作確認用スペル。",
    hint: "ショット(Zキー)でボスの体力を削ろう",
    ct: "クリア！",
    nm: "ノーミス！",
    hp: 1000,
    seeds: [],
    prop: { s: 0, a: 1, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
    init() { setup(this) },
    time: 30,
    run() {
        if (time(30)) {
            this.prop.a += 7
            const a = this.prop.a
            arc((ev) => {
                bullet({
                    angle: dtr(ev.deg + a),
                    x: ev.x, y: ev.y,
                    size: 16, type: "normal", color: "red",
                    speed: 1.5, rd: 0.65,
                })
            }, { x: Half.x, y: Half.y - 80, count: 24 })
        }
    },
    img: "./noise.png",
    mask: "./",
    maskAlpha: 0,
    maskSpeed: 0.15,
    imgSpeed: 1,
    imgAlpha: 1,
}
functions.push(spell1)

const spell2 = {
  name: "閃光｢ボムフラッシュ｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "ああそうだ、これだよねシューティングはw俺の長らくシューティングしてないんでwという訳でこれは元々スペル55たったやつを移植した。気に入ってるので新シーズンに使おうかなとw今からスペル3作るよーんなう(2026/10/21 23:42:39)",
  nm:"最近からはなんか簡単寄りになってる。偉いかも？",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 60,
hp:3750,
run() {
if(time())this.prop.a=18;
const seeds = this.seeds
if (time(135)) {
this.prop.a += 7
this.prop.s++
const c = rainbow[normal(this.prop.s,0,rainbow.length)]
for(let i = 0;i<3;i++) arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"light",
color:c,
speed:0,
glow:1.25,
gglow:0.85,
rd:0.65,
fnlist:[{f:120+i*30,fn:function() {
this.angle+=dtr(seeds[731].random(-25,25))
smooth(this,dtr(360),60)
this.speed=7.5}},{f:181+i*30,fn:function() {smooth(this,-6.5,60,"speed")
    smooth(this,-0.35,60,"glow")
    smooth(this,-0.5,60,"gglow")
}}]
})
},{x:Half.x,y:Half.y - 100,count:this.prop.a,length:0})
    
}},
//y:448*2,
//x:384*2,
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell2)
const spell3 = {
  name: "人形｢センサー搭載ドローン｣",
  dif: "n",
  desc: "",
  hint: "",
  ct: "STGらしくそれっぽい敵召喚を。機体差で難易度感はかなり変わると思う。一応雑魚機体も居るのでクリア状況は全機体合わせてにしてる(めんどかっただけ)",
  nm: "珍しいタイプの試み。クラピ使えば初動合わせたり、誘導で安定をしたりとやり方は色々ある",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 60,
hp:1750,
run() {
const seeds = this.seeds
if (entitys.some(e=>e.name==="enemy")) entity.hp=this.prop.s
entitys.filter(e=>e.name==="enemy").forEach((e) => {
if (e.timer===120)e.mov(player.x,canvas.h+300)
if (time(99999, e.timer, 120,30)) {
const rand = random(-45,45)
console.log(e.id ?? e.x, rand)
 arc((ev) => {
bullet({
    angle:dtr(ev.deg+rand),
x:ev.x,
y:ev.y,
size:32,
type:"big",
color:"aqua",
speed:3,
rd:0.65,
fnlist:[{f:0,fn:function() {
smooth(this,-2,30,"speed")
}}]
})
},{x:e.x,y:e.y,count:8,length:16})
}
})
if (time(120)) {
this.prop.a += 72;
const k = this.prop.a
arc((ev) => {
bullet({
    angle:dtr(ev.deg+k),
x:ev.x,
y:ev.y,
size:32,
type:"scale",
color:"red",
speed:7.5,
rd:0.65,
fnlist:[{f:0,fn:function() {
smooth(this,-6,30,"speed")
}}]
})
},{x:entity.x,y:entity.y,count:72,length:0})
}
if (time(600)) {
this.prop.s = entity.hp
for (let i = 0;i<100;i++) {
const pos = {
  x: entity.x + seeds[7943].random(-100, 100),
  y: entity.y + seeds[1321].random(-50, 50)
}
wait(() => {spawn({x:pos.x,y:pos.y,hp:20,radius:32,color:"blue",speed:1.2})
},i)
}}},
//y:448*2,
//x:384*2,
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell3)
//あやのしょっとはないけど定期的にまあまあな範囲の玉消し


//にいろれんかちょう。赤と青
const spell4 = {
  name: "二色蓮花蝶 ～Red and White",
  dif: "n",
  desc: "",
  hint: "",
  ct: "個人的傑作。好きな曲をイメージして作ったら神弾幕になった！交差弾かつ見た目もいい。簡単すぎたかも",
  nm: "新シーズン開幕から個人的傑作が既に一つ。マジでこれは神だと思う。",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 60,
hp:4500,
run() {
const seeds = this.seeds
const x = Half.x;
const y = 120
if (time(60)) {
this.prop.a += 72;
this.bool = !this.bool;
const color = this.bool ? "red" : "white"
const wayArg = this.bool ? {x:0,y:0,sx:15,sy:15,a:0,} : {x:canvas.w,y:canvas.h,sx:-15,sy:-15,a:-180}
const k = this.prop.a
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:x,
y:y,
size:32,
type:"fly",
color,
speed:7.5,
vsize:64,
noAuto:true,
rd:0.65,
custom:2,
fnlist:[{f:0,fn:function() {
smooth(this,-6.5,45,"speed")
}},{f:60,fn:function() {
    smooth(this,dtr(180),30)
smooth(this,3.5,45,"speed")
}},
{f:180,fn:function() {
    smooth(this,dtr(180+90+seeds[6312].random(-45,45)),30)
smooth(this,-3.5,45,"speed")
}},
{f:181,loop:true,fn:function() {
if (this.custom > 0&&this.y<canvas.h-16){
const a = reverse(this)
if (a)this.custom-=1
}
}},
]
})
},{count:36,x:wayArg.x,y:wayArg.y,sx:wayArg.sx,sy:wayArg.sy,angle:dtr(wayArg.a)})
}},
//y:448*2,
//x:384*2,
img: "./cloud.png",
  mask: "./water.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 1,
  imgAlpha: 0.95,
}
functions.push(spell4)
//wayのワインダーにしたらいいかも
//守屋の鉄の輪(クソデカEditで内側はいるのメイン、noAuto、arcで角度固定)

//二色蓮花蝶 ～Red and White(覚醒)
//全方位青弾追加、カウント増殖、耐久アップ
const spell5 = {
  name: "二色蓮花蝶 ～Red and White(夜)",
  dif: "l",
  desc: "",
  hint: "",
  ct: "なーにやってんの？wはいなーにやってんの？wはい！やりたりないからやってんのー？！？！？じゃなくて神弾幕を純粋強化した。やりたりなかったwWay増加、全方位弾追加と純粋に強い。耐久は下げたのでね",
  nm: "むずくしすぎたw上振れで1Mクリアしたけど上振れは上振れ笑",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 60,
hp:2500,
run() {
const seeds = this.seeds
const x = Half.x;
const y = 120
if (time(90)) {
this.prop.s+=72;
const o = this.prop.s
    arc((ev) => {
bullet({
    angle:dtr(ev.deg+o),
x:x,
y:y,
size:32,
type:"amulet",
color:"aqua",
speed:0.5,
rd:0.65,
})
bullet({
    angle:dtr(ev.deg),
x:x,
y:y,
size:32,
type:"amulet",
color:"aqua",
speed:2.5,
rd:0.65,
})
},{count:27,x:entity.x,y:entity.y,length:30})
}
if (time(60)) {
this.prop.a += 72;
this.bool = !this.bool;
const color = this.bool ? "red" : "white"
const wayArg = this.bool ? {x:0,y:0,sx:15,sy:15,a:0,} : {x:canvas.w,y:canvas.h,sx:-15,sy:-15,a:-180}
const k = this.prop.a
way((ev) => {
bullet({
    angle:dtr(ev.deg),
x:x,
y:y,
size:32,
type:"fly",
color,
speed:7.5,
vsize:64,
noAuto:true,
rd:0.65,
custom:2,
fnlist:[{f:0,fn:function() {
smooth(this,-6.5,45,"speed")
}},{f:60,fn:function() {
    smooth(this,dtr(180),30)
smooth(this,3.5,45,"speed")
}},
{f:180,fn:function() {
    smooth(this,dtr(180+90+seeds[6312].random(-45,45)),30)
smooth(this,-3.5,45,"speed")
}},
{f:181,loop:true,fn:function() {
if (this.custom > 0&&this.y<canvas.h-16){
const a = reverse(this)
if (a)this.custom-=1
}
}},
]
})
},{count:45,x:wayArg.x,y:wayArg.y,sx:wayArg.sx,sy:wayArg.sy,angle:dtr(wayArg.a)}) 
}},
//y:448*2,
//x:384*2,
img: "./cloud.png",
  mask: "./dark.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 6,
  imgAlpha: 0.95,
}
functions.push(spell5)
const spell6 = {
  name: "幾何学｢弾幕模様｣",
  dif: "l",
  desc: "",
  hint: "",
  ct: "簡単な8Way全方位連打からのトレース配置の反射。トレース避けは難易度高いけどまあまあまあよく見ればそんなに。当たり判定下げたし",
  nm: "高難易度気合い。シードとはいえむずいわ。右避けしか知らない笑",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 60,
hp:3500,
run() {
const seeds = this.seeds
const x = Half.x;
const y = 120 
if (time(1200)) {
for (let i = 0;i<10;i++) {
wait(() => {
this.prop.s+=72;
const o = this.prop.s
    arc((ev) => {
bullet({
    angle:dtr(ev.deg+o),
x:x,
y:y,
size:32,
type:"gummy",
color:"red",
speed:7.5,
noAuto:true,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer===0)smooth(this,-3.5,30,"speed")
if (time(60,this.timer)) {
for( let i = -180;i<360;i+=180)bullet({
    angle:dtr(i),
x:this.x,
y:this.y,
size:32,
type:"gummy",
color:"red",
rd:0.45,
speed:0.5,
custom:true,
fnlist:[{f:0,loop:true,fn:function() {
if (this.custom) {
const a =reverse(this)
if(a) {
    this.custom=false;
this.angle=dtr(seeds[7319].random(-180,180))
smooth(this,0.5,120,"speed")
}
}
}}]
})
}}
}],
})
},{count:27,x:entity.x,y:entity.y,length:30})
},i*18)
}}},
//y:448*2,
//x:384*2,
img: "./cloud.png",
  mask: "./dark.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 6,
  imgAlpha: 0.95,
}
functions.push(spell6)
const spell7 = {
  name: "散弾｢自機外し爆裂｣",
  dif: "h",
  desc: "",
  hint: "",
  ct: "自機から出る全方位反射。すごく生理的に避けづらい。弾数に対してむずいよこれ。なう(2026/10/25 20:41:27)最後のスペル。新シーズン開幕ということで7枚作った。変化球多めなのは反省点かも。誘導なら斜め移動でギリ耐える",
  nm: "なう(2026/10/25 20:42:06)最後のスペル。新シーズン開幕にしては悪くない出来。誘導が無難に強いかな〜ここは",
  seeds: [],
  prop: { s: 0, a: 0, rng: { s: 999 }, bool: false, x: 0, y: 0, step: 0, shrink: 0, speed: 0 },
  arr: [],
  init() { setup(this) },
  time: 60,
hp:1500,
run() {
const seeds = this.seeds
const x = Half.x;
const y = 120 
if (time(30,pfr,60)) {
this.prop.s+=72;
const o = this.prop.s
    arc((ev) => {
bullet({
    angle:dtr(ev.deg),
x:ev.x,
y:ev.y,
size:32,
type:"gummy",
color:"red",
rd:0.65,
speed:7.5,
custom:true,
fnlist:[{f:0,loop:true,fn:function() {
if (this.timer===0) smooth(this,-5,60,"speed")
if (this.custom) {
const a =reverse(this)
if(a) {
    this.custom=false;
}
}
}}]
})
},{count:8,x:player.x,y:player.y,length:16})
}},
//y:448*2,
//x:384*2,
img: "./cloud.png",
  mask: "./dark.png",
  maskAlpha: 0.6,
  maskSpeed: 4.15,
  imgSpeed: 6,
  imgAlpha: 0.95,
}
functions.push(spell7)