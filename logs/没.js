const spell13 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
name:"",
desc:"",
hint:"",
ct:"",
list:[],
//自機狙い弾
pe:0,
time:120,
angle:90,
limit:"",
init() {
this.pe = 0
gi(1,[])
}
,
run() {
if (pfr % 120 === 0) {
if (fs(pfr) < 6) {
const startDeg = 0
const Step = 6
for (let i = 0;i<canvas.h;i++) {
wait(() => {
 if (i % 2 === 0) {new Bullet({
    speed: 1, // スピード5
    color: "#FF0058", 
    w: 64, 
    h: 64, 
    type: "big", 
    y: Math.max(0,i / 4), 
    x: entity.x + (Math.sin(i) * 5) + startDeg, 
    angle: i,
}) 
} else {
        new Bullet({
    speed: 1, // スピード5
    color: "#FF0058", 
    w: 64, 
    h: 64, 
    type: "big", 
    y: Math.max(0,i / 4), 
    x: entity.x + (Math.sin(i) * 5) + startDeg, 
    angle:i,
setlist:[{f:60,e:function()  {
this.angle = this.angle +Math.PI
return this.speed + 3
}}]
}) 
}
},i)
}
} else if (fs(pfr) < 15) {
 const startDeg = 0
const Step = 3
for (let i = 0;i<canvas.h;i++) {
wait(() => {
 if (i % 2 === 0) {new Bullet({
    speed: 2, // スピード5
    color: "#FF0058", 
    w: 64, 
    h: 64, 
    type: "big", 
    y: Math.max(0,i / 4), 
    x: entity.x + (Math.sin(i) * 5) + startDeg, 
    angle: i,
})
}},i)}
} else if (fs(pfr) < 25){
 const startDeg = 0
const Step = 3
for (let i = 0;i<canvas.h;i++) 
    wait(() => {new Bullet({
    speed: 3, // スピード5
    color: "#FF0058", 
    w: 64, 
    h: 64, 
    type: "big", 
    y: Math.max(0,i / 4), 
    x: entity.x + (Math.sin(i) * 5) + startDeg, 
    angle:i,
setlist:[{f:60,e:function()  {
this.angle = this.angle +Math.PI
return 1
}},{f:180,e:3}]
})
if (i % 6 === 0)new Bullet({
    speed: 1, // スピード5
    color: "#FF0058", 
    w: 8, 
    h: 8, 
    type: "diamond", 
    y: canvas.h, 
    x: Math.random() * canvas.w, 
    angle:i,
setlist:[{f:0,e:function()  {
this.angle = pf(this.x, this.y, 0, null, 0, Half.x);
return this.speed
}}]
})
},i)
}}
if (fs(pfr) > 33 && fs(pfr) < 80) {
const base = 1
if (pfr % 480 === 0) for (let i = 0;i<canvas.w;i++) {
wait(() => {
for (let a = 0;a<2;a++) {new Bullet({
    speed: 1, // スピード5
    color: "#FF0058", 
    w: 16, 
    h: 16, 
    type: "diamond", 
    y: Half.y + ((Math.random() * 30) - 15), 
    x: i, 
    angle:dtr(Math.random() * 360),
setlist:[{f:0,e:function() {
const cycle = pfr % 240
if (cycle > 60) {return 0.3}else{return base};
},loop:true}]
})
}
},i / 10)
}}

    
}}
const spell999 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
desc:"テスト用",
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
if (pfr % 30 === 0) console.log(bullets.length)
const cycle = pfr % 300
if (cycle % 60 === 0) {
for (let i = 0;i<3000;i++)bullet({
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
functions.push(spell999)
const spell6 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
desc:"テスト用",
hint:"",
ct:"",
speed:1,
list:[],
amount:15,
count:{a:1,b:1,c:0},
//自機狙い弾
prop:{s:true,a:true},
init() {
this.count = {a:1,b:1,c:0}
this.amount=0;
this.speed = 1
this.prop.s=true,this.prop.a=true
gi(1.75)
},
time:60,
run() {
const p = 8
if (pfr % 160 === 0 && 5 > this.count.a) {
this.count.a += 1
bullet({
    speed:3+random(-0.4,-0.2), // スピード5
    color:"DD0D38", 
    w: 48,
    h: 48, 
    type: "amulet",
    y: Half.y + random(-20,20),
    x: Half.x,
    angle: dtr(90),
custom:true,
fnlist:[{f:0,fn:function() {
    if(this.y >= canvas.h - 1  && this.custom) {
this.custom = !this.custom
this.angle = -this.angle
}
if(this.y <= 1  && !this.custom) {
this.custom = !this.custom
this.angle = -this.angle
}},loop:true}]
})
}
if (pfr % 85 === 0 && 5 > this.count.b) {
this.count.b += 1
bullet({
    speed:3+random(-0.1,0.4), // スピード5
    color:"DD0D38", 
    w: 48,
    h: 48, 
    type: "amulet",
    y: Half.y + random(-20,20),
    x: Half.x+32,
    angle: dtr(90),
custom:true,
fnlist:[{f:0,fn:function() {
    if(this.y >= canvas.h - 1  && this.custom) {
this.custom = !this.custom
this.angle = -this.angle
}
if(this.y <= 1  && !this.custom) {
this.custom = !this.custom
this.angle = -this.angle
}},loop:true}]
})
}
if (pfr % 134 === 0 && 5 > this.count.c) {
this.count.c += 1
bullet({
    speed:3 + random(-0.5,0.5), // スピード5
    color:"DD0D38", 
    w: 48,
    h: 48, 
    type: "amulet",
    y: Half.y + random(-20,20),
    x: Half.x-32,
    angle: dtr(90),
custom:true,
fnlist:[{f:0,fn:function() {
    if(this.y >= canvas.h - 1  && this.custom) {
this.custom = !this.custom
this.angle = -this.angle
}
if(this.y <= 1  && !this.custom) {
this.custom = !this.custom
this.angle = -this.angle
}},loop:true}]
})
}}}
const spell7 = { // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
desc:"テスト用",
hint:"",
ct:"",
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
    speed:3, // スピード5
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
    speed:4, // スピード5
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
    speed:2, // スピード5
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

},{count:54})}
if (pfr >=sp(40)) {
const x = pf(Half.x,Half.y)
if (pfr % 90 === 0) for (let i = -15;i<15;i++) {
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
setlist:[{f:60,e:1.5}]
})

}}
if (pfr >=sp(50)) {
if (pfr % 15 === 0) for (let i = 0;i<2;i++) {
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
{ // 修正箇所：改行による宣言の分断を解消し、正しくオブジェクトを代入
desc:"テスト用",
hint:"",
ct:"",
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
    color:"FF2812", 
    w: 24,
    h: 24, 
    type: "scale",
    y: y,
    x: x,
    angle: pf(x,y),
custom:spawn,
fnlist:[{f:0,loop:true,fn:function() {
this.speed += 0.022222
    if (this.custom + Infinity === pfr) {
this.color = "FF2812"
this.speed = 4
this.angle = pf(this.x,this.y)
    }
}}]
})
},i*4)
}}
}}